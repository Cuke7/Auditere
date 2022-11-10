import ytdl from "ytdl-core";

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const videoId = query.id + ""
    const info = await ytdl.getInfo(videoId);
    const format = ytdl.chooseFormat(info.formats, { quality: "highestaudio" });
    console.log("Infos", info)
    if (format == null) {
        return null
    }
    return format
})