import _ from 'lodash';
import { IFilterStats } from '../../model/chrome-storage/stats.model';

const storageKeys = {
    filterStats: 'filter-stats',
};

export const filterStats = {
    save: async (stat: IFilterStats): Promise<void> => {
        const currentStats = await filterStats.get();
        currentStats.push(stat);

        const data: { [key: string]: IFilterStats[] } = {};
        data[storageKeys.filterStats] = currentStats;

        await chrome.storage.sync.set(data);
    },

    get: async (): Promise<IFilterStats[]> => {
        const storageObj = await chrome.storage.local.get(
            storageKeys.filterStats,
        );
        const filterStats = storageObj[storageKeys.filterStats];

        return _.isUndefined(filterStats) ? [] : filterStats;
    },

    saveForCurrentVideo: async (hiddenVideos: string[]): Promise<void> => {
        const searchParams = new URLSearchParams(window.location.search);
        const v = searchParams.get('v');

        const stats: IFilterStats = {};

        /* 
			TODO
			Identify a session
			Important note: The hide function runs not just once, but the stats should be saved together

		*/
    },
};
