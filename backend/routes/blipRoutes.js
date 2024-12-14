// blipRoutes.js
import express from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import multer from 'multer';
import { GoogleGenerativeAI } from "@google/generative-ai"; 

dotenv.config();

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); 

const apiToken = process.env.HUGGING_FACE_API_KEY;
const modelId = 'Salesforce/blip-image-captioning-large';
const apiEndpoint = `https://api-inference.huggingface.co/models/${modelId}`;
const geminiApiKey = process.env.GEMINI_API_KEY; 

const genAI = new GoogleGenerativeAI(geminiApiKey);
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from BLIP model!' });
});

router.route('/').post(upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;  
    const imageData = fs.readFileSync(imagePath);

 
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/octet-stream',
      },
      body: imageData,
    });

    if (!response.ok) {
      const errorText = await response.text(); 
      console.error('Error from Hugging Face API:', errorText);
      return res.status(response.status).send({ error: 'Error calling Hugging Face API' });
    }

    const result = await response.json();
    const caption = result[0]?.generated_text || 'No caption generated';

  
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "Generate a small story based on the provided caption.",
    });

    const chatSession = model.startChat({
      generationConfig,
    });

    const storyResponse = await chatSession.sendMessage(caption);
    const story = storyResponse.response.text(); 

    res.status(200).json({ caption, story });
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: error.message || 'Something went wrong' });
  } finally {
    fs.unlinkSync(req.file.path);
  }
});

export default router;
