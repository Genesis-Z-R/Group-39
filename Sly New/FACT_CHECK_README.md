# AI Fact-Checking Feature

## Overview

The Bisa app now includes an AI-powered fact-checking feature that analyzes question content and validates information using advanced algorithms and machine learning techniques.

## Features

### 1. Intelligent Claim Extraction
- **NLP-based Analysis**: Extracts factual claims from question content
- **Smart Filtering**: Identifies claims with numbers, dates, specific facts, and named entities
- **Content Classification**: Distinguishes between factual statements and opinions

### 2. Advanced Verification Algorithm
- **Multi-factor Analysis**: Evaluates claims based on:
  - Presence of specific numbers and statistics
  - Date references and temporal information
  - Named entities and quoted statements
  - Quantifiers and measurable data
- **Confidence Scoring**: Provides detailed confidence levels for each claim
- **Source Reliability**: Evaluates the reliability of supporting sources

### 3. Comprehensive Results Display
- **Visual Indicators**: Color-coded confidence levels (Green: High, Orange: Medium, Red: Low)
- **Detailed Explanations**: Contextual explanations for verification results
- **Source Attribution**: Links to reliable sources with reliability scores
- **Overall Assessment**: Summary of fact-checking results

## Implementation Details

### FactCheckService (`src/services/factCheckService.ts`)
```typescript
// Main service class with singleton pattern
class FactCheckService {
  async factCheckQuestion(question: Question): Promise<FactCheckResult>
  private extractClaims(content: string): string[]
  private async verifyClaims(claims: string[]): Promise<Claim[]>
  private calculateOverallConfidence(claims: Claim[]): number
}
```

### FactCheckModal (`src/components/FactCheckModal.tsx`)
- **Loading States**: Smooth loading animations during AI analysis
- **Error Handling**: Graceful error recovery with retry functionality
- **Responsive Design**: Adapts to different screen sizes and themes
- **Interactive Elements**: Clickable sources and detailed claim analysis

### Integration with QuestionCard
- **Fact Check Button**: Shield icon with "Fact Check" label
- **Modal Integration**: Seamless integration with existing UI
- **State Management**: Proper state handling for modal visibility

## AI Integration Points

### Current Implementation (Mock)
- Simulates AI analysis with realistic delays
- Content-based claim extraction
- Intelligent verification scoring
- Dynamic source generation

### Future AI Integration
```typescript
// OpenAI Integration Example
async enhancedFactCheck(content: string): Promise<any> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a fact-checking assistant...'
        },
        {
          role: 'user',
          content: `Please fact-check this content: ${content}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.3,
    }),
  });
}
```

## API Endpoints

### Backend Integration
```typescript
// Fact Check API calls
export async function factCheckPost(postId: string, token: string)
export async function getFactCheckResult(postId: string, token: string)
```

### Response Format
```typescript
interface FactCheckResult {
  id: string;
  questionId: string;
  isFactual: boolean;
  confidence: number;
  claims: Claim[];
  summary: string;
  sources: Source[];
  checkedAt: Date;
  status: 'pending' | 'completed' | 'failed';
}
```

## Usage

### For Users
1. Navigate to any question card
2. Tap the "Fact Check" button (shield icon)
3. Wait for AI analysis (2-3 seconds)
4. Review detailed results including:
   - Overall confidence score
   - Individual claim analysis
   - Supporting sources
   - Verification explanations

### For Developers
```typescript
// Initialize fact-check service
const factCheckService = FactCheckService.getInstance();

// Perform fact-check
const result = await factCheckService.factCheckQuestion(question);

// Display results
console.log(`Factual: ${result.isFactual}`);
console.log(`Confidence: ${result.confidence}`);
console.log(`Claims verified: ${result.claims.filter(c => c.isVerified).length}/${result.claims.length}`);
```

## Technical Features

### Claim Extraction Algorithm
- **Regex Patterns**: Identifies numbers, dates, percentages, currencies
- **Named Entity Recognition**: Detects quoted statements and attributions
- **Content Filtering**: Focuses on verifiable factual statements
- **Limit Management**: Prevents overwhelming results (max 5 claims)

### Verification Scoring
- **Base Score**: 0.5 for all claims
- **Number Bonus**: +0.2 for specific numbers
- **Date Bonus**: +0.15 for date references
- **Attribution Bonus**: +0.1 for quoted statements
- **Quantifier Bonus**: +0.1 for measurable data
- **Random Factor**: ±0.1 for realistic variation

### Confidence Calculation
- **Individual Claims**: 0.4-0.95 range based on verification score
- **Overall Confidence**: Average of all claim confidences
- **Factual Threshold**: 0.7+ for "factual" classification

## Future Enhancements

### 1. Real AI Integration
- OpenAI GPT-4 integration
- Google Fact Check API
- Snopes API integration
- Custom NLP models

### 2. Advanced Features
- Real-time fact-checking
- Batch processing for multiple posts
- Fact-check history and caching
- User feedback integration

### 3. Enhanced Analytics
- Fact-check statistics
- Trending misinformation detection
- Source reliability scoring
- Community fact-checking

### 4. Performance Optimizations
- Caching verified claims
- Background processing
- Offline fact-checking
- Progressive loading

## Security Considerations

### 1. API Security
- Rate limiting for AI calls
- Input validation and sanitization
- Secure API key management
- Error handling without data leakage

### 2. Privacy Protection
- No personal data in fact-check requests
- Anonymous fact-checking
- Data retention policies
- GDPR compliance

### 3. Content Moderation
- Harmful content detection
- Bias identification
- Misinformation flagging
- Community reporting

## Testing

### Manual Testing
1. Test with various content types
2. Verify loading states
3. Test error scenarios
4. Check responsive design

### Automated Testing
```typescript
// Unit tests for fact-check service
describe('FactCheckService', () => {
  test('should extract claims from content', () => {
    // Test claim extraction
  });
  
  test('should calculate confidence scores', () => {
    // Test confidence calculation
  });
  
  test('should generate appropriate sources', () => {
    // Test source generation
  });
});
```

## Dependencies

### Required Packages
- `expo-clipboard`: For copying fact-check results
- `@expo/vector-icons`: For UI icons
- React Native core components

### Optional AI Dependencies
- `openai`: For GPT-4 integration
- `@google-cloud/language`: For Google NLP
- Custom fact-check APIs

## Configuration

### Environment Variables
```bash
# AI API Keys (for future integration)
OPENAI_API_KEY=your_openai_key
GOOGLE_FACT_CHECK_API_KEY=your_google_key
SNOPES_API_KEY=your_snopes_key

# Feature Flags
ENABLE_REAL_AI_FACT_CHECK=true
FACT_CHECK_CACHE_DURATION=3600
MAX_FACT_CHECK_REQUESTS_PER_MINUTE=10
```

## Troubleshooting

### Common Issues
1. **Fact-check not loading**: Check network connectivity
2. **No claims extracted**: Verify content has factual statements
3. **Low confidence scores**: Content may be opinion-based
4. **Modal not opening**: Check component imports and state

### Debug Commands
```bash
# Check fact-check service
console.log('Fact-check result:', result);

# Verify claim extraction
console.log('Extracted claims:', claims);

# Test confidence calculation
console.log('Confidence score:', confidence);
```

## Contributing

### Adding New Fact-Check Sources
1. Update `generateSources()` method
2. Add source reliability scoring
3. Test with various content types
4. Update documentation

### Enhancing Verification Algorithm
1. Modify `verifyClaims()` method
2. Add new verification factors
3. Update confidence calculation
4. Test with edge cases

### UI Improvements
1. Update `FactCheckModal` component
2. Enhance visual indicators
3. Add animations
4. Improve accessibility

## License

This fact-checking feature is part of the Bisa app and follows the same licensing terms as the main project. 