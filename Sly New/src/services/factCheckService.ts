import { Question } from '../types';

export interface FactCheckResult {
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

export interface Claim {
  text: string;
  isVerified: boolean;
  confidence: number;
  explanation: string;
}

export interface Source {
  title: string;
  url: string;
  reliability: number;
}

// Mock AI fact-checking service
export class FactCheckService {
  private static instance: FactCheckService;

  static getInstance(): FactCheckService {
    if (!FactCheckService.instance) {
      FactCheckService.instance = new FactCheckService();
    }
    return FactCheckService.instance;
  }

  async factCheckQuestion(question: Question): Promise<FactCheckResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const claims = this.extractClaims(question.content);
    const verifiedClaims = await this.verifyClaims(claims);
    const overallConfidence = this.calculateOverallConfidence(verifiedClaims);
    const isFactual = overallConfidence > 0.7;

    return {
      id: `fact-check-${Date.now()}`,
      questionId: question.id,
      isFactual,
      confidence: overallConfidence,
      claims: verifiedClaims,
      summary: this.generateSummary(verifiedClaims, isFactual),
      sources: this.generateSources(question),
      checkedAt: new Date(),
      status: 'completed'
    };
  }

  private extractClaims(content: string): string[] {
    // Enhanced claim extraction with better NLP-like processing
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    // Filter for factual claims (sentences with numbers, dates, specific facts)
    const factualClaims = sentences.filter(sentence => {
      const hasNumbers = /\d+/.test(sentence);
      const hasDates = /\d{4}|\d{1,2}\/\d{1,2}|\d{1,2}-\d{1,2}/.test(sentence);
      const hasSpecificFacts = /(million|billion|thousand|percent|%|km|miles|dollars|$)/i.test(sentence);
      const hasNames = /(said|announced|reported|confirmed|stated)/i.test(sentence);
      
      return hasNumbers || hasDates || hasSpecificFacts || hasNames;
    });
    
    return factualClaims.slice(0, 5); // Limit to 5 claims for demo
  }

  private async verifyClaims(claims: string[]): Promise<Claim[]> {
    // Enhanced verification with content-based analysis
    return claims.map((claim, index) => {
      // Analyze claim content for verification likelihood
      const hasSpecificNumbers = /\d+/.test(claim);
      const hasDates = /\d{4}/.test(claim);
      const hasNames = /(said|announced|reported|confirmed|stated)/i.test(claim);
      const hasQuantifiers = /(million|billion|thousand|percent|%)/i.test(claim);
      
      // Calculate verification probability based on content
      let verificationScore = 0.5; // Base score
      
      if (hasSpecificNumbers) verificationScore += 0.2;
      if (hasDates) verificationScore += 0.15;
      if (hasNames) verificationScore += 0.1;
      if (hasQuantifiers) verificationScore += 0.1;
      
      // Add some randomness for demo purposes
      const randomFactor = (Math.random() - 0.5) * 0.2;
      verificationScore += randomFactor;
      
      const isVerified = verificationScore > 0.6;
      const confidence = Math.max(0.4, Math.min(0.95, verificationScore));
      
      let explanation = "";
      if (isVerified) {
        if (hasSpecificNumbers && hasDates) {
          explanation = "This claim contains specific numbers and dates that can be verified against official sources.";
        } else if (hasNames) {
          explanation = "This claim references specific statements that can be cross-referenced with reliable sources.";
        } else {
          explanation = "This claim appears to be supported by multiple reliable sources.";
        }
      } else {
        if (!hasSpecificNumbers && !hasDates) {
          explanation = "This claim lacks specific verifiable details and may be opinion-based.";
        } else {
          explanation = "This claim could not be verified or may contain inaccuracies.";
        }
      }
      
      return {
        text: claim,
        isVerified,
        confidence,
        explanation
      };
    });
  }

  private calculateOverallConfidence(claims: Claim[]): number {
    if (claims.length === 0) return 0;
    const totalConfidence = claims.reduce((sum, claim) => sum + claim.confidence, 0);
    return totalConfidence / claims.length;
  }

  private generateSummary(claims: Claim[], isFactual: boolean): string {
    const verifiedCount = claims.filter(c => c.isVerified).length;
    const totalCount = claims.length;
    
    if (isFactual) {
      return `✅ Fact-checked: ${verifiedCount}/${totalCount} claims verified. This post appears to contain factual information.`;
    } else {
      return `⚠️ Fact-checked: ${verifiedCount}/${totalCount} claims verified. Some information may be inaccurate or unverified.`;
    }
  }

  private generateSources(question: Question): Source[] {
    // Mock sources based on question tags
    const sources: Source[] = [];
    
    if (question.tags.includes('volcano') || question.tags.includes('breaking-news')) {
      sources.push({
        title: 'US Geological Survey',
        url: 'https://www.usgs.gov',
        reliability: 0.95
      });
      sources.push({
        title: 'BBC News',
        url: 'https://www.bbc.com/news',
        reliability: 0.90
      });
    }
    
    if (question.tags.includes('sports') || question.tags.includes('football')) {
      sources.push({
        title: 'ESPN',
        url: 'https://www.espn.com',
        reliability: 0.85
      });
    }
    
    if (question.tags.includes('space') || question.tags.includes('technology')) {
      sources.push({
        title: 'NASA',
        url: 'https://www.nasa.gov',
        reliability: 0.95
      });
      sources.push({
        title: 'SpaceX',
        url: 'https://www.spacex.com',
        reliability: 0.80
      });
    }
    
    return sources;
  }

  // Real AI integration would go here
  async callAIFactCheck(content: string): Promise<any> {
    // This would integrate with OpenAI, Google Fact Check API, or similar
    // For now, we'll simulate the response
    return {
      claims: [],
      verification: 'simulated',
      confidence: Math.random()
    };
  }

  // Enhanced AI fact-checking with real API integration
  async enhancedFactCheck(content: string): Promise<any> {
    try {
      // This would be the actual API call to OpenAI or similar
      // const response = await fetch('https://api.openai.com/v1/chat/completions', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     model: 'gpt-4',
      //     messages: [
      //       {
      //         role: 'system',
      //         content: 'You are a fact-checking assistant. Analyze the given content and identify factual claims. For each claim, determine if it can be verified and provide a confidence score.'
      //       },
      //       {
      //         role: 'user',
      //         content: `Please fact-check this content: ${content}`
      //       }
      //     ],
      //     max_tokens: 1000,
      //     temperature: 0.3,
      //   }),
      // });
      
      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        claims: [
          {
            text: "Sample claim from content",
            isVerified: Math.random() > 0.3,
            confidence: Math.random() * 0.4 + 0.6,
            explanation: "This claim has been verified against multiple reliable sources."
          }
        ],
        verification: 'ai_enhanced',
        confidence: Math.random() * 0.3 + 0.7,
        sources: [
          {
            title: "Reliable Source",
            url: "https://example.com",
            reliability: 0.9
          }
        ]
      };
    } catch (error) {
      console.error('AI fact-check failed:', error);
      throw new Error('Failed to perform AI fact-check');
    }
  }
}

export default FactCheckService; 