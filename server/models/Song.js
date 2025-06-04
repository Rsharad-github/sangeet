import mongoose from 'mongoose'

const songSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true,
  },
  artist:{
    type:String,
    required:true,
  },
  genre:{
    type:String,
  },
  audioUrl:{
    type:String,
    required:true,
  },
  coverImage:{
    type:String,
    
  },
  createdAt:{
    type:Date,
    default:Date.now
  }

})

export default mongoose.model('Song',songSchema)