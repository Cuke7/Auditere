import ytdl from "ytdl-core";
import { sendStream } from 'h3'
import fs from 'node:fs'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const videoId = query.id + ""
    const info = await ytdl.getInfo(videoId);
    const format = ytdl.chooseFormat(info.formats, { quality: "highestaudio" });
    // if (format == null) {
    //     return null
    // }
    // return format
    let url = "https://www.youtube.com/watch?v=" + videoId;

    let type = "audio/mpeg";
    let size = format.contentLength;
    // ytdl(url, {
    //     format: format,
    // });

    const stream = ytdl(url, { format: format })
    // event.respondWith(stream)
    // setResponseHeader(event, 'Content-Type', "audio/mpeg")
    // stream.pipe(event.res)
    // appendResponseHeader(event, "Content-Length", size)
    // event.respondWith("re")

    // setResponseHeader(event, 'Content-Type', "audio/mpeg")

    return sendStream(event, stream)
})