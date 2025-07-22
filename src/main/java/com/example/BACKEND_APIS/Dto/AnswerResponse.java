package com.example.BACKEND_APIS.Dto;


import lombok.*;

@Data
@NoArgsConstructor
public class AnswerResponse {

    private Long id;
    private String content;
    private String author;
    private int upvotes;
    private int downvotes;

    // Constructor
    public AnswerResponse(Long id, String content, String author, int upvotes, int downvotes) {
        this.id = id;
        this.content = content;
        this.author = author;
        this.upvotes = upvotes;
        this.downvotes = downvotes;
    }
}
