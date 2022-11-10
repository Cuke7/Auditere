import axios from "axios";

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    let playlistUrl = query.id + ""
    let rp
    try {
        rp = await axios.get(playlistUrl);
    } catch {
        return null;
    }
    let body = rp.data
    let start = body.indexOf("var ytInitialData = ");
    let end = body.indexOf("</script>", start);
    let obj = body.substring(start + 20, end - 1);
    let ytdata = JSON.parse(obj);
    let data
    try {
        data = ytdata.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].playlistVideoListRenderer.contents;
    } catch (error) {
        console.error(error);
        return null
    }
    let playlist = [];
    for (const item of data) {
        playlist.push({
            title: item.playlistVideoRenderer.title.runs[0].text,
            artwork: item.playlistVideoRenderer.thumbnail.thumbnails[0].url.split('?')[0],
            videoId: item.playlistVideoRenderer.videoId,
            artist: item.playlistVideoRenderer.shortBylineText.runs[0].text,
        });
    }
    return { name: ytdata.metadata.playlistMetadataRenderer.title, playlist: playlist, url: playlistUrl }
})