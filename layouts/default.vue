<template>
    <div class="bg-black h-screen flex flex-col" data-theme="halloween" id="app">
        <slot />
        <div class="bg-transparent shadow-lg shadow-white p-6 flex justify-around border-t-2 border-secondary">
            <NuxtLink to="/">
                <MusicalNoteIcon class="h-6 w-6 mx-4 text-primary" />
            </NuxtLink>
            <NuxtLink to="/" v-if="player.currentPlaylist.playlist.length > 0">
                <QueueListIcon class="h-6 w-6 mx-4 text-primary" />
            </NuxtLink>
            <NuxtLink to="/playlist">
                <FolderPlusIcon class="h-6 w-6 mx-4 text-primary" />
            </NuxtLink>

            <NuxtLink to="/search">
                <MagnifyingGlassIcon class="h-6 w-6 mx-4 text-primary" />
            </NuxtLink>
        </div>
        <audio :src="player.audioSrc" @ended="player.nextSong(true)" class="hidden" ref="audio" controls @canplaythrough="player.onCanplaythrough" @timeupdate="player.timeUpdate" @durationchange="player.durationUpdate"></audio>
    </div>
</template>

<script setup lang="ts">
import { player } from "../store";
import { MagnifyingGlassIcon, QueueListIcon, FolderPlusIcon, MusicalNoteIcon } from "@heroicons/vue/24/solid";
import { watch, ref } from "vue";

const audio = ref<HTMLAudioElement | null>(null);

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
</style>
