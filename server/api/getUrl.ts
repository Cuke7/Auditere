import ytdl from "ytdl-core";
import { sendStream } from 'h3'
import fs from 'node:fs'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const videoId = query.id + ""
    const info = await ytdl.getInfo(videoId);
    const format = ytdl.chooseFormat(info.formats, { quality: "highestaudio" });
    let url = "https://www.youtube.com/watch?v=" + videoId;
    let size = format.contentLength;
    const stream = ytdl(url, { format: format })
    setResponseHeader(event, 'Content-Type', "audio/mpeg")
    // appendResponseHeader(event, "Content-Length", size)
    // appendResponseHeader(event, "Content-Range", `bytes 0-${size}/${size}`)
    return sendStream(event, stream)
})