import { ref, reactive } from 'vue'
import { Playlist, Song } from './types'
import axios from "axios";

const testServerURl = ""

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
    search: "Century",
    searchResults: [] as Song[],
    searchIsLoading: false,
    async loadSong(song: Song) {
        player.isPlaying = false;
        player.currentSong = song;
        player.songIsLoading = true;
        // let { data } = await axios.get(testServerURl + "https://auditere-backend.onrender.com/?id=" + song.videoId);
        // player.audioSrc = "https://auditere-backend.onrender.com?id=" + song.videoId
        let data = await $fetch('/api/getUrl?id=' + song.videoId)
        console.log(data)
        player.audioSrc = data.url
        // player.audioSrc = "http://localhost:3001/api?id=" + song.videoId
        player.currentTime = 0
    },
    async loadPlaylist(playlistUrl: string) {
        player.playlistIsLoading = true;
        let response = await axios.get(testServerURl + "/.netlify/functions/getPlaylist?id=" + playlistUrl);
        if (response.data == 'Incorrect URL') {
            player.playlistIsLoading = false;
            console.error("Wrong url")
            return null
        } else {
            player.playlistIsLoading = false;
            return response.data
        }
    },
    testPlayer(id: string) {
        player.audioSrc = "https://auditere-backend.onrender.com/?id=" + id
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

