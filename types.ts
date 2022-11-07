export type Playlist = {
    name: string;
    playlist: Song[];
    url: string
}

export type Song = {
    title: string;
    artwork: string;
    videoId: string;
    artist: string;
}