import ytdl from "ytdl-core";


export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const videoId = query.id + ""
    const info = await ytdl.getInfo(videoId);
    console.log("Infos", info)
    const format = ytdl.chooseFormat(info.formats, { quality: "highestaudio" });
    return format
})