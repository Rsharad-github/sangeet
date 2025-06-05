import { useState } from 'react';
import axios from 'axios';

const UploadForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    genre: '',
    audio: null
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'audio') {
      setFormData({ ...formData, audio: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('artist', formData.artist);
      data.append('genre', formData.genre);
      data.append('audio', formData.audio);

      const res = await axios.post('/api/upload', data);
      alert('Upload successful!');
      console.log(res.data);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Check the console for details.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <input type="text" name="title" placeholder="Song Title" onChange={handleChange} required />
      <input type="text" name="artist" placeholder="Artist" onChange={handleChange} required />
      <input type="text" name="genre" placeholder="Genre" onChange={handleChange} />
      <input type="file" name="audio" accept="audio/mp3" onChange={handleChange} required />
      <button type="submit">Upload Song</button>
    </form>
  );
};

export default UploadForm;
  