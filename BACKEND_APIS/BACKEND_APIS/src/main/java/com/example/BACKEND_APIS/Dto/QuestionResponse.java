package com.example.BACKEND_APIS.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter

public class QuestionResponse {

    // Getters
    private final Long id;
    private final String title;
    private final String content;
    private final String author;

    public QuestionResponse(Long id, String title, String content, String author) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
    }

}
