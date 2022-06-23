import _ from 'lodash';
import {
    IFilterHistoryEntry,
    IFilterHistoryEntryVideo,
} from '../../model/chrome-storage/stats.model';
import { Mutex } from '../mutex.util';
import { sessionId } from '../session.util';
import { isYoutubeWatchPage } from '../url-check.util';

const storageKeys = {
    filterStats: 'filter-history',
};
const filterStatsMutex = new Mutex('filter-stats-mutex');

export const filterHistory = {
    /**
     * Appends a new historyEntry to the locally saved filterHistory
     *
     * @param historyEntry
     */
    save: async (historyEntry: IFilterHistoryEntry): Promise<void> => {
        // Get currentHistory without historyEntry's predecessor
        const currentHistory = (await filterHistory.get()).filter(
            (h) =>
                h.sessionId !== historyEntry.sessionId ||
                h.sourceVideoId !== historyEntry.sourceVideoId,
        );
        currentHistory.push(historyEntry);

        const data: { [key: string]: IFilterHistoryEntry[] } = {};
        data[storageKeys.filterStats] = currentHistory;

        await chrome.storage.local.set(data);
    },

    /**
     * Gets the filterHistory from local storage
     *
     * @returns The whole filterHistory
     */
    get: async (): Promise<IFilterHistoryEntry[]> => {
        const storageObj = await chrome.storage.local.get(
            storageKeys.filterStats,
        );
        const filterHistory = storageObj[storageKeys.filterStats];

        return _.isUndefined(filterHistory) ? [] : filterHistory;
    },

    /**
     * Creates a new historyEntry or updates the existing Entry for the
     * video that is currently playing
     * NOTE: A new Entry is created after each reload, navigate etc.
     *
     * @param hiddenVideos
     */
    saveForCurrentVideo: async (
        hiddenVideos: IFilterHistoryEntryVideo[],
    ): Promise<void> => {
        if (hiddenVideos.length === 0 || !isYoutubeWatchPage) {
            return;
        }

        await filterStatsMutex.acquire();
        ////////// SYNCHRONIZED //////////

        // Video Id
        const searchParams = new URLSearchParams(window.location.search);
        const videoId = searchParams.get('v') ?? '';

        const currentHistory = await filterHistory.get();
        const currentHistoryEntry: IFilterHistoryEntry | undefined =
            currentHistory.filter(
                (h) => h.sessionId === sessionId && h.sourceVideoId === videoId,
            )[0];

        // Use existing historyEntry or create a new one
        const newHistoryEntry: IFilterHistoryEntry = _.isUndefined(
            currentHistoryEntry,
        )
            ? {
                  sessionId: sessionId,
                  utcDate: new Date().toISOString(),
                  sourceVideoId: videoId,
                  filteredVideos: [],
              }
            : currentHistoryEntry;
        newHistoryEntry.filteredVideos.push(...hiddenVideos);

        await filterHistory.save(newHistoryEntry);

        ////////// END SYNCHRONIZED //////////
        filterStatsMutex.release();
    },
};
