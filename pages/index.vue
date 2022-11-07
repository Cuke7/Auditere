<template>
    <div class="flex flex-col items-center justify-around flex-1 py-8">
        <div class="flex justify-center">
            <img :src="store.currentSong.artwork" class="object-contain w-4/5 rounded-lg" />
        </div>
        <div class="flex w-4/5 flex-col">
            <div class="text-white font-bold">{{ store.currentSong.title }}</div>
            <div class="text-gray-400 font-bold">{{ store.currentSong.artist }}</div>
        </div>

        <div class="w-4/5">
            <input v-model="currentTime" type="range" min="0" :max="store.duration" class="range-primary range range-xs" />
            <div class="flex justify-between">
                <div class="font-mono">{{ formatTime(currentTime) }}</div>
                <div class="font-mono">{{ formatTime(store.duration) }}</div>
            </div>
        </div>
        <div class="w-4/5 flex justify-around items-center">
            <div class="btn btn-ghost h-10 w-10 p-0" @click="nextSong(false)">
                <BackwardIcon v-if="store.songIndex == 0" class="h-full w-full opacity-40 text-white" />
                <BackwardIcon v-else class="h-full w-full text-white" />
            </div>

            <div v-if="!store.songIsLoading" class="btn btn-ghost h-12 w-12 hover:bg-white bg-white rounded-full p-2">
                <!-- <PlayIcon class="h-full w-full text-slate-800" /> -->
                <PlayIcon v-if="!store.isPlaying" class="h-full w-full text-slate-800" @click="play(!store.isPlaying)" />
                <PauseIcon v-else class="h-full w-full text-slate-800" @click="play(!store.isPlaying)" />
            </div>
            <Loader v-else />

            <div class="btn btn-ghost h-10 w-10 p-0" @click="nextSong(true)">
                <ForwardIcon v-if="store.songIndex == store.currentPlaylist.playlist.length - 1 || store.currentPlaylist.playlist.length == 0" class="h-full w-full opacity-40 text-white" />
                <ForwardIcon v-else class="h-full w-full text-white" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PlayIcon } from "@heroicons/vue/24/solid";
import { PauseIcon } from "@heroicons/vue/24/solid";
import { ForwardIcon } from "@heroicons/vue/24/outline";
import { BackwardIcon } from "@heroicons/vue/24/outline";
import { ref, watch, toRef } from "vue";
import Loader from "../components/Loader.vue";
import { store } from "../store";

const audio = ref<HTMLAudioElement | null>(null);
watch(
    () => store.audioSrc,
    (newSrc) => {
        if (audio.value) audio.value.src = newSrc;
    }
);
watch(
    () => store.isPlaying,
    (setPlay) => {
        if (setPlay) if (audio.value) audio.value.play();
        if (!setPlay) if (audio.value) audio.value.pause();
    }
);

let localData = localStorage.getItem("playlists");
if (localData) {
    store.savedPlaylists = JSON.parse(localData);
}

const play = (setPlay: boolean) => {
    store.isPlaying = setPlay;
    if (setPlay) if (audio.value) audio.value.play();
    if (!setPlay) if (audio.value) audio.value.pause();
};

const currentTime = toRef(store, "currentTime");
watch(currentTime, (newVal) => {
    if (audio.value) {
        if (Math.abs(newVal - audio.value.currentTime) > 0.5) {
            audio.value.currentTime = newVal;
        }
    }
});

const nextSong = (forward: boolean) => {
    if (forward) {
        if (store.songIndex < store.currentPlaylist.playlist.length - 1) {
            store.loadSong(store.currentPlaylist.playlist[store.songIndex + 1]);
            store.songIndex++;
        }
    } else {
        if (store.songIndex > 0) {
            store.loadSong(store.currentPlaylist.playlist[store.songIndex - 1]);
            store.songIndex--;
        }
    }
};

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
