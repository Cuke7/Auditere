import { reactive } from 'vue'
import { Playlist, Song } from './types'

export const player = reactive({
    savedPlaylists: [] as Playlist[],
    currentPlaylist: { name: "", playlist: [] as Song[], url: "" },
    currentSong: {
        title: "No song loaded.",
        artist: "",
        artwork: "/bird.png",
    },
    playlistIsLoading: false,
    songIndex: 0,
    songIsLoading: false,
    isPlaying: false,
    currentTime: 0,
    duration: 300,
    audioSrc: '',
    search: "",
    searchResults: [] as Song[],
    searchIsLoading: false,
    async loadSong(song: Song) {
        player.isPlaying = false;
        player.currentSong = song;
        player.songIsLoading = true;
        // player.audioSrc = "/api/getUrl?id=" + song.videoId
        player.audioSrc = " https://auditere-backend.onrender.com/?id=" + song.videoId
        player.currentTime = 0
    },
    async loadPlaylist(playlistUrl: string) {
        player.playlistIsLoading = true;
        let data = await $fetch("/api/getPlaylist?id=" + playlistUrl);
        if (data == null) {
            player.playlistIsLoading = false;
            console.error("Wrong url")
            return null
        } else {
            player.playlistIsLoading = false;
            return data
        }
    },
    nextSong(forward: boolean) {
        if (forward) {
            if (player.songIndex < player.currentPlaylist.playlist.length - 1) {
                player.loadSong(player.currentPlaylist.playlist[player.songIndex + 1]);
                player.songIndex++;
            }
        } else {
            if (player.songIndex > 0) {
                player.loadSong(player.currentPlaylist.playlist[player.songIndex - 1]);
                player.songIndex--;
            }
        }
    },
    play(setPlay: boolean) {
        player.isPlaying = setPlay;
    },
    onCanplaythrough() {
        console.log("onCanplaythrough")
        player.songIsLoading = false
        player.play(true)
        if (navigator.mediaSession.metadata) {
            console.log("HEY")
            navigator.mediaSession.metadata = new MediaMetadata({
                title: player.currentSong.title,
                artist: player.currentSong.artist,
                album: player.currentPlaylist.name,
                artwork: [
                    { src: player.currentSong.artwork, sizes: '312x312', type: 'image/png' },
                ]
            });
        }
    },
    timeUpdate(event: any) {
        player.currentTime = event.target.currentTime;
    },
    durationUpdate(event: any) {
        player.duration = event.target.duration;
    },
    removePlaylist(playlist: Playlist) {
        player.savedPlaylists.splice(player.savedPlaylists.indexOf(playlist), 1)
        localStorage.setItem("playlists", JSON.stringify(player.savedPlaylists));
    }
})

