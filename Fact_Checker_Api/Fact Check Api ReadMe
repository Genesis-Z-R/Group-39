# Fact-Checking API

A REST API for fact-checking using Groq's LLaMA 3 model.

## Endpoints

- `POST /api/fact-check`  
  Performs a single fact-check and returns verdict, confidence, reasoning, and sources in a human-readable format.

- `POST /api/fact-check-bulk`  
  Accepts an array of facts (max 50) and returns structured analysis for each.

- `POST /api/fact-check-file`  
  Accepts plain text content (max 100KB), line-by-line fact-checking.

- `GET /api/health`  
  Returns API health status and metadata.

## Environment Variables

- `GROQ_API_KEY`: Your API key for accessing the Groq LLaMA 3 model  
- `PORT`: Port to run the server on (default: 3000)

## Notes

- Rate-limited to prevent abuse  
- Concurrency control prevents flooding the Groq API  
- Returns clean, readable responses for humans and apps
