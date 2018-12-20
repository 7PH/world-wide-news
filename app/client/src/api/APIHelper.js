
export class APIHelper {

    /**
     * Retrieve the url of the end point
     *
     * @param start
     * @param end
     * @return {string}
     */
    static getURL(start, end) {

        return `${APIHelper.PROTOCOL}://${APIHelper.HOST}:${APIHelper.PORT}/api?start=${start}&end=${end}`;
    }

    /**
     * Fetch the API data from start to end
     *
     * @param start Start timestamp (sec)
     * @param end End timestamp (sec)
     * @return {Promise<Response>}
     */
    static async fetch(start, end) {

        const d = await (await fetch(APIHelper.getURL(start, end))).json();
        d.list = d.list.map(l => ({
            event_code: l[0],
            lat: l[1],
            long: l[2]
        }));
        return d;
    }
}


APIHelper.PROTOCOL = "https";
APIHelper.HOST = "benjamin-raymond.pro";
APIHelper.PORT = "3000";
