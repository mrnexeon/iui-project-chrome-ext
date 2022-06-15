import _ from 'lodash';

/**
 * Gets timestamp of current playing video in s
 *
 * @returns
 */
const getTimestamp = (): number => {
    const player = document.querySelector('video');

    if (_.isNull(player) || _.isNull(player.currentTime)) {
        return 0;
    }

    return player.currentTime;
};

export const player = {
    getTimestamp: getTimestamp,
};
