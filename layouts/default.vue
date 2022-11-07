<template>
    <div class="bg-black h-screen flex flex-col" data-theme="halloween" id="app">
        <slot />
        <div class="bg-transparent shadow-lg shadow-white p-6 flex justify-around border-t-2 border-secondary">
            <NuxtLink to="/">
                <MusicalNoteIcon class="h-6 w-6 mx-4 text-primary" />
            </NuxtLink>
            <NuxtLink to="/playlist">
                <FolderPlusIcon class="h-6 w-6 mx-4 text-primary" />
            </NuxtLink>
            <NuxtLink to="/" v-if="store.currentPlaylist.playlist.length > 0">
                <QueueListIcon class="h-6 w-6 mx-4 text-primary" />
            </NuxtLink>
            <NuxtLink to="/search">
                <MagnifyingGlassIcon class="h-6 w-6 mx-4 text-primary" />
            </NuxtLink>
            <!-- <label v-if="store.currentPlaylist.playlist.length > 0" for="queueModal" class="modal-button">
                <QueueListIcon class="h-6 w-6 mx-4 text-primary" />
            </label>
            <label for="my-modal-4" class="modal-button"> <MusicalNoteIcon class="h-6 w-6 mx-4 text-primary" /></label> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { store } from "../store";
import { MagnifyingGlassIcon, QueueListIcon, FolderPlusIcon, MusicalNoteIcon } from "@heroicons/vue/24/solid";
</script>

<style>
input {
    outline: none;
}

#app {
    background-image: radial-gradient(circle, #1e293b, #201f2c, #1c161e, #130d11, #000000);
}
</style>
