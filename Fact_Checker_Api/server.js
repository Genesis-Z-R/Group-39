
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const rateLimit = require('express-rate-limit');
const pLimit = require('p-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,
    handler: (req, res) => {
        res.status(429).json({
            error: 'Too many requests',
            message: 'You\'ve hit the rate limit. Try again in a minute.',
        });
    }
});

app.use('/api/', limiter);

// Groq API configuration
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

if (!process.env.GROQ_API_KEY) {
    console.error('❌ Missing GROQ_API_KEY in environment variables.');
    process.exit(1);
}
// Helper function to parse and clean the fact-check response
function parseFactCheckResponse(rawResponse) {
    try {
        // Extract verdict (TRUE/FALSE)
        const verdictMatch = rawResponse.match(/Verdict:\s*(TRUE|FALSE)/i);
        const verdict = verdictMatch ? verdictMatch[1].toUpperCase() : 'UNCLEAR';
        
        // Extract confidence level (High/Medium/Low)
        const confidenceMatch = rawResponse.match(/confidence[:\s]+(high|medium|low)/i);
        const confidence = confidenceMatch ? confidenceMatch[1].charAt(0).toUpperCase() + confidenceMatch[1].slice(1).toLowerCase() : 'Not specified';
        
        // Extract reasoning (clean up the text)
        let reasoning = rawResponse;
        
        // Remove the statement repetition
        reasoning = reasoning.replace(/Statement:.*?\n/i, '');
        
        // Remove verdict line
        reasoning = reasoning.replace(/Verdict:\s*(TRUE|FALSE)\s*\n/i, '');
        
        // Extract the main reasoning section
        const reasoningMatch = reasoning.match(/Reasoning:\s*(.*?)(?=\n\n|Known sources|$)/s);
        const cleanReasoning = reasoningMatch ? reasoningMatch[1].trim() : reasoning.trim();
        
        // Extract sources
        const sourcesMatch = rawResponse.match(/(?:Known sources|Sources|References)[:\s]*(.*?)$/s);
        let sources = [];
        if (sourcesMatch) {
            const sourcesText = sourcesMatch[1];
            // Split by bullet points or line breaks
            sources = sourcesText
                .split(/\n\s*[\*\-\•]/)
                .filter(source => source.trim().length > 0)
                .map(source => source.trim().replace(/^\*\s*/, ''))
                .slice(0, 3); // Limit to 3 sources
        }
        
        return {
            verdict,
            confidence,
            reasoning: cleanReasoning,
            sources: sources.length > 0 ? sources : ['No specific sources provided']
        };
    } catch (error) {
        return {
            verdict: 'UNCLEAR',
            confidence: 'Not specified',
            reasoning: rawResponse,
            sources: ['No sources provided']
        };
    }
}

async function callGroq(prompt) {
    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            model: 'llama3-8b-8192',  // Free model
            temperature: 0.7,
            max_tokens: 500
        });
        
        return chatCompletion.choices[0].message.content;
    } catch (error) {
        throw new Error(`Groq API error: ${error.message}`);
    }
}

// Single fact-check endpoint
app.post('/api/fact-check', async (req, res) => {
    try {
        const { fact } = req.body;
        
        if (!fact || typeof fact !== 'string' || fact.trim().length === 0 || fact.length > 300) {
            return res.status(400).json({ 
                error: 'Invalid input. Fact must be a non-empty string under 300 characters.' 
            });
        }

        const prompt = `
You are a professional fact-checking assistant. Analyze the following statement and provide a clear, structured response.

Statement: "${fact}"

Please provide your analysis in this exact format:

Verdict: [TRUE/FALSE]
Confidence: [High/Medium/Low]
Reasoning: [Brief, clear explanation in 2-3 sentences]

Known sources: [List 1-2 credible sources if available]

Keep your response concise and professional.
`;

        const result = await callGroq(prompt);
        
        // Parse and clean the response
        const cleanedResult = parseFactCheckResponse(result);
        
        res.json({
            success: true,
            fact: fact,
            verdict: cleanedResult.verdict,
            confidence: cleanedResult.confidence,
            reasoning: cleanedResult.reasoning,
            sources: cleanedResult.sources,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

// Bulk fact-check endpoint (processes multiple facts)
app.post('/api/fact-check-bulk', async (req, res) => {
    try {
        const { facts } = req.body;
        
        if (!Array.isArray(facts) || facts.length === 0 || facts.length > 50) {
            return res.status(400).json({ 
                error: 'Invalid input. Please provide 1–50 facts.' 
            });
        }

        const limit = pLimit(3);

        const results = await Promise.allSettled(facts.map(fact =>
            limit(async () => {
                if (!fact || typeof fact !== 'string' || fact.trim().length === 0 || fact.length > 300) {
                    return {
                        fact,
                        error: 'Invalid fact format',
                        success: false
                    };
                }
                const prompt = `
You are a professional fact-checking assistant. Analyze the following statement and provide a clear, structured response.

Statement: "${fact}"

Please provide your analysis in this exact format:

Verdict: [TRUE/FALSE]
Confidence: [High/Medium/Low]
Reasoning: [Brief, clear explanation in 2-3 sentences]

Known sources: [List 1-2 credible sources if available]

Keep your response concise and professional.
`;
                try {
                    const result = await callGroq(prompt);
                    const cleanedResult = parseFactCheckResponse(result);
                    return {
                        success: true,
                        fact,
                        verdict: cleanedResult.verdict,
                        confidence: cleanedResult.confidence,
                        reasoning: cleanedResult.reasoning,
                        sources: cleanedResult.sources,
                        timestamp: new Date().toISOString()
                    };
                } catch (error) {
                    return {
                        fact,
                        error: error.message,
                        success: false
                    };
                }
            })
        ));

        res.json({
            success: true,
            results: results.map(r => r.status === 'fulfilled' ? r.value : { 
                error: r.reason?.message || 'Unknown error', 
                success: false 
            }),
            total: facts.length,
            processed: results.length
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

// File upload endpoint (processes facts from uploaded file)
app.post('/api/fact-check-file', async (req, res) => {
    try {
        const { fileContent } = req.body;
        
        if (!fileContent || fileContent.length > 100000) {
            return res.status(400).json({ 
                error: 'Invalid or too large file. Max allowed is 100KB.' 
            });
        }

        const lines = fileContent.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length > 100) {
            return res.status(400).json({ 
                error: 'Too many lines in file. Maximum 100 lines allowed.' 
            });
        }

        const limit = pLimit(3);

        const results = await Promise.allSettled(lines.map(line =>
            limit(async () => {
                if (!line || line.trim().length === 0 || line.length > 300) {
                    return {
                        fact: line,
                        error: 'Invalid line format',
                        success: false
                    };
                }

                const prompt = `
You are a professional fact-checking assistant. Analyze the following statement and provide a clear, structured response.

Statement: "${line}"

Please provide your analysis in this exact format:

Verdict: [TRUE/FALSE]
Confidence: [High/Medium/Low]
Reasoning: [Brief, clear explanation in 2-3 sentences]

Known sources: [List 1-2 credible sources if available]

Keep your response concise and professional.
`;

                try {
                    const result = await callGroq(prompt);
                    const cleanedResult = parseFactCheckResponse(result);
                    return {
                        success: true,
                        fact: line,
                        verdict: cleanedResult.verdict,
                        confidence: cleanedResult.confidence,
                        reasoning: cleanedResult.reasoning,
                        sources: cleanedResult.sources,
                        timestamp: new Date().toISOString()
                    };
                } catch (error) {
                    return {
                        fact: line,
                        error: error.message,
                        success: false
                    };
                }
            })
        ));
        
        res.json({
            success: true,
            results: results.map(r => r.status === 'fulfilled' ? r.value : { 
                error: r.reason?.message || 'Unknown error', 
                success: false 
            }),
            total: lines.length,
            processed: results.length
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        model: 'llama3-8b-8192',
        api_provider: 'groq'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Fact-checking API server running on port ${PORT}`);
    console.log(`Available endpoints:`);
    console.log(`  POST /api/fact-check - Single fact check`);
    console.log(`  POST /api/fact-check-bulk - Multiple facts check`);
    console.log(`  POST /api/fact-check-file - File content check`);
    console.log(`  GET /api/health - Health check`);
});

module.exports = app;
