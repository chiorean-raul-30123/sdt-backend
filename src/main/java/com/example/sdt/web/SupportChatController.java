package com.example.sdt.web;
import com.example.sdt.service.SupportAiService;
import com.example.sdt.web.dto.SupportChatDto.ChatRequest;
import com.example.sdt.web.dto.SupportChatDto.ChatResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/support")
public class SupportChatController {

    private final SupportAiService aiService;

    public SupportChatController(SupportAiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<ChatResponse> chat(
            @RequestBody ChatRequest body,
            Authentication auth
    ) {
        String msg = body.message == null ? "" : body.message.trim();
        if (msg.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String email = (auth != null && auth.getName() != null)
                ? auth.getName()
                : "anonymous";

        String reply = aiService.answerForUser(email, msg);
        return ResponseEntity.ok(new ChatResponse(reply, body.conversationId));
    }
}
