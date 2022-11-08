<template>
    <div class="flex flex-1">
        <div class="flex flex-col m-8 w-full">
            <input @keyup.enter="getSearch" ref="input" v-model="search" placeholder="Search on youtube" type="text" class="font-mono bg-red-800 rounded-full p-3 text-white placeholder:text-white" />
            <!-- <button v-if="!player.playlistIsLoading" @click="loadPlaylist()" class="ml-4"><PlusIcon class="h-10 w-10 bg-white btn-circle p-2 text-slate-900" /></button> -->

            <Loader class="mt-4" v-if="player.searchIsLoading" />
        </div>

        <div @click="songClicked(song, index)" v-for="(song, index) in searchResults" :key="index" class="flex my-4">
            <song-component :song="song" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import axios from "axios";
import { Song } from "../types";
import { player } from "../store";
import Loader from "../components/Loader.vue";
import SongComponent from "../components/SongComponent.vue";

const open = ref(false);
const input = ref<HTMLInputElement | null>(null);

watch(open, () => {
    input.value?.focus();
});

const searchModalElement = ref<HTMLInputElement | null>(null);
const search = ref("");
const suggestions = ref([]);
const searchResults = ref([] as Song[]);

const getSearch = async () => {
    player.searchIsLoading = true;
    suggestions.value = [];
    let { data } = await axios.get("/.netlify/functions/getSearch?search=" + search.value);
    searchResults.value = data;
    player.searchIsLoading = false;
};

const songClicked = (song: Song, index: number) => {
    open.value = false;
    player.songIndex = index;
    if (searchModalElement.value) searchModalElement.value.checked = false;
    player.loadSong(song);
    player.currentPlaylist = { name: search.value, playlist: [song], url: "" };
    player.songIndex = 0;
    search.value = "";
};
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
    transition: all 0.2s;
}
.page-leave-to {
    transform: translate(50px, 0);
}
</style>
