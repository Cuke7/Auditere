import { ref, reactive } from 'vue'
import { Playlist, Song } from './types'
import axios from "axios";

export const store = reactive({
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
    searchIsLoading: false,
    async loadSong(song: any) {
        store.isPlaying = false;
        store.currentSong = song;
        store.songIsLoading = true;
        let { data } = await axios.get("/.netlify/functions/getUrl?id=" + song.videoId);
        store.audioSrc = data.url;
        store.currentTime = 0
    },
    async loadPlaylist(playlistUrl: string) {
        store.playlistIsLoading = true;
        let response = await axios.get("/.netlify/functions/getPlaylist?id=" + playlistUrl);
        if (response.data == 'Incorrect URL') {
            store.playlistIsLoading = false;
            console.error("Wrong url")
            return null
        } else {
            store.playlistIsLoading = false;
            return response.data
        }
    },
    removePlaylist(playlist: Playlist) {
        store.savedPlaylists.splice(store.savedPlaylists.indexOf(playlist), 1)
        localStorage.setItem("playlists", JSON.stringify(store.savedPlaylists));
    }
})