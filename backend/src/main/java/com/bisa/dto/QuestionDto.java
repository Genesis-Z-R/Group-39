package com.bisa.dto;

import java.time.LocalDateTime;
import java.util.List;

public class QuestionDto {
    private Long id;
    private String title;
    private String content;
    private List<String> tags;
    private List<String> images;
    private UserDto author;
    private Integer upvotes;
    private Integer downvotes;
    private Integer views;
    private Boolean isAnswered;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<AnswerDto> answers;
    private List<CommentDto> comments;
    
    // Constructors
    public QuestionDto() {}
    
    public QuestionDto(Long id, String title, String content, UserDto author) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.author = author;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public List<String> getTags() {
        return tags;
    }
    
    public void setTags(List<String> tags) {
        this.tags = tags;
    }
    
    public List<String> getImages() {
        return images;
    }
    
    public void setImages(List<String> images) {
        this.images = images;
    }
    
    public UserDto getAuthor() {
        return author;
    }
    
    public void setAuthor(UserDto author) {
        this.author = author;
    }
    
    public Integer getUpvotes() {
        return upvotes;
    }
    
    public void setUpvotes(Integer upvotes) {
        this.upvotes = upvotes;
    }
    
    public Integer getDownvotes() {
        return downvotes;
    }
    
    public void setDownvotes(Integer downvotes) {
        this.downvotes = downvotes;
    }
    
    public Integer getViews() {
        return views;
    }
    
    public void setViews(Integer views) {
        this.views = views;
    }
    
    public Boolean getIsAnswered() {
        return isAnswered;
    }
    
    public void setIsAnswered(Boolean isAnswered) {
        this.isAnswered = isAnswered;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public List<AnswerDto> getAnswers() {
        return answers;
    }
    
    public void setAnswers(List<AnswerDto> answers) {
        this.answers = answers;
    }
    
    public List<CommentDto> getComments() {
        return comments;
    }
    
    public void setComments(List<CommentDto> comments) {
        this.comments = comments;
    }
} 