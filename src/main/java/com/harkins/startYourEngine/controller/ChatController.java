package com.harkins.startYourEngine.controller;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.QuestionAnswerAdvisor;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.ai.vectorstore.VectorStore;
import org.springframework.web.bind.annotation.*;

@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
@RestController
@RequestMapping("user/chat")
public class ChatController {
    OllamaChatModel ollamaChatModel;
    VectorStore vectorStore;

    public ChatController(OllamaChatModel ollamaChatModel, VectorStore vectorStore) {
        this.ollamaChatModel = ollamaChatModel;
        this.vectorStore = vectorStore;
    }

    @PostMapping
    public String chat(@RequestBody String message) {
        return ChatClient.builder(ollamaChatModel)
                .build()
                .prompt()
                .advisors(new QuestionAnswerAdvisor(vectorStore))
                .user(message)
                .call()
                .content();
    }
}
