import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const apiToken = process.env.HUGGING_FACE_API_KEY;
const modelId = 'stabilityai/stable-diffusion-2-1';
const apiEndpoint = `https://api-inference.huggingface.co/models/${modelId}`;

router.route('/').get((req, res) => {
  res.status(200).json({ message: 'Hello from huggingface!' });
});

router.route('/').post(async (req, res) => {
  try {
    const { prompt } = req.body;

    const data = { inputs: prompt };

    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const image = await response.blob();

    res.status(200).json({ photo: Buffer.from(await image.arrayBuffer()).toString('base64') });
  } catch (error) {
    console.error(error);
    if (error.response) {
      res.status(500).send(error.response.data.error.message || 'Something went wrong');
    } else {
      res.status(500).send('Something went wrong');
    }
  }
});

async function imageToBase64(image) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsDataURL(image);
  });
}

export default router;