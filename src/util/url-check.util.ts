/**
 * Checks if you're on youtube.{TLD}/watch{...}
 *
 * @returns boolean - true if you're on youtube.{TLD}/watch{...}
 */
export const isYoutubeWatchPage = ((): boolean => {
    const isYoutube = window.location.hostname.indexOf('youtube') > -1;
    const isWatchPage = window.location.pathname.indexOf('watch') === 1;

    return isYoutube && isWatchPage;
})();
