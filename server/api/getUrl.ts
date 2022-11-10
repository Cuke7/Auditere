import ytdl from "ytdl-core";
import { sendStream } from 'h3'

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
    let stream = ytdl(url, {
        format: format,
        // requestOptions: {
        //     headers: DEFAULT_HEADERS,
        // },
    });

    return sendStream(event, stream)
})