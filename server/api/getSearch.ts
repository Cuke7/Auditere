import axios from "axios";

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const search = query.search + ""
    let { data } = await axios("https://www.youtube.com/results?search_query=" + search);
    let start = data.indexOf("var ytInitialData = ");
    let end = data.indexOf("</script>", start);

    let obj = data.substring(start + 20, end - 1);
    let temp = JSON.parse(obj);
    let contents = temp.contents.twoColumnSearchResultsRenderer.primaryContents.sectionListRenderer.contents;;

    let data2;

    for (const content of contents) {
        if (content.hasOwnProperty("itemSectionRenderer")) {
            if (content.itemSectionRenderer.contents.length > 1) {
                data2 = content.itemSectionRenderer.contents;
            }
        }
    }
    let results = [];

    for (const item of data2) {
        if (item.hasOwnProperty("videoRenderer")) {
            if (item.videoRenderer.lengthText) {
                if (item.videoRenderer.ownerBadges) {
                    if (item.videoRenderer.ownerBadges[0].metadataBadgeRenderer.icon.iconType == "OFFICIAL_ARTIST_BADGE")
                        results.push({
                            title: item.videoRenderer.title.runs[0].text,
                            artwork: item.videoRenderer.thumbnail.thumbnails[item.videoRenderer.thumbnail.thumbnails.length - 1].url,
                            videoId: item.videoRenderer.videoId,
                            artist: item.videoRenderer.ownerText.runs[0].text,
                            duration: item.videoRenderer.lengthText.simpleText,
                        });
                }
            }
        }
    }

    function compare(a: any, b: any) {
        if (a.official && !b.official) {
            return -1;
        }
        if (!a.official && b.official) {
            return 1;
        }
        return 0;
    }

    if (results.length < 5) {
        results = [];
        for (const item of data2) {
            if (item.hasOwnProperty("videoRenderer")) {
                if (item.videoRenderer.lengthText) {
                    if (item.videoRenderer.ownerBadges) {
                        results.push({
                            title: item.videoRenderer.title.runs[0].text,
                            artwork: item.videoRenderer.thumbnail.thumbnails[item.videoRenderer.thumbnail.thumbnails.length - 1].url,
                            videoId: item.videoRenderer.videoId,
                            artist: item.videoRenderer.ownerText.runs[0].text,
                            duration: item.videoRenderer.lengthText.simpleText,
                        });
                    }
                }
            }
        }
    }

    return results.sort(compare)
})