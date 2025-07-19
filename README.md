echo "# Fact-Checking API

A REST API for fact-checking using Ollama and Llama models.

## Endpoints
- POST /api/fact-check - Single fact check
- POST /api/fact-check-bulk - Multiple facts
- GET /api/health - Health check

## Environment Variables
- OLLAMA_URL: URL to your Ollama instance
- MODEL_NAME: Model to use (default: llama3.2)
- PORT: Port to run on (default: 3000)" > README.md