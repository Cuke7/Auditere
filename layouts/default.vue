<template>
    <div class="bg-black h-screen flex flex-col" data-theme="halloween" id="app">
        <slot />
        <div class="bg-transparent shadow-2xl shadow-white flex flex-col">
            <div v-if="page != '/' && player.currentSong.title != 'No song loaded.'" class="w-full flex h-16 border-t-2 border-secondary" id="preview">
                <img :src="player.currentSong.artwork" class="object-contain" />
                <div class="flex flex-col h-full truncate mx-4 w-full justify-center">
                    <div class="truncate">
                        {{ player.currentSong.title }}
                    </div>
                    <div class="truncate text-gray-400">
                        {{ player.currentSong.artist }}
                    </div>
                </div>
                <div class="flex items-center mx-4" v-if="!player.songIsLoading">
                    <PlayIcon v-if="!player.isPlaying" class="h-8 text-white" @click="player.play(true)" />
                    <PauseIcon v-else class="h-8 text-white" @click="player.play(false)" />
                </div>
                <Loader2 v-else class="h-8 w-8 my-auto mx-4"></Loader2>
            </div>
            <div class="flex justify-between items-center border-t-2 border-secondary p-6" id="menu">
                <NuxtLink to="/">
                    <MusicalNoteIcon v-if="page == '/'" class="h-6 w-6 mx-4 text-primary" />
                    <MusicalNoteIcon v-else class="h-6 w-6 mx-4 text-white" />
                </NuxtLink>
                <NuxtLink to="/queue" v-if="player.currentPlaylist.playlist.length > 0">
                    <QueueListIcon v-if="page == '/queue'" class="h-6 w-6 mx-4 text-primary" />
                    <QueueListIcon v-else class="h-6 w-6 mx-4 text-white" />
                </NuxtLink>
                <NuxtLink to="/playlist">
                    <FolderPlusIcon v-if="page == '/playlist'" class="h-6 w-6 mx-4 text-primary" />
                    <FolderPlusIcon v-else class="h-6 w-6 mx-4 text-white" />
                </NuxtLink>
                <NuxtLink to="/search">
                    <MagnifyingGlassIcon v-if="page == '/search'" class="h-6 w-6 mx-4 text-primary" />
                    <MagnifyingGlassIcon v-else class="h-6 w-6 mx-4 text-white" />
                </NuxtLink>
            </div>
        </div>
        <audio preload="auto" :src="player.audioSrc" @ended="player.nextSong(true)" class="" ref="audio" controls @canplaythrough="player.onCanplaythrough" @timeupdate="player.timeUpdate" @durationchange="player.durationUpdate"></audio>
    </div>
</template>

<script setup lang="ts">
import { player } from "../store";
import { MagnifyingGlassIcon, QueueListIcon, FolderPlusIcon, MusicalNoteIcon, PlayIcon, PauseIcon } from "@heroicons/vue/24/solid";
import { watch, ref, computed } from "vue";

const audio = ref<HTMLAudioElement | null>(null);
const route = ref(useRoute());

const page = computed(() => {
    return route.value.fullPath;
});

watch(
    () => player.isPlaying,
    (setPlay) => {
        if (setPlay) if (audio.value) audio.value.play();
        if (!setPlay) if (audio.value) audio.value.pause();
    }
);

watch(
    () => player.currentTime,
    (newVal) => {
        if (audio.value) {
            if (Math.abs(newVal - audio.value.currentTime) > 0.5) {
                audio.value.currentTime = newVal;
            }
        }
    }
);
</script>

<style>
input {
    outline: none;
}

#app {
    background-image: radial-gradient(circle, #1e293b, #201f2c, #1c161e, #130d11, #000000);
}

@keyframes border-pulsate {
    0% {
        border-color: #6d3a9c;
    }
    50% {
        border-color: #2b1243;
    }
    100% {
        border-color: #6d3a9c;
    }
}

#menu,
#preview {
    animation: border-pulsate 2s infinite;
}
</style>
