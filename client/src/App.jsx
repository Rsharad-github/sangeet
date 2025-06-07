import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UploadForm from './components/uploadForm.jsx';
import SongList from './components/SongList.jsx'


function App() {

  return (
    <>
    <div style={{ maxWidth: '600px', margin: 'auto', padding: '20px' }}>
      <h1>🎧 Music Upload & Player</h1>
      <UploadForm />
      <SongList />
    </div>
    </>
  )
}

export default App
