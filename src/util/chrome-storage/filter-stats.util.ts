import _ from 'lodash';
import { IFilterStats } from '../../model/chrome-storage/stats.model';
import { getSessionGuid } from '../session.util';

const storageKeys = {
    filterStats: 'filter-stats',
};

export const filterStats = {
    save: async (stat: IFilterStats): Promise<void> => {
        console.log('Save', stat);
        const currentStats = (await filterStats.get()).filter(
            (s) =>
                s.sessionId !== stat.sessionId &&
                s.sourceVideoId !== stat.sourceVideoId,
        );
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
        const v = searchParams.get('v') ?? '';

        const sessionId = getSessionGuid();
        const currentStats = await filterStats.get();
        const currentStat = currentStats.filter(
            (s) => s.sessionId === sessionId && s.sourceVideoId === v,
        )[0];

        const newStats: IFilterStats = _.isUndefined(currentStat)
            ? {
                  sessionId: sessionId,
                  utcDate: new Date().toUTCString(),
                  sourceVideoId: v,
                  filteredVideos: hiddenVideos,
              }
            : {
                  ...currentStat,
                  filteredVideos: [
                      ...currentStat.filteredVideos,
                      ...hiddenVideos,
                  ],
              };

        filterStats.save(newStats);

        /* 
			TODO
			Identify a session
			Important note: The hide function runs not just once, but the stats should be saved together

		*/
    },
};
