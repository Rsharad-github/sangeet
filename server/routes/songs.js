import express from 'express';
import Song from '../models/Song.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
