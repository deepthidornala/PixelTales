import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';
import blipRoutes from './routes/blipRoutes.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js'; 

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true,
}));
app.use(express.json({ limit: '50mb' }));

app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);
app.use('/api/v1/blip', blipRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.get('/', async(req, res) => {
    res.send('Hello from Dall-e');
});

const startServer = async () => {
    try {
        await connectDB(process.env.MONGODB_URL);
        app.listen(8080, () => console.log('Server is running on port http://localhost:8080'));
    } catch (error) {
        console.log(error);
    }
}

startServer();
