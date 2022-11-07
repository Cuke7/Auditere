<template>
    <div class="flex flex-1">
        <div class="flex flex-col w-full m-8">
            <input v-model="playlistUrl" @keyup.enter="loadPlaylist" placeholder="Youtube playlist url" type="text" class="font-mono bg-slate-800 rounded-full p-3" />
            <!-- <button v-if="!store.playlistIsLoading" @click="loadPlaylist()" class="ml-4"><PlusIcon class="h-10 w-10 bg-primary btn-circle p-2" /></button> -->
            <Loader class="mt-8" v-if="store.playlistIsLoading" />
        </div>
        <div class="mt-8">
            <div v-for="(playlist, index) in store.savedPlaylists" :key="index" class="flex justify-between items-center rounded-lg p-4">
                <div class="font-bold txt-lg">{{ playlist.name }}</div>
                <div class="flex items-center">
                    <TrashIcon class="w-6 h-6 mr-8" @click="store.removePlaylist(playlist)" />
                    <PlayIcon class="w-8 h-8" @click="playlistClicked(playlist)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { store } from "../store";
import { ref } from "vue";
import { Playlist } from "../types";
import Loader from "../components/Loader.vue";
import { PlusIcon } from "@heroicons/vue/24/solid";
import { PlayIcon } from "@heroicons/vue/24/solid";
import { TrashIcon } from "@heroicons/vue/24/solid";

const playlistModalElement = ref<HTMLInputElement | null>(null);
const playlistUrl = ref("");
// const playlistUrl = ref("https://www.youtube.com/playlist?list=PLY80CRqvcxEXtmbMSJDqIK4uk_FB3j5I8");

const playlistClicked = async (playlist: Playlist) => {
    let updatedPlaylist = await store.loadPlaylist(playlist.url);
    if (updatedPlaylist) {
        if (playlistModalElement.value) playlistModalElement.value.checked = false;
        store.currentPlaylist = updatedPlaylist;
        store.loadSong(updatedPlaylist.playlist[0]);
    }
};

const loadPlaylist = async () => {
    let playlist = await store.loadPlaylist(playlistUrl.value);
    if (playlist) {
        store.savedPlaylists.push(playlist);
        localStorage.setItem("playlists", JSON.stringify(store.savedPlaylists));
        playlistUrl.value = "";
    }
};
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
    transition: all 0.1s;
}
.page-enter-from,
.page-leave-to {
    opacity: 0;
}
</style>
