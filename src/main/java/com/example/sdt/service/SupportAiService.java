package com.example.sdt.service;

import com.example.sdt.domain.PackageDelivery;
import com.example.sdt.repo.PackageRepository;
import com.example.sdt.security.User;
import com.example.sdt.security.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SupportAiService {

    private final WebClient webClient;
    private final PackageRepository packageRepo;
    private final UserRepository userRepo;

    @Value("${gemini.api.key}")
    private String geminiApiKey;


    private static final String GEMINI_PATH =
            "/v1beta/models/gemini-2.5-flash-lite:generateContent";

    public SupportAiService(PackageRepository packageRepo, UserRepository userRepo) {
        this.packageRepo = packageRepo;
        this.userRepo = userRepo;

        this.webClient = WebClient.builder()
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
    }

    public String answerForUser(String email, String userMessage) {

        User user = userRepo.findByEmail(email).orElse(null);
        Long customerId = user != null ? user.getCustomerId() : null;

        List<PackageDelivery> recent = customerId == null
                ? List.of()
                : packageRepo.findTop5BySenderIdOrderByIdDesc(customerId);

        String packagesSummary = recent.isEmpty()
                ? "Userul nu are colete recente."
                : recent.stream()
                .map(p -> String.format(
                        "Pachet #%d, tracking %s, status %s, de la '%s' la '%s'.",
                        p.getId(), p.getTrackingCode(), p.getStatus(),
                        p.getPickupAddress(), p.getDeliveryAddress()
                ))
                .collect(Collectors.joining("\n"));

        String systemPrompt = """
                Ești un asistent de suport pentru aplicația Smart Delivery Tracker.
                Vorbești în română, pe scurt și clar.
                Poți explica statusurile coletelor (NEW, PENDING, DELIVERED),
                pașii de livrare și poți descrie coletele recente ale userului.

                Nu inventa date de tracking care nu există.
                Dacă userul întreabă de un tracking necunoscut, spune că nu îl găsești
                și sugerează să verifice codul sau să contacteze suportul.

                Colete recente ale utilizatorului:
                """ + packagesSummary;


        var contents = List.of(
                Map.of(
                        "role", "user",
                        "parts", List.of(Map.of("text", systemPrompt))
                ),
                Map.of(
                        "role", "user",
                        "parts", List.of(Map.of("text", userMessage))
                )
        );

        var requestBody = Map.of("contents", contents);

        try {
            Map<?, ?> response = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path(GEMINI_PATH)
                            .queryParam("key", geminiApiKey)
                            .build()
                    )
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            if (response == null) {
                return "Nu am primit niciun răspuns de la sistemul AI.";
            }

            var candidates = (List<?>) response.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                return "Nu am reușit să generez un răspuns.";
            }

            var first = (Map<?, ?>) candidates.get(0);
            var content = (Map<?, ?>) first.get("content");
            var parts = (List<?>) content.get("parts");
            var p0 = (Map<?, ?>) parts.get(0);
            Object text = p0.get("text");
            return text != null ? text.toString() : "Nu am reușit să generez un răspuns.";
        } catch (WebClientResponseException e) {
            System.err.println("Gemini API error: " + e.getStatusCode() + " " + e.getResponseBodyAsString());
            return "Momentan sistemul de asistență AI nu este disponibil. Încearcă din nou mai târziu.";
        } catch (Exception e) {
            e.printStackTrace();
            return "A apărut o eroare la generatorul AI.";
        }
    }
}
