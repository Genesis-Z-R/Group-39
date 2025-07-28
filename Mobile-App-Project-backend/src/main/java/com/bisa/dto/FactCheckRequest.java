package com.bisa.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FactCheckRequest {
    @JsonProperty("content")
    private String content;
    
    @JsonProperty("question")
    private String question;
    
    @JsonProperty("context")
    private String context;

    public FactCheckRequest() {}

    public FactCheckRequest(String content, String question, String context) {
        this.content = content;
        this.question = question;
        this.context = context;
    }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }
} 