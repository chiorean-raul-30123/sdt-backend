package com.example.sdt.web.dto;

public class SupportChatDto {

    public static class ChatRequest {
        public String message;
        public String conversationId;
    }

    public static class ChatResponse {
        public String reply;
        public String conversationId;

        public ChatResponse(String reply, String conversationId) {
            this.reply = reply;
            this.conversationId = conversationId;
        }
    }
}
