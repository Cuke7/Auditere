<template>
    <div class="flex flex-col flex-grow overflow-auto">
        <div class="flex flex-col">
            <div class="flex-col flex m-8 items-center">
                <input @keyup.enter="getSearch" ref="input" v-model="player.search" placeholder="Search on youtube" type="text" class="w-full font-mono bg-red-800 rounded-full p-3 text-white placeholder:text-white" />
            </div>
            <Loader v-if="player.searchIsLoading" class="mx-auto"></Loader>
        </div>
        <div class="flex flex-col px-8">
            <div @click="songClicked(song, index)" v-for="(song, index) in player.searchResults" :key="index" class="flex my-4">
                <song-component :song="song" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Song } from "../types";
import { player } from "../store";
import Loader from "../components/Loader.vue";
import SongComponent from "../components/SongComponent.vue";

const input = ref<HTMLInputElement | null>(null);

onMounted(() => {
    input.value?.focus();
});

const searchModalElement = ref<HTMLInputElement | null>(null);
const suggestions = ref([]);

const getSearch = async () => {
    player.searchIsLoading = true;
    suggestions.value = [];
    let data: any = await $fetch("/api/getSearch?search=" + player.search);
    data = data.filter((item: Song) => hmsToSecondsOnly(item.duration) < 600);
    console.table(data);
    player.searchResults = data;
    player.searchIsLoading = false;
};

function hmsToSecondsOnly(duration: string) {
    var p: any[] = duration.split(":"),
        s = 0,
        m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
}
const songClicked = (song: Song, index: number) => {
    const router = useRouter();
    router.push({ path: "/" });
    player.songIndex = index;
    if (searchModalElement.value) searchModalElement.value.checked = false;
    player.loadSong(song);
    player.currentPlaylist = { name: player.search, playlist: [song], url: "" };
    player.songIndex = 0;
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
