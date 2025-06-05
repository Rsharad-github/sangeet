import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UploadForm from './components/uploadForm.jsx';


function App() {

  return (
    <>
    <div style={{ padding: '30px' }}>
      <h1>Music Upload</h1>
      <UploadForm />
    </div>

    </>
  )
}

export default App
