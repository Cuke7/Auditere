<template>
    <div class="flex flex-1">
        <div class="flex flex-col m-8 w-full">
            <input @keyup.enter="getSearch" ref="input" v-model="search" placeholder="Search on youtube" type="text" class="font-mono bg-red-800 rounded-full p-3 text-white placeholder:text-white" />

            <Loader class="mt-4" v-if="store.searchIsLoading" />
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
import { store } from "../store";
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
    store.searchIsLoading = true;
    suggestions.value = [];
    let { data } = await axios.get("/.netlify/functions/getSearch?search=" + search.value);
    searchResults.value = data;
    store.searchIsLoading = false;
};

const songClicked = (song: Song, index: number) => {
    open.value = false;
    store.songIndex = index;
    if (searchModalElement.value) searchModalElement.value.checked = false;
    store.loadSong(song);
    store.currentPlaylist = { name: search.value, playlist: [song], url: "" };
    store.songIndex = 0;
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
