<template>
    <div class="flex flex-col flex-1 overflow-auto">
        <div class="text-lg font-bold mx-auto m-8">{{ player.currentPlaylist.name }}</div>
        <div class="overflow-scroll px-8">
            <div @click="songClicked(song, index)" v-for="(song, index) in player.currentPlaylist.playlist" :key="index" class="flex my-4">
                <song-component :song="song" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { player } from "../store";
import { Song } from "../types";
import SongComponent from "../components/SongComponent.vue";

const queueModal = ref<HTMLInputElement | null>(null);

const songClicked = (song: Song, index: number) => {
    // const router = useRouter();
    // router.push({ path: "/" });
    player.songIndex = index;
    if (queueModal.value) queueModal.value.checked = false;
    player.loadSong(song);
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
