# Fact-Checking System Documentation

## Overview

The Bisa app now includes a comprehensive AI-powered fact-checking system that analyzes post content for factual accuracy and provides detailed assessments with confidence scores, validity status, and reasoning.

## Features

### Backend Features
- **AI Integration**: Connects to OpenAI GPT-4 for intelligent fact-checking
- **Mock Fallback**: Provides realistic mock responses when AI service is unavailable
- **Caching**: Stores fact-check results for 24 hours to avoid redundant API calls
- **Comprehensive Analysis**: Analyzes both questions and answers for complete assessment
- **Multiple Endpoints**: RESTful API for fact-checking operations

### Frontend Features
- **Interactive Modal**: Beautiful, detailed fact-check results display
- **Real-time Checking**: Perform fact checks on-demand
- **Status Indicators**: Color-coded validity and confidence indicators
- **History Tracking**: View fact-check history for posts
- **Responsive Design**: Works seamlessly across different screen sizes

## API Endpoints

### Perform Fact Check
```
POST /api/posts/{id}/fact-check?checkedBy={user}
```
Triggers a new fact-check analysis for the specified post.

### Get Latest Fact Check
```
GET /api/posts/{id}/fact-check
```
Retrieves the most recent fact-check result for a post.

### Get Fact Check History
```
GET /api/posts/{id}/fact-check/history
```
Returns all fact-check results for a post, ordered by date.

### Get Fact Check Status
```
GET /api/posts/{id}/fact-check/status
```
Returns a summary of fact-check status including validity and confidence.

## Data Models

### FactCheck Entity
```java
@Entity
public class FactCheck {
    private Long id;
    private Post post;
    private String contentAnalyzed;
    private Double accuracyScore; // 0.0 to 1.0
    private String validityStatus; // TRUE, FALSE, MISLEADING, UNVERIFIABLE, PARTIALLY_TRUE
    private String confidenceLevel; // HIGH, MEDIUM, LOW
    private String aiAnalysis;
    private String sourcesCited;
    private String corrections;
    private String reasoning;
    private Instant checkedAt;
    private String checkedBy;
}
```

### FactCheckResponse DTO
```java
public class FactCheckResponse {
    private Double accuracyScore;
    private String validityStatus;
    private String confidenceLevel;
    private String analysis;
    private List<String> sources;
    private List<String> corrections;
    private String reasoning;
    private List<FactualClaim> factualClaims;
}
```

## Configuration

### Environment Variables
```properties
# AI Service Configuration
factcheck.ai.service.url=https://api.openai.com/v1/chat/completions
factcheck.ai.service.api-key=${OPENAI_API_KEY:}
factcheck.enable-mock=true
```

### Required Environment Variables
- `OPENAI_API_KEY`: Your OpenAI API key for GPT-4 access

## Usage

### Backend Integration
1. **Add Dependencies**: Ensure `spring-boot-starter-webflux` is in your `pom.xml`
2. **Configure Properties**: Set up AI service configuration in `application.properties`
3. **Inject Service**: Use `FactCheckService` in your controllers
4. **Handle Responses**: Process `FactCheckResponse` objects

### Frontend Integration
1. **Import Component**: `import FactCheckModal from '../components/FactCheckModal'`
2. **Add State**: Manage modal visibility and selected post
3. **Handle Actions**: Call fact-check API functions from `api.ts`
4. **Display Results**: Use the modal component to show results

## AI Analysis Process

1. **Content Preparation**: Combines question and answer for comprehensive analysis
2. **AI Prompt**: Sends structured prompt to GPT-4 for fact-checking
3. **Response Processing**: Parses AI response into structured data
4. **Result Storage**: Saves analysis results to database
5. **Caching**: Implements 24-hour cache to avoid redundant checks

## Mock Response System

When AI service is unavailable or disabled:
- **Intelligent Scoring**: Analyzes content length and complexity
- **Realistic Status**: Generates appropriate validity status based on content
- **Detailed Analysis**: Provides comprehensive mock analysis
- **Fallback Logic**: Ensures system always provides results

## Security Considerations

- **API Key Protection**: Store OpenAI API key in environment variables
- **Input Validation**: Sanitize all content before AI analysis
- **Rate Limiting**: Implement appropriate rate limiting for AI calls
- **Error Handling**: Graceful fallback when AI service fails

## Performance Optimization

- **Caching Strategy**: 24-hour cache for fact-check results
- **Async Processing**: Non-blocking AI service calls
- **Database Indexing**: Optimize queries for fact-check history
- **Response Compression**: Efficient data transfer

## Testing

### Backend Testing
```bash
# Test fact-check endpoint
curl -X POST "http://localhost:8080/api/posts/1/fact-check" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get fact-check status
curl "http://localhost:8080/api/posts/1/fact-check/status" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Frontend Testing
1. Navigate to any post in the feed
2. Tap the fact-check icon (alert-circle)
3. View results in the modal
4. Test re-checking functionality

## Future Enhancements

- **Multi-language Support**: Fact-checking in multiple languages
- **Image Analysis**: OCR and image fact-checking
- **Source Verification**: Automatic source credibility scoring
- **Community Fact-checking**: User-contributed fact checks
- **Real-time Updates**: Live fact-check status updates
- **Advanced Analytics**: Detailed fact-checking metrics and trends

## Troubleshooting

### Common Issues

1. **AI Service Unavailable**
   - Check OpenAI API key configuration
   - Verify internet connectivity
   - Review API rate limits

2. **Mock Responses Only**
   - Ensure `factcheck.enable-mock=false` in production
   - Verify API key is set correctly

3. **Database Errors**
   - Check PostgreSQL connection
   - Verify table schema with `spring.jpa.hibernate.ddl-auto=update`

4. **Frontend Issues**
   - Check authentication token
   - Verify API endpoint URLs
   - Review network connectivity

### Debug Logging
Enable debug logging for fact-checking:
```properties
logging.level.com.bisa.service.FactCheckService=DEBUG
```

## Support

For issues or questions about the fact-checking system:
1. Check the application logs for detailed error messages
2. Verify configuration settings
3. Test with mock responses first
4. Review API documentation for OpenAI integration 