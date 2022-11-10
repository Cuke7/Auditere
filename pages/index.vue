<template>
    <div class="flex flex-col items-center justify-around flex-1 py-8">
        <div class="flex justify-center">
            <img :src="player.currentSong.artwork" class="object-contain w-4/5 rounded-xl" />
        </div>
        <div class="flex w-4/5 flex-col">
            <div class="text-white font-bold">{{ player.currentSong.title }}</div>
            <div class="text-gray-400 font-bold">{{ player.currentSong.artist }}</div>
        </div>

        <div class="w-4/5">
            <input v-model="player.currentTime" type="range" min="0" :max="player.duration" class="range-primary range range-xs" />
            <div class="flex justify-between">
                <div class="font-mono">{{ formatTime(player.currentTime) }}</div>
                <div class="font-mono">{{ formatTime(player.duration) }}</div>
            </div>
        </div>
        <div class="w-4/5 flex justify-around items-center">
            <div class="btn btn-ghost h-10 w-10 p-0 hover:bg-transparent" @click="player.nextSong(false)">
                <BackwardIcon v-if="player.songIndex == 0" class="h-full w-full opacity-40 text-white" />
                <BackwardIcon v-else class="h-full w-full text-white" />
            </div>

            <div v-if="!player.songIsLoading" class="btn-ghost h-12 w-12 hover:bg-white bg-white rounded-full p-2">
                <!-- <PlayIcon class="h-full w-full text-slate-800" /> -->
                <PlayIcon v-if="!player.isPlaying" class="h-full w-full text-slate-800" @click="player.play(true)" />
                <PauseIcon v-else class="h-full w-full text-slate-800" @click="player.play(false)" />
            </div>
            <Loader v-else />

            <div class="btn btn-ghost h-10 w-10 p-0 hover:bg-transparent" @click="player.nextSong(true)">
                <ForwardIcon v-if="player.songIndex == player.currentPlaylist.playlist.length - 1 || player.currentPlaylist.playlist.length == 0" class="h-full w-full opacity-40 text-white" />
                <ForwardIcon v-else class="h-full w-full text-white" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PauseIcon, PlayIcon, ForwardIcon, BackwardIcon } from "@heroicons/vue/24/solid";
import { onMounted } from "vue";
import Loader from "../components/Loader.vue";
import { player } from "../store";

onMounted(async () => {
    let localData = localStorage.getItem("playlists");
    if (localData) {
        player.savedPlaylists = JSON.parse(localData);
    }
});

function formatTime(seconds: any) {
    let minutes = Math.floor(seconds / 60);
    minutes = Number(minutes >= 10 ? minutes : "0" + minutes);
    seconds = Math.floor(seconds % 60);
    seconds = seconds >= 10 ? seconds : "0" + seconds;
    return minutes + ":" + seconds;
}
</script>

<style>
.page-enter-active,
.page-leave-active {
    transition: all 0.2s;
}

.page-leave-to {
    transform: translate(-50px, 0);
}
</style>
