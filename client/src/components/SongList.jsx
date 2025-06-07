import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const SongList = () => {
  const [songs, setSongs] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null); // index of current song
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [progress, setProgress] = useState({}); // {id: seconds}
  const audioRefs = useRef({});

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get('/api/songs');
        setSongs(res.data);
      } catch (err) {
        console.error('Error fetching songs:', err);
      }
    };
    fetchSongs();
  }, []);

  const handlePlayPause = (index) => {
    const id = songs[index]._id;
    const audio = audioRefs.current[id];

    if (!audio) return;

    // pause all others
    Object.keys(audioRefs.current).forEach((key) => {
      if (key !== id) audioRefs.current[key].pause();
    });

    if (audio.paused) {
      audio.play();
      setCurrentIndex(index);
    } else {
      audio.pause();
      setCurrentIndex(null);
    }
  };

  const handleTimeUpdate = (id) => {
    const audio = audioRefs.current[id];
    if (audio) {
      setProgress((prev) => ({ ...prev, [id]: audio.currentTime }));
    }
  };

  const handleSeek = (id, value) => {
    const audio = audioRefs.current[id];
    if (audio) {
      audio.currentTime = value;
      setProgress((prev) => ({ ...prev, [id]: value }));
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleEnded = () => {
    if (isRepeat) {
      // repeat same
      const id = songs[currentIndex]._id;
      const audio = audioRefs.current[id];
      if (audio) audio.play();
    } else if (isShuffle) {
      // play random
      const randomIndex = Math.floor(Math.random() * songs.length);
      playSongAtIndex(randomIndex);
    } else {
      // play next
      const nextIndex = (currentIndex + 1) % songs.length;
      playSongAtIndex(nextIndex);
    }
  };

  const playSongAtIndex = (index) => {
    const id = songs[index]._id;
    Object.values(audioRefs.current).forEach((audio) => audio.pause());
    const audio = audioRefs.current[id];
    if (audio) {
      audio.currentTime = 0;
      audio.play();
      setCurrentIndex(index);
    }
  };

  return (
    <div style={{ paddingTop: '30px' }}>
      <h2>🎶 Uploaded Songs</h2>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setIsShuffle(!isShuffle)}>
          {isShuffle ? '🔀 Shuffle ON' : 'Shuffle OFF'}
        </button>{' '}
        <button onClick={() => setIsRepeat(!isRepeat)}>
          {isRepeat ? '🔁 Repeat ON' : 'Repeat OFF'}
        </button>{' '}
        <button
          onClick={() =>
            currentIndex !== null && playSongAtIndex((currentIndex + 1) % songs.length)
          }
        >
          ⏭ Next
        </button>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {songs.map((song, index) => {
          const id = song._id;
          const audio = audioRefs.current[id];
          const duration = audio?.duration || 0;
          const current = progress[id] || 0;
          const isPlaying = currentIndex === index && !audio?.paused;

          return (
            <li
              key={id}
              style={{
                marginBottom: '25px',
                padding: '15px',
                borderRadius: '10px',
                backgroundColor: isPlaying ? '#111222' : '#111333',
                border: '1px solid #ccc',
              }}
            >
              <strong>{song.title}</strong> — {song.artist}
              <br />
              <button
                onClick={() => handlePlayPause(index)}
                style={{
                  marginTop: '10px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  backgroundColor: '#007BFF',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                }}
              >
                {isPlaying ? '⏸️ Pause' : '▶️ Play'}
              </button>
              <br />
              <input
                type="range"
                min="0"
                max={duration}
                step="0.1"
                value={current}
                onChange={(e) => handleSeek(id, parseFloat(e.target.value))}
                style={{ width: '100%', marginTop: '8px' }}
              />
              <div style={{ fontSize: '14px', marginTop: '4px' }}>
                {formatTime(current)} / {formatTime(duration)}
              </div>
              <audio
                ref={(el) => (audioRefs.current[id] = el)}
                src={song.audioUrl}
                onTimeUpdate={() => handleTimeUpdate(id)}
                onEnded={handleEnded}
                style={{ display: 'none' }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SongList;
