import React, { useState, useEffect } from 'react';

const AudioPlayer = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  useEffect(() => {
    // Load playlist from local storage on component mount
    const storedPlaylist = JSON.parse(localStorage.getItem('playlist')) || [];
    setPlaylist(storedPlaylist);

    // Check if there's a last playing track stored in local storage
    const lastPlayingTrack = localStorage.getItem('lastPlayingTrack');
    const lastPlayingTrackIndex = storedPlaylist.findIndex(track => track.src === lastPlayingTrack);
    if (lastPlayingTrackIndex !== -1) {
      setCurrentTrackIndex(lastPlayingTrackIndex);
    }
  }, []);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newPlaylist = files.map(file => ({
      src: URL.createObjectURL(file),
      name: file.name,
    }));
    setPlaylist([...playlist, ...newPlaylist]);
    localStorage.setItem('playlist', JSON.stringify([...playlist, ...newPlaylist]));
  };

  const handlePlayNextTrack = () => {
    const nextTrackIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextTrackIndex);
    localStorage.setItem('lastPlayingTrack', playlist[nextTrackIndex].src);
  };

  return (
    <div>
      <input type="file" accept="audio/*" onChange={handleFileChange} multiple />
      <audio src={playlist[currentTrackIndex]?.src} controls onEnded={handlePlayNextTrack} />
      <ul>
        {playlist.map((track, index) => (
          <li key={index} onClick={() => setCurrentTrackIndex(index)}>
            {track.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AudioPlayer;