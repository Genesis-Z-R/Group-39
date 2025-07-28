package com.bisa.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class FactCheckResponse {
    @JsonProperty("accuracy_score")
    private Double accuracyScore;
    
    @JsonProperty("validity_status")
    private String validityStatus;
    
    @JsonProperty("confidence_level")
    private String confidenceLevel;
    
    @JsonProperty("analysis")
    private String analysis;
    
    @JsonProperty("sources")
    private List<String> sources;
    
    @JsonProperty("corrections")
    private List<String> corrections;
    
    @JsonProperty("reasoning")
    private String reasoning;
    
    @JsonProperty("factual_claims")
    private List<FactualClaim> factualClaims;

    public FactCheckResponse() {}

    // Getters and Setters
    public Double getAccuracyScore() { return accuracyScore; }
    public void setAccuracyScore(Double accuracyScore) { this.accuracyScore = accuracyScore; }

    public String getValidityStatus() { return validityStatus; }
    public void setValidityStatus(String validityStatus) { this.validityStatus = validityStatus; }

    public String getConfidenceLevel() { return confidenceLevel; }
    public void setConfidenceLevel(String confidenceLevel) { this.confidenceLevel = confidenceLevel; }

    public String getAnalysis() { return analysis; }
    public void setAnalysis(String analysis) { this.analysis = analysis; }

    public List<String> getSources() { return sources; }
    public void setSources(List<String> sources) { this.sources = sources; }

    public List<String> getCorrections() { return corrections; }
    public void setCorrections(List<String> corrections) { this.corrections = corrections; }

    public String getReasoning() { return reasoning; }
    public void setReasoning(String reasoning) { this.reasoning = reasoning; }

    public List<FactualClaim> getFactualClaims() { return factualClaims; }
    public void setFactualClaims(List<FactualClaim> factualClaims) { this.factualClaims = factualClaims; }

    // Inner class for individual factual claims
    public static class FactualClaim {
        @JsonProperty("claim")
        private String claim;
        
        @JsonProperty("verification_status")
        private String verificationStatus;
        
        @JsonProperty("confidence")
        private Double confidence;
        
        @JsonProperty("explanation")
        private String explanation;

        public FactualClaim() {}

        public String getClaim() { return claim; }
        public void setClaim(String claim) { this.claim = claim; }

        public String getVerificationStatus() { return verificationStatus; }
        public void setVerificationStatus(String verificationStatus) { this.verificationStatus = verificationStatus; }

        public Double getConfidence() { return confidence; }
        public void setConfidence(Double confidence) { this.confidence = confidence; }

        public String getExplanation() { return explanation; }
        public void setExplanation(String explanation) { this.explanation = explanation; }
    }
} 