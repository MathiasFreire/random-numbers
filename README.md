# Random Number API

A simple REST API built with Node.js and Fastify for generating and retrieving random numbers.

## Endpoints
- `POST /` — Generates a random number (1–1000) and returns it with a unique ID.
- `GET /:id` — Retrieves a number by its ID.

## Storage
Data is stored in SQLite for persistence. Fastify is chosen for its performance and lightweight nature.  
Alternative: For even greater simplicity, data can be stored in memory using a Map.

## Installation and Running
1. Install dependencies:
   ```bash
   npm install
2. Running
   ```bash
   npm run start
