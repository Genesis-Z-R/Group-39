package com.bisa.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "fact_check")
public class FactCheck {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Post post;

    @Column(columnDefinition = "TEXT")
    private String contentAnalyzed;

    private Double accuracyScore; // 0.0 to 1.0
    private String validityStatus; // "TRUE", "FALSE", "MISLEADING", "UNVERIFIABLE", "PARTIALLY_TRUE"
    private String confidenceLevel; // "HIGH", "MEDIUM", "LOW"
    
    @Column(columnDefinition = "TEXT")
    private String aiAnalysis;
    
    @Column(columnDefinition = "TEXT")
    private String sourcesCited;
    
    @Column(columnDefinition = "TEXT")
    private String corrections;
    
    @Column(columnDefinition = "TEXT")
    private String reasoning;
    
    private Instant checkedAt;
    private String checkedBy; // User ID or system identifier

    public FactCheck() {
        this.checkedAt = Instant.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Post getPost() { return post; }
    public void setPost(Post post) { this.post = post; }

    public String getContentAnalyzed() { return contentAnalyzed; }
    public void setContentAnalyzed(String contentAnalyzed) { this.contentAnalyzed = contentAnalyzed; }

    public Double getAccuracyScore() { return accuracyScore; }
    public void setAccuracyScore(Double accuracyScore) { this.accuracyScore = accuracyScore; }

    public String getValidityStatus() { return validityStatus; }
    public void setValidityStatus(String validityStatus) { this.validityStatus = validityStatus; }

    public String getConfidenceLevel() { return confidenceLevel; }
    public void setConfidenceLevel(String confidenceLevel) { this.confidenceLevel = confidenceLevel; }

    public String getAiAnalysis() { return aiAnalysis; }
    public void setAiAnalysis(String aiAnalysis) { this.aiAnalysis = aiAnalysis; }

    public String getSourcesCited() { return sourcesCited; }
    public void setSourcesCited(String sourcesCited) { this.sourcesCited = sourcesCited; }

    public String getCorrections() { return corrections; }
    public void setCorrections(String corrections) { this.corrections = corrections; }

    public String getReasoning() { return reasoning; }
    public void setReasoning(String reasoning) { this.reasoning = reasoning; }

    public Instant getCheckedAt() { return checkedAt; }
    public void setCheckedAt(Instant checkedAt) { this.checkedAt = checkedAt; }

    public String getCheckedBy() { return checkedBy; }
    public void setCheckedBy(String checkedBy) { this.checkedBy = checkedBy; }
} 