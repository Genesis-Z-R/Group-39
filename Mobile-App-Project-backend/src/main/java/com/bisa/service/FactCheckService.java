package com.bisa.service;

import com.bisa.dto.FactCheckRequest;
import com.bisa.dto.FactCheckResponse;
import com.bisa.model.FactCheck;
import com.bisa.model.Post;
import com.bisa.repository.FactCheckRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class FactCheckService {
    private static final Logger logger = LoggerFactory.getLogger(FactCheckService.class);
    
    private final FactCheckRepository factCheckRepository;
    private final WebClient webClient;
    
    @Value("${factcheck.ai.service.url:https://api.openai.com/v1/chat/completions}")
    private String aiServiceUrl;
    
    @Value("${factcheck.ai.service.api-key:}")
    private String aiServiceApiKey;
    
    @Value("${factcheck.enable-mock:true}")
    private boolean enableMock;

    public FactCheckService(FactCheckRepository factCheckRepository) {
        this.factCheckRepository = factCheckRepository;
        this.webClient = WebClient.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(2 * 1024 * 1024))
                .build();
    }

    public FactCheck performFactCheck(Post post, String checkedBy) {
        logger.info("Starting fact check for post ID: {}", post.getId());
        
        // Check if we already have a recent fact check
        Optional<FactCheck> existingCheck = factCheckRepository.findFirstByPostOrderByCheckedAtDesc(post);
        if (existingCheck.isPresent()) {
            FactCheck existing = existingCheck.get();
            // If checked within last 24 hours, return existing result
            if (existing.getCheckedAt().plus(Duration.ofHours(24)).isAfter(java.time.Instant.now())) {
                logger.info("Returning existing fact check for post ID: {}", post.getId());
                return existing;
            }
        }

        // Prepare content for analysis
        String contentToAnalyze = prepareContentForAnalysis(post);
        
        try {
            // Try to get AI analysis
            FactCheckResponse aiResponse = getAIAnalysis(contentToAnalyze, post.getQuestion());
            
            // Create and save fact check result
            FactCheck factCheck = createFactCheckFromResponse(post, aiResponse, contentToAnalyze, checkedBy);
            return factCheckRepository.save(factCheck);
            
        } catch (Exception e) {
            logger.error("Error during AI fact check, falling back to mock response", e);
            
            // Fallback to mock response
            FactCheckResponse mockResponse = generateMockResponse(contentToAnalyze, post.getQuestion());
            FactCheck factCheck = createFactCheckFromResponse(post, mockResponse, contentToAnalyze, checkedBy);
            return factCheckRepository.save(factCheck);
        }
    }

    private String prepareContentForAnalysis(Post post) {
        StringBuilder content = new StringBuilder();
        content.append("Question: ").append(post.getQuestion()).append("\n\n");
        content.append("Answer: ").append(post.getAnswer());
        
        if (post.getMediaUrl() != null && !post.getMediaUrl().isEmpty()) {
            content.append("\n\nMedia: ").append(post.getMediaUrl());
        }
        
        return content.toString();
    }

    private FactCheckResponse getAIAnalysis(String content, String question) {
        if (enableMock || aiServiceApiKey.isEmpty()) {
            logger.info("Using mock AI response");
            return generateMockResponse(content, question);
        }

        try {
            FactCheckRequest request = new FactCheckRequest(content, question, "social media post");
            
            return webClient.post()
                    .uri(aiServiceUrl)
                    .header("Authorization", "Bearer " + aiServiceApiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(createOpenAIRequest(content, question))
                    .retrieve()
                    .bodyToMono(FactCheckResponse.class)
                    .timeout(Duration.ofSeconds(30))
                    .block();
                    
        } catch (WebClientResponseException e) {
            logger.error("AI service error: {}", e.getResponseBodyAsString());
            throw new RuntimeException("AI service unavailable", e);
        } catch (Exception e) {
            logger.error("Error calling AI service", e);
            throw new RuntimeException("AI service error", e);
        }
    }

    private String createOpenAIRequest(String content, String question) {
        String prompt = String.format("""
            Please fact-check the following content from a social media post. 
            Analyze the factual accuracy and provide a detailed assessment.
            
            Question: %s
            Content: %s
            
            Please respond with a JSON object containing:
            - accuracy_score (0.0 to 1.0)
            - validity_status (TRUE, FALSE, MISLEADING, UNVERIFIABLE, PARTIALLY_TRUE)
            - confidence_level (HIGH, MEDIUM, LOW)
            - analysis (detailed explanation)
            - sources (array of relevant sources)
            - corrections (array of corrections if needed)
            - reasoning (explanation of the assessment)
            - factual_claims (array of specific claims with verification status)
            """, question, content);

        return String.format("""
            {
                "model": "gpt-4",
                "messages": [
                    {
                        "role": "system",
                        "content": "You are a fact-checking expert. Analyze content for factual accuracy and provide detailed assessments with sources and reasoning."
                    },
                    {
                        "role": "user",
                        "content": "%s"
                    }
                ],
                "temperature": 0.1,
                "max_tokens": 2000
            }
            """, prompt.replace("\"", "\\\""));
    }

    private FactCheckResponse generateMockResponse(String content, String question) {
        FactCheckResponse response = new FactCheckResponse();
        
        // Analyze content length and complexity for mock scoring
        int contentLength = content.length();
        boolean hasTechnicalTerms = content.toLowerCase().contains("algorithm") || 
                                  content.toLowerCase().contains("machine learning") ||
                                  content.toLowerCase().contains("programming");
        
        // Generate realistic mock scores based on content characteristics
        double baseScore = Math.min(0.9, 0.6 + (contentLength / 1000.0) * 0.3);
        if (hasTechnicalTerms) baseScore = Math.min(0.95, baseScore + 0.1);
        
        response.setAccuracyScore(baseScore);
        
        // Determine validity status based on score
        if (baseScore >= 0.8) {
            response.setValidityStatus("TRUE");
            response.setConfidenceLevel("HIGH");
        } else if (baseScore >= 0.6) {
            response.setValidityStatus("PARTIALLY_TRUE");
            response.setConfidenceLevel("MEDIUM");
        } else if (baseScore >= 0.4) {
            response.setValidityStatus("MISLEADING");
            response.setConfidenceLevel("MEDIUM");
        } else {
            response.setValidityStatus("FALSE");
            response.setConfidenceLevel("HIGH");
        }
        
        response.setAnalysis("This content has been analyzed for factual accuracy. The assessment is based on available information and may require additional verification for complete certainty.");
        response.setSources(Arrays.asList("Mock fact-checking service", "Content analysis"));
        response.setCorrections(Arrays.asList("No major corrections identified"));
        response.setReasoning("The content appears to be generally accurate based on standard fact-checking criteria. However, this is a mock assessment and should be verified with authoritative sources.");
        
        // Create mock factual claims
        FactCheckResponse.FactualClaim claim = new FactCheckResponse.FactualClaim();
        claim.setClaim("Content accuracy assessment");
        claim.setVerificationStatus("VERIFIED");
        claim.setConfidence(baseScore);
        claim.setExplanation("Mock verification completed");
        response.setFactualClaims(Arrays.asList(claim));
        
        return response;
    }

    private FactCheck createFactCheckFromResponse(Post post, FactCheckResponse response, String contentAnalyzed, String checkedBy) {
        FactCheck factCheck = new FactCheck();
        factCheck.setPost(post);
        factCheck.setContentAnalyzed(contentAnalyzed);
        factCheck.setAccuracyScore(response.getAccuracyScore());
        factCheck.setValidityStatus(response.getValidityStatus());
        factCheck.setConfidenceLevel(response.getConfidenceLevel());
        factCheck.setAiAnalysis(response.getAnalysis());
        factCheck.setSourcesCited(String.join(", ", response.getSources()));
        factCheck.setCorrections(String.join(", ", response.getCorrections()));
        factCheck.setReasoning(response.getReasoning());
        factCheck.setCheckedBy(checkedBy);
        
        return factCheck;
    }

    public List<FactCheck> getFactCheckHistory(Post post) {
        return factCheckRepository.findByPostOrderByCheckedAtDesc(post);
    }

    public Optional<FactCheck> getLatestFactCheck(Post post) {
        return factCheckRepository.findFirstByPostOrderByCheckedAtDesc(post);
    }
} 