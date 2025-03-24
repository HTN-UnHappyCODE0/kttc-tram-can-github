export default function fancyTimeFormat(duration: number) {
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = '';

    if (hrs > 0) {
        ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }

    ret += '' + mins + ':' + (secs < 10 ? '0' : '');
    ret += '' + secs;
    return ret;
}

export function secondsToHms(d: number) {
    const dd = Number(d);
    const h = Math.floor(dd / 3600);
    const m = Math.floor((dd % 3600) / 60);
    const s = Math.floor((dd % 3600) % 60);

    const hDisplay = h > 0 ? h + ' giờ ' : '';
    const mDisplay = m > 0 ? m + ' phút ' : '';
    const sDisplay = s > 0 ? s + ' giây ' : '';
    return hDisplay + mDisplay + sDisplay;
}
