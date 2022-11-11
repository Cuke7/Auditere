<template>
    <img class="w-24 rounded cursor-pointer" :src="song.artwork" alt="" />
    <div class="ml-4 cursor-pointer">
        <div class="text-sm">
            {{ song.title }}
        </div>
        <div class="text-sm text-gray-400">
            {{ song.artist }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Song } from "../types";

interface Props {
    song: Song;
}

const props = defineProps<Props>();
</script>
