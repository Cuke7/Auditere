<template>
    <div class="flex flex-1 flex-col overflow-auto">
        <div class="flex m-8 items-center">
            <input v-model="playlistUrl" @keyup.enter="loadPlaylist" placeholder="Youtube playlist url" type="text" class="font-mono bg-slate-800 rounded-full p-3 w-full" />
            <button v-if="!player.playlistIsLoading" @click="loadPlaylist()" class="ml-4"><PlusIcon class="h-10 w-10 bg-white btn-circle p-2 text-slate-900" /></button>
            <button v-else class="ml-4 btn btn-ghost loading p-0"></button>
        </div>
        <div class="mx-8">
            <div v-for="(playlist, index) in player.savedPlaylists" :key="index" class="rounded-l-lg rounded-r-xl p-[2px] mb-8 bg-gradient-to-r from-primary to-secondary">
                <div class="flex justify-between items-center bg-slate-800 rounded-l-lg rounded-r-3xl p-4">
                    <div class="font-bold txt-lg">{{ playlist.name }}</div>
                    <div class="flex items-center">
                        <TrashIcon class="w-6 h-6 mr-16 text-white cursor-pointer" @click="player.removePlaylist(playlist)" />
                        <PlayIcon class="w-8 h-8 text-white cursor-pointer" @click="playlistClicked(playlist)" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { player } from "../store";
import { ref } from "vue";
import { Playlist } from "../types";
import { PlayIcon, PlusIcon, TrashIcon } from "@heroicons/vue/24/solid";

const playlistModalElement = ref<HTMLInputElement | null>(null);
const playlistUrl = ref("");
// const playlistUrl = ref("https://www.youtube.com/playlist?list=PLY80CRqvcxEXtmbMSJDqIK4uk_FB3j5I8");

const playlistClicked = async (playlist: Playlist) => {
    let updatedPlaylist = await player.loadPlaylist(playlist.url);
    if (updatedPlaylist) {
        if (playlistModalElement.value) playlistModalElement.value.checked = false;
        player.currentPlaylist = updatedPlaylist;
        const router = useRouter();
        router.push({ path: "/" });
        player.loadSong(updatedPlaylist.playlist[0]);
    }
};

const loadPlaylist = async () => {
    let playlist = await player.loadPlaylist(playlistUrl.value);
    if (playlist) {
        player.savedPlaylists.push(playlist);
        localStorage.setItem("playlists", JSON.stringify(player.savedPlaylists));
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
