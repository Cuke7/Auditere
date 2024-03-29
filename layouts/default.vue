<template>
    <div class="bg-black h-screen flex flex-col" data-theme="halloween" id="app">
        <div class="flex flex-grow flex-col overflow-auto sm:flex-row sm:w-1/3 sm:mx-auto">
            <slot />
            <div class="bg-transparent flex flex-col sm:order-first">
                <div v-if="page != '/' && player.currentSong.title != 'No song loaded.'" class="w-full flex h-16 border-t-2 border-secondary sm:hidden" id="preview">
                    <img :src="player.currentSong.artwork" class="object-contain" />
                    <div class="flex flex-col h-full truncate mx-4 w-full justify-center">
                        <div class="truncate text-sm">
                            {{ player.currentSong.title }}
                        </div>
                        <div class="truncate text-gray-400 text-sm">
                            {{ player.currentSong.artist }}
                        </div>
                    </div>
                    <div class="flex items-center mx-4" v-if="!player.songIsLoading">
                        <PlayIcon v-if="!player.isPlaying" class="h-8 text-white" @click="player.play(true)" />
                        <PauseIcon v-else class="h-8 text-white" @click="player.play(false)" />
                    </div>
                    <Loader2 v-else class="h-8 w-8 my-auto mx-4"></Loader2>
                </div>
                <div class="flex justify-between items-center border-t-2 border-primary p-6 sm:flex-col sm:border-t-0 sm:border-r-2 sm:h-full sm:justify-start sm:space-y-8" id="menu">
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
        </div>

        <audio autoplay preload="auto" :src="player.audioSrc" @ended="player.nextSong(true)" class="hidden" ref="audio" controls @canplaythrough="player.onCanplaythrough" @timeupdate="player.timeUpdate" @durationchange="player.durationUpdate"></audio>
    </div>
</template>

<script setup lang="ts">
import { player } from "../store";
import { MagnifyingGlassIcon, QueueListIcon, FolderPlusIcon, MusicalNoteIcon, PlayIcon, PauseIcon } from "@heroicons/vue/24/solid";
import { watch, ref, computed, onMounted } from "vue";

onMounted(() => {
    if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: "Never Gonna Give You Up",
            artist: "",
            album: "",
            artwork: [],
        });

        navigator.mediaSession.setActionHandler("play", () => {
            player.play(true);
        });
        navigator.mediaSession.setActionHandler("pause", () => {
            player.play(false);
        });
        // navigator.mediaSession.setActionHandler("seekbackward", function () {});
        // navigator.mediaSession.setActionHandler("seekforward", function () {});
        navigator.mediaSession.setActionHandler("previoustrack", () => {
            player.nextSong(false);
        });
        navigator.mediaSession.setActionHandler("nexttrack", () => {
            player.nextSong(true);
        });
    }
});

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

/*#menu,
#preview {
    animation: border-pulsate 2s infinite;
}*/

html {
    overscroll-behavior: contain;
}
</style>
