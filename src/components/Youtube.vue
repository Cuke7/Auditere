<template>
    <div>
        <!-- SEARCH BAR AND BUTTON -->
        <v-card class="ma-5 rounded-pill" color="grey" style="position: fixed; width: -webkit-fill-available; z-index: 999;" :elevation="5">
            <v-row class="ma-1" align="center">
                <v-text-field
                    color="primary"
                    :loading="search_loading"
                    :disabled="search_loading"
                    clearable
                    ref="search_element"
                    v-model="search_query"
                    class="mx-6"
                    label="Search on youtube..."
                    @keydown.enter="search()"
                    append-icon="mdi-magnify"
                    @click:append="search()"
                    autocomplete="off"
                    @focus="show_player = false"
                >
                </v-text-field>
            </v-row>
        </v-card>

        <!-- SPACER SEARCH BAR -->
        <div style="height: 100px;"></div>

        <template v-for="song in search_results">
            <v-card class="ma-4 " color="grey" v-bind:key="search_results.indexOf(song)">
                <div class="d-flex flex-no-wrap justify-space-between pa-1">
                    <div class="my-auto ml-2">
                        <div class="subtitle-2">{{ song.title }}</div>
                        <v-card-subtitle class="ma-0 pa-0">{{ song.artist }} ({{ song.duration }}) </v-card-subtitle>
                        <v-row class="my-2" align="center">
                            <div class="mx-2">
                                <v-btn v-if="song.loaded" fab :disabled="true" color="secondary" width="50" height="50">
                                    <v-icon>mdi-music-note</v-icon>
                                </v-btn>
                                <v-btn
                                    v-else
                                    :loading="song.loading"
                                    :disabled="song.loading"
                                    fab
                                    color="secondary"
                                    @click="
                                        liste_lecture.list = [song];
                                        liste_lecture.name = null;
                                        send_load_song_event(song);
                                    "
                                    width="50"
                                    height="50"
                                >
                                    <v-icon>mdi-play</v-icon>
                                </v-btn>
                            </div>
                        </v-row>
                    </div>
                    <v-avatar class="my-auto mx-2" size="100">
                        <v-img :src="song.thumbnail"></v-img>
                    </v-avatar>
                </div>
            </v-card>
        </template>
    </div>
</template>

<script>
export default {
    name: "Youtube",

    data: () => ({
        search_loading: null,
        search_query: "",
        search_results: [],
        liste_lecture: [],
    }),
    methods: {
        async search() {
            this.search_loading = true;

            let res = await fetch("https://my-servo.herokuapp.com/musicAPI/get_search_results?search=" + encodeURI(this.search_query));
            const data = await res.json();

            console.log("Data from search results", data);
            if (data) {
                let index = -1;
                if (data.length == 0) {
                    this.error_snackbar.text = "No results found";
                    this.error_snackbar.timeout = 3000;
                    this.error_snackbar = true;
                    this.search_loading = false;
                }
                for (const results of data) {
                    index++;
                    results.loading = false;
                    results.loaded = false;
                    results.index = index;
                }
                this.search_results = data;
                this.$emit("gotSearchResults");
                this.search_loading = false;
            } else {
                console.error("Can't search for", this.search_query);
                //data = [];
                this.error_snackbar.text = "No results found";
                this.error_snackbar.timeout = 3000;
                this.error_snackbar = true;
                this.search_loading = false;
            }
        },
        send_load_song_event(song) {
            this.$emit("loadSong", song, false);
        },
    },
};
</script>
