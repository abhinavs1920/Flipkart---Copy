import express from 'express';
import { analyze, callThread } from './ai.js';

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to process input with GPT and product data
app.post('/process', analyze);

// New endpoint to call existing thread
app.post('/call/:threadid', callThread);

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
