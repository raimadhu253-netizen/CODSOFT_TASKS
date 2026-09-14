document.addEventListener('DOMContentLoaded', () => {
  // Reliable Public MP3 Audio Links
  const playlist = [
    {
      title: 'Acoustic Breeze',
      artist: 'Benjamin Tissot',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
      title: 'Ukulele Joy',
      artist: 'Benjamin Tissot',
      cover: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&auto=format&fit=crop',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    {
      title: 'Creative Minds',
      artist: 'Bensound Royalty Free',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    }
  ];

  let currentTrackIndex = 0;
  let isPlaying = false;
  let isShuffle = false;
  let isRepeat = false;

  // DOM Elements Selection
  const audio = document.getElementById('audio-player');
  const playBtn = document.getElementById('play-btn');
  const playIcon = document.getElementById('play-icon');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const shuffleBtn = document.getElementById('shuffle-btn');
  const repeatBtn = document.getElementById('repeat-btn');

  const trackArt = document.getElementById('track-art');
  const trackTitle = document.getElementById('track-title');
  const trackArtist = document.getElementById('track-artist');

  const progressWrapper = document.getElementById('progress-wrapper');
  const progressFill = document.getElementById('progress-fill');
  const currentTimeEl = document.getElementById('current-time');
  const totalDurationEl = document.getElementById('total-duration');
  const playlistItemsContainer = document.getElementById('playlist-items');

  const volumeSlider = document.getElementById('volume-slider');
  const volumeIcon = document.getElementById('volume-icon');

  // Render Playlist Items
  function renderPlaylist() {
    if (!playlistItemsContainer) return;
    playlistItemsContainer.innerHTML = '';
    
    playlist.forEach((track, index) => {
      const item = document.createElement('div');
      item.className = `playlist-item ${index === currentTrackIndex ? 'active' : ''}`;
      item.innerHTML = `
        <img src="${track.cover}" alt="${track.title}">
        <div class="item-info">
          <h4>${track.title}</h4>
          <p>${track.artist}</p>
        </div>
      `;
      item.addEventListener('click', () => {
        currentTrackIndex = index;
        loadTrack(currentTrackIndex);
        playSong();
      });
      playlistItemsContainer.appendChild(item);
    });
  }

  // Load Track Details
  function loadTrack(index) {
    const track = playlist[index];
    if (trackTitle) trackTitle.textContent = track.title;
    if (trackArtist) trackArtist.textContent = track.artist;
    if (trackArt) trackArt.src = track.cover;

    if (progressFill) progressFill.style.width = '0%';
    if (currentTimeEl) currentTimeEl.textContent = '0:00';
    if (totalDurationEl) totalDurationEl.textContent = '0:00';

    if (audio) {
      audio.src = track.src;
      audio.load();
    }

    updatePlaylistSelection();
  }

  function updatePlaylistSelection() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, idx) => {
      item.classList.toggle('active', idx === currentTrackIndex);
    });
  }

  // Play / Pause Logic
  function playSong() {
    isPlaying = true;
    if (audio) audio.play();
    if (playIcon) playIcon.className = 'fa-solid fa-pause';
    document.body.classList.add('playing');
  }

  function pauseSong() {
    isPlaying = false;
    if (audio) audio.pause();
    if (playIcon) playIcon.className = 'fa-solid fa-play';
    document.body.classList.remove('playing');
  }

  if (playBtn) {
    playBtn.addEventListener('click', () => {
      isPlaying ? pauseSong() : playSong();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', nextTrack);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
      loadTrack(currentTrackIndex);
      playSong();
    });
  }

  function nextTrack() {
    if (isShuffle) {
      let randomIndex = Math.floor(Math.random() * playlist.length);
      currentTrackIndex = randomIndex;
    } else {
      currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
    }
    loadTrack(currentTrackIndex);
    playSong();
  }

  // Repeat Mode Logic
  if (repeatBtn) {
    repeatBtn.addEventListener('click', () => {
      isRepeat = !isRepeat;
      repeatBtn.style.color = isRepeat ? '#1db954' : '#ffffff';
    });
  }

  // Shuffle Mode Logic
  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      isShuffle = !isShuffle;
      shuffleBtn.style.color = isShuffle ? '#1db954' : '#ffffff';
    });
  }

  // Audio Time Update & Track Ended Handle
  if (audio) {
    audio.addEventListener('loadedmetadata', () => {
      if (totalDurationEl && !isNaN(audio.duration)) {
        totalDurationEl.textContent = formatTime(audio.duration);
      }
    });

    audio.addEventListener('timeupdate', () => {
      if (isNaN(audio.duration)) return;
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      if (progressFill) progressFill.style.width = `${progressPercent}%`;
      if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
      if (totalDurationEl) totalDurationEl.textContent = formatTime(audio.duration);
    });

    // Single Ended Handler for Repeat, Shuffle, and Normal Next
    audio.addEventListener('ended', () => {
      if (isRepeat) {
        audio.currentTime = 0;
        playSong();
      } else {
        nextTrack();
      }
    });
  }

  // Timeline Click Seek
  if (progressWrapper) {
    progressWrapper.addEventListener('click', (e) => {
      if (!audio || isNaN(audio.duration)) return;
      const width = progressWrapper.clientWidth;
      const clickX = e.offsetX;
      audio.currentTime = (clickX / width) * audio.duration;
    });
  }

  // Mute & Volume Logic
  let lastVolume = 1;

  if (volumeSlider && audio) {
    audio.volume = volumeSlider.value;

    volumeSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      audio.volume = val;
      updateVolumeIcon(val);
    });

    if (volumeIcon) {
      volumeIcon.style.cursor = 'pointer';
      volumeIcon.addEventListener('click', () => {
        if (audio.volume > 0) {
          lastVolume = audio.volume;
          audio.volume = 0;
          volumeSlider.value = 0;
          updateVolumeIcon(0);
        } else {
          audio.volume = lastVolume || 0.8;
          volumeSlider.value = audio.volume;
          updateVolumeIcon(audio.volume);
        }
      });
    }
  }

  function updateVolumeIcon(val) {
    if (!volumeIcon) return;
    if (val === 0) {
      volumeIcon.className = 'fa-solid fa-volume-xmark';
    } else if (val < 0.5) {
      volumeIcon.className = 'fa-solid fa-volume-low';
    } else {
      volumeIcon.className = 'fa-solid fa-volume-high';
    }
  }

  // Format Time Helper
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  // Initial Run
  renderPlaylist();
  loadTrack(currentTrackIndex);
});
