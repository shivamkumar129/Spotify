class SpotifyClone {
            constructor() {
                this.storage = {
    save: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
    get: (k) => JSON.parse(localStorage.getItem(k))
};

this.likedTracks = new Set(this.storage.get("liked") || []);
                this.audio = document.getElementById('audioPlayer');
                this.playPauseBtn = document.getElementById('playPauseBtn');
                this.prevBtn = document.getElementById('prevBtn');
                this.nextBtn = document.getElementById('nextBtn');
                this.progressContainer = document.getElementById('progressContainer');
                this.progressFill = document.getElementById('progressFill');
                this.currentTimeEl = document.getElementById('currentTime');
                this.durationEl = document.getElementById('duration');
                this.volumeSlider = document.getElementById('volumeSlider');
                this.volumeIcon = document.getElementById('volumeIcon');
                this.nowPlayingArt = document.getElementById('nowPlayingArt');
                this.nowPlayingTitle = document.getElementById('nowPlayingTitle');
                this.nowPlayingArtist = document.getElementById('nowPlayingArtist');

                // UI Elements
                this.sidebar = document.getElementById('sidebar');
                this.mainPanel = document.getElementById('mainPanel');
                this.searchInput = document.getElementById('searchInput');
                this.sidebarToggle = document.getElementById('sidebarToggle');

                // Music Data - 15+ Tracks
              this.tracks = [
  {
    title: "Epic Journey",
    artist: "Keys of Moon",
    art: "https://picsum.photos/200?random=101",
    src: "https://prod-1.storage.jamendo.com/?trackid=1881037&format=mp31&from=api",
    duration: "2:30"
  },
  {
    title: "Summer Vibes",
    artist: "Roa",
    art: "https://picsum.photos/200?random=102",
    src: "https://prod-1.storage.jamendo.com/?trackid=1876355&format=mp31&from=api",
    duration: "3:12"
  },
  {
    title: "Chill Day",
    artist: "Luke Bergs",
    art: "https://picsum.photos/200?random=103",
    src: "https://prod-1.storage.jamendo.com/?trackid=1884251&format=mp31&from=api",
    duration: "2:45"
  },
  {
    title: "Inspiring Cinematic",
    artist: "Lite Saturation",
    art: "https://picsum.photos/200?random=104",
    src: "https://prod-1.storage.jamendo.com/?trackid=1879123&format=mp31&from=api",
    duration: "3:01"
  },
  {
    title: "Happy Rock",
    artist: "AudioCoffee",
    art: "https://picsum.photos/200?random=105",
    src: "https://prod-1.storage.jamendo.com/?trackid=1887789&format=mp31&from=api",
    duration: "2:58"
  },
  {
    title: "Dreamy Ambient",
    artist: "FSM Team",
    art: "https://picsum.photos/200?random=106",
    src: "https://prod-1.storage.jamendo.com/?trackid=1874521&format=mp31&from=api",
    duration: "3:40"
  }
];
                this.currentTrackIndex = this.storage.get("lastTrack") ?? 0;
                this.isPlaying = false;
                this.likedTracks = new Set();
                this.recentTracks = [];

                this.init();
            }

            init() {
                this.renderRecentTracks();
                this.bindEvents();
                this.loadTrack(0);
                this.updateNowPlaying();
            }

           bindEvents() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => 
            this.switchView(e.currentTarget.dataset.view, e.currentTarget)
        );
    });
                // Search
               this.searchInput.addEventListener(
    'input',
    this.debounce((e) => this.handleSearch(e.target.value), 300)
);

                // Player Controls
                this.playPauseBtn.addEventListener('click', () => this.togglePlay());
                this.prevBtn.addEventListener('click', () => this.prevTrack());
                this.nextBtn.addEventListener('click', () => this.nextTrack());
                this.progressContainer.addEventListener('click', (e) => this.seek(e));
                this.volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));

                // Track clicks
                document.addEventListener('click', (e) => {
                    if (e.target.closest('.track-row')) {
                        const index = parseInt(e.target.closest('.track-row').dataset.index);
                        this.playTrack(index);
                    }
                    if (e.target.closest('.card')) {
                        const playlist = e.target.closest('.card').dataset.playlist;
                        this.playPlaylist(playlist);
                    }
                    if (e.target.classList.contains('like-btn')) {
    const index = parseInt(e.target.dataset.index);
    this.toggleLike(index);
}
                });

                // Audio events
                this.audio.addEventListener('timeupdate', () => this.updateProgress());
                this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
                this.audio.addEventListener('ended', () => this.nextTrack());
                this.audio.addEventListener('play', () => this.onPlay());
                this.audio.addEventListener('pause', () => this.onPause());

                // Keyboard
                document.addEventListener('keydown', (e) => {
                    if (e.code === 'Space') {
                        e.preventDefault();
                        this.togglePlay();
                    }
                    if (e.code === 'ArrowRight') e.preventDefault(), this.audio.currentTime += 10;
                    if (e.code === 'ArrowLeft') e.preventDefault(), this.audio.currentTime -= 10;
                });

                // Sidebar toggle
                this.sidebarToggle.addEventListener('click', () => {
                    this.sidebar.style.transform = this.sidebar.style.transform ? '' : 'translateX(-100%)';
                });
            }

            switchView(view, element) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    element.classList.add('active');

    document.getElementById('homeView').style.display = view === 'home' ? 'block' : 'none';
    document.getElementById('searchView').style.display = view === 'search' ? 'block' : 'none';
    document.getElementById('libraryView').style.display = view === 'library' ? 'block' : 'none';
}
            renderRecentTracks() {
                const recent = this.tracks.slice(0, 5);
                document.getElementById('recentTracks').innerHTML = recent.map((track, i) => `
                    <div class="track-row ${i === 0 ? 'active' : ''}" data-index="${i}">
                       <span class="track-duration">${track.duration}</span>
<i class="fas fa-heart like-btn ${this.likedTracks.has(i) ? 'active' : ''}" data-index="${i}"></i>
                        <img class="track-art-small" src="${track.art}" alt="${track.title}">
                        <div class="track-info">
                            <div class="track-title">${track.title}</div>
                            <div class="track-artist">${track.artist}</div>
                        </div>
                        <span class="track-duration">${track.duration}</span>
                    </div>
                `).join('');
                
            }
            toggleLike(index) {
    if (this.likedTracks.has(index)) {
        this.likedTracks.delete(index);
    } else {
        this.likedTracks.add(index);
    }

    this.storage.save("liked", [...this.likedTracks]);
    this.renderRecentTracks(); // refresh UI
}

            handleSearch(query) {
                if (!query) {
                    document.getElementById('searchResults').innerHTML = '';
                    return;
                }
                const results = this.tracks.filter(track => 
                    track.title.toLowerCase().includes(query.toLowerCase()) ||
                    track.artist.toLowerCase().includes(query.toLowerCase())
                );
                document.getElementById('searchResults').innerHTML = results.map((track, i) => `
                    <div class="track-row" data-index="${this.tracks.indexOf(track)}">
                        <span class="track-index">${this.tracks.indexOf(track) + 1}</span>
                        <img class="track-art-small" src="${track.art}" alt="${track.title}">
                        <div class="track-info">
                            <div class="track-title">${track.title}</div>
                            <div class="track-artist">${track.artist}</div>
                        </div>
                        <span class="track-duration">${track.duration}</span>
                    </div>
                `).join('');
            }

            playTrack(index) {
                this.currentTrackIndex = index;
                this.loadTrack(index);
                this.audio.play();
                this.updateActiveTrack();
                this.updateNowPlaying();
            }

            playPlaylist(playlist) {
                // Simulate playlist - play first track
                this.playTrack(0);
            }

            loadTrack(index) {
                const track = this.tracks[index];
                this.audio.src = track.src;
                this.audio.load();
                this.storage.save("lastTrack", index);
            }

            updateNowPlaying() {
                const track = this.tracks[this.currentTrackIndex];
                this.nowPlayingArt.src = track.art;
                this.nowPlayingTitle.textContent = track.title;
                this.nowPlayingArtist.textContent = track.artist;
            }

            updateActiveTrack() {
                document.querySelectorAll('.track-row').forEach((row, i) => {
                    row.classList.toggle('active', i === this.currentTrackIndex);
                });
            }

            togglePlay() {
                if (this.isPlaying) {
                    this.audio.pause();
                } else {
                    this.audio.play();
                }
            }

            debounce(func, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}
            nextTrack() {
                this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
                this.playTrack(this.currentTrackIndex);
            }

            prevTrack() {
                this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
                this.playTrack(this.currentTrackIndex);
            }

            onPlay() {
                this.isPlaying = true;
                this.playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            }

            onPause() {
                this.isPlaying = false;
                this.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }

            updateProgress() {
                if (this.audio.duration) {
                    const progress = (this.audio.currentTime / this.audio.duration) * 100;
                    this.progressFill.style.width = `${progress}%`;
                    this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
                }
            }

            updateDuration() {
                this.durationEl.textContent = this.formatTime(this.audio.duration);
            }

            seek(e) {
                const rect = this.progressContainer.getBoundingClientRect();
                const pos = (e.clientX - rect.left) / rect.width;
                this.audio.currentTime = pos * this.audio.duration;
            }

            setVolume(value) {
                this.audio.volume = value / 100;
                const icon = this.volumeIcon;
                icon.className = value == 0 ? 'fas fa-volume-mute' : 
                               value < 50 ? 'fas fa-volume-down' : 'fas fa-volume-up';
            }

            formatTime(seconds) {
                const mins = Math.floor(seconds / 60);
                const secs = Math.floor(seconds % 60);
                return `${mins}:${secs.toString().padStart(2, '0')}`;
            }
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            new SpotifyClone();
        });
