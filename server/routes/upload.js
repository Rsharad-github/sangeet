import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import Song from '../models/Song.js';
import dotenv from 'dotenv';


dotenv.config();
const router = express.Router();

//Configure Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params:{
    folder:'music',
    resource_type:'video',
    format:async(req,file)=>'mp3'

  }
})

const upload = multer({storage})

//route POST /api/upload
router.post('/',upload.single('audio'),async(req,res)=>{
  try{
    const {title,artist,genre} = req.body;
    const newSong=new Song({
      title,artist,genre,
      audioUrl:req.file.path
    })

    const saved = await newSong.save();
    res.status(201).json({success:true,song:saved})

  }catch(error){
     res.status(500).json({ success: false, message: error.message });
  }
})

export default router;