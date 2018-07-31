export const kFormatter = (num) => {
    return num > 999 ? (num/1000).toFixed(1) + 'k' : num
}

export const timeFormatter = (time) => {
    time = Number(time);
    var h = Math.floor(time / 3600);
    var m = Math.floor(time % 3600 / 60);
    var s = Math.floor(time % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " Hour, " : " Hours, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " Minute, " : " Minutes, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " Second" : " Seconds") : "";
    return (hDisplay + mDisplay + sDisplay) || 0; 
}