// index.js
import songRoutes from './routes/songs.js';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import uploadRoute from './routes/upload.js'
import dotenv from 'dotenv';
import {v2 as cloudinary} from 'cloudinary'

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // To parse JSON requests

// Test Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
.then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('MongoDB connection failed:', err.message);
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});


app.use('/api/upload', uploadRoute)

app.use('/api/songs', songRoutes);
