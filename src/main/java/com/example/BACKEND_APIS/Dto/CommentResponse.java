package com.example.BACKEND_APIS.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor

public class CommentResponse {

    private Long id;
    private String content;
    private String authorUsername;
    private LocalDateTime createdAt;
}
