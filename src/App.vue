<template>
    <v-app v-cloak>
        <v-app-bar app color="primary" dense>
            <v-toolbar-title class="white--text">Auditere 🎧</v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn class="white--text" icon @click="reset_search()">
                <v-icon>mdi-magnify</v-icon>
            </v-btn>

            <v-switch color="white" v-model="dark_mode_activated" hide-details>
                <v-icon slot="append" color="white">mdi-brightness-6</v-icon>
            </v-switch>

            <template v-slot:extension>
                <v-tabs v-model="tab" :fixed-tabs="true" color="white">
                    <v-tabs-slider color="secondary"></v-tabs-slider>
                    <v-tab>
                        <div class="white--text">Internet</div>
                    </v-tab>
                    <v-tab>
                        <v-icon color="white">mdi-playlist-music</v-icon>
                    </v-tab>
                    <v-tab>
                        <div class="white--text">Playlists</div>
                    </v-tab>
                </v-tabs>
            </template>
        </v-app-bar>

        <v-main>
            <v-tabs-items v-model="tab">
                <v-tab-item>
                    <Youtube ref="youtube_tab" @gotSearchResults="got_search_results" @loadSong="load_song_event"></Youtube>
                </v-tab-item>

                <v-tab-item eager>
                    <ListeLecture eager ref="listeLecture_tab" @loadSong="load_song_event"></ListeLecture>
                </v-tab-item>

                <v-tab-item>
                    <Playlists @errorEvent="show_error" @loadPlaylist="load_playlist" @gotPlaylist="playlist_loaded"></Playlists>
                </v-tab-item>
            </v-tabs-items>

            <!-- PLAYER FAB -->
            <v-fab-transition>
                <v-btn color="primary" fixed bottom right fab @click="show_player(true)" width="70" height="70">
                    <v-icon>mdi-music-note</v-icon>
                </v-btn>
            </v-fab-transition>

            <Player
                ref="player"
                v-bind:current_loaded_song="current_loaded_song"
                v-bind:current_loading_song="current_loading_song"
                @playerIsRready="player_is_ready_event"
                @changeSong="change_song_event"
            ></Player>
            <v-snackbar v-model="error_snackbar.val" :timeout="error_snackbar.timeout">
                {{ error_snackbar.text }}
            </v-snackbar>
        </v-main>
    </v-app>
</template>

<script>
import Youtube from "./components/Youtube";
import Player from "./components/Player";
import ListeLecture from "./components/ListeLecture";
import Playlists from "./components/Playlists";

export default {
    name: "App",

    components: {
        Youtube,
        Player,
        ListeLecture,
        Playlists,
    },

    data: () => ({
        dark_mode_activated: true,
        tab: 0,
        song_index: 0,
        current_loading_song: { loading: false },
        current_loaded_song: null,
        error_snackbar: { val: false, text: "", timeout: 3000 },
    }),
    methods: {
        reset_search() {
            this.tab = 0;
            window.scrollTo(0, 0);
            let youtube_tab = this.$refs.youtube_tab;
            youtube_tab.search_query = "";
            youtube_tab.$refs.search_element.focus();
            youtube_tab.search_loading = false;
            this.show_player(false);
        },
        got_search_results() {
            this.song_index = 0;
            this.tab = 0;
            window.scrollTo(0, 0);
            this.show_player(false);
            console.log(this.$refs.listeLecture_tab);
        },
        show_player(bool) {
            this.$refs.player.show_player = bool;
        },
        load_song_event(song, fromPlaylist) {
            if (fromPlaylist) {
                //
            } else {
                this.$refs.listeLecture_tab.liste_lecture.list = [song];
                this.$refs.listeLecture_tab.liste_lecture.name = null;
            }

            this.$refs.player.load_song(song);

            // Reset all the others items in the search_results
            for (const song_temp of this.$refs.youtube_tab.search_results) {
                song_temp.loaded = false;
                song_temp.loading = false;
            }

            // Reset all the others items in the liste_lecture
            for (const song_temp of this.$refs.listeLecture_tab.liste_lecture.list) {
                song_temp.loaded = false;
                song_temp.loading = false;
            }

            this.current_loading_song = song;
            this.current_loading_song.loading = true;

            this.song_index = song.index;
        },
        player_is_ready_event() {
            this.current_loaded_song = this.current_loading_song;
            this.current_loaded_song.loaded = true;
            this.current_loaded_song.loading = false;

            navigator.mediaSession.metadata.title = this.current_loaded_song.title;
            navigator.mediaSession.metadata.artwork = [{ src: this.current_loaded_song.thumbnail, sizes: "312x312", type: "image/png" }];
            navigator.mediaSession.metadata.artist = this.current_loaded_song.artist;
        },
        show_error(error_message) {
            this.error_snackbar.text = error_message;
            this.error_snackbar.timeout = 6000;
            this.error_snackbar.val = true;
        },
        load_playlist() {
            this.tab = 1;
            this.show_player(false);
            this.$refs.listeLecture_tab.liste_lecture.loading = true;
        },
        playlist_loaded(data) {
            let index = -1;
            let playlist_temp = data.playlist;
            for (const song of playlist_temp) {
                index++;
                song.loading = false;
                song.loaded = false;
                song.index = index;
            }
            this.$refs.listeLecture_tab.liste_lecture.list = playlist_temp;
            this.$refs.listeLecture_tab.liste_lecture.name = data.name;
            this.$refs.listeLecture_tab.liste_lecture.loading = false;
            this.$refs.youtube_tab.search_loading = false;
            this.tab = 1;
            this.show_player(false);
            this.$refs.youtube_tab.search_query = "";
            window.scrollTo(0, 0);
        },
        change_song_event(forward, shuffle) {
            if (this.current_loading_song.title) {
                // Normal
                if (shuffle == 1) {
                    console.log("Normal, before", this.song_index);
                    if (forward) {
                        this.song_index = Math.min(this.song_index + 1, this.$refs.listeLecture_tab.liste_lecture.list.length - 1);
                    } else {
                        this.song_index = Math.max(this.song_index - 1, 0);
                    }
                    this.load_song_event(this.$refs.listeLecture_tab.liste_lecture.list[this.song_index], true);
                    console.log("Normal, after", this.song_index);
                }

                // Repeat
                if (shuffle == 2) {
                    if (forward) {
                        //
                    } else {
                        this.song_index = Math.max(this.song_index - 1, 0);
                    }
                    this.load_song_event(this.$refs.listeLecture_tab.liste_lecture.list[this.song_index], true);
                }

                // Shuffle
                if (shuffle == 3) {
                    if (forward) {
                        this.song_index = Math.floor(Math.random() * this.$refs.listeLecture_tab.liste_lecture.list.length);
                    } else {
                        this.song_index = Math.max(this.song_index - 1, 0);
                    }
                    this.load_song_event(this.$refs.listeLecture_tab.liste_lecture.list[this.song_index], true);
                }
            }
        },
    },
    watch: {
        dark_mode_activated(val) {
            this.$vuetify.theme.dark = !val;
        },
    },
    mounted: function() {
        this.$nextTick(function() {
            // Media session stuff
            if ("mediaSession" in navigator) {
                // eslint-disable-next-line no-undef
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: "Never Gonna Give You Up",
                    artist: "",
                    album: "",
                    artwork: [
                        { src: "https://dummyimage.com/96x96", sizes: "96x96", type: "image/png" },
                        { src: "https://dummyimage.com/128x128", sizes: "128x128", type: "image/png" },
                        { src: "https://dummyimage.com/192x192", sizes: "192x192", type: "image/png" },
                        { src: "https://dummyimage.com/256x256", sizes: "256x256", type: "image/png" },
                        { src: "https://dummyimage.com/384x384", sizes: "384x384", type: "image/png" },
                        { src: "https://dummyimage.com/512x512", sizes: "512x512", type: "image/png" },
                    ],
                });

                navigator.mediaSession.setActionHandler("play", function() {
                    this.$refs.player.play();
                });
                navigator.mediaSession.setActionHandler("pause", function() {
                    this.$refs.player.pause();
                });
                navigator.mediaSession.setActionHandler("seekbackward", function() {});
                navigator.mediaSession.setActionHandler("seekforward", function() {});
                navigator.mediaSession.setActionHandler("previoustrack", function() {
                    this.$refs.player.change_song(false);
                });
                navigator.mediaSession.setActionHandler("nexttrack", function() {
                    this.$refs.player.change_song(true);
                });
            }
        });
    },
};
</script>
