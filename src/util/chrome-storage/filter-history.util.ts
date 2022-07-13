import _ from 'lodash';
import * as React from 'react';
import {
    IFilterHistoryEntry,
    IFilterHistoryEntryVideo,
} from '../../model/chrome-storage/stats.model';
import * as youtubeDom from '../../service/youtube-dom';
import { Mutex } from '../mutex.util';
import { sessionId } from '../session.util';
import { stringUtil } from '../string.util';
import { isYoutubeWatchPage } from '../url-check.util';

const storageKeys = {
    filterStats: 'filter-history',
};
const filterStatsMutex = new Mutex('filter-stats-mutex');

/**
 * Appends a new historyEntry to the locally saved filterHistory
 *
 * @param historyEntry
 */
const save = async (historyEntry: IFilterHistoryEntry): Promise<void> => {
    // Get currentHistory without historyEntry's predecessor
    const currentHistory = (await get()).filter(
        (h) =>
            h.sessionId !== historyEntry.sessionId ||
            h.sourceVideo.id !== historyEntry.sourceVideo.id,
    );
    currentHistory.push(historyEntry);

    const data: { [key: string]: IFilterHistoryEntry[] } = {};
    data[storageKeys.filterStats] = currentHistory;

    await chrome.storage.local.set(data);
};

/**
 * Gets the filterHistory from local storage
 *
 * @returns The whole filterHistory
 */
const get = async (): Promise<IFilterHistoryEntry[]> => {
    const storageObj = await chrome.storage.local.get(storageKeys.filterStats);
    const filterHistory = storageObj[storageKeys.filterStats];

    return _.isUndefined(filterHistory)
        ? []
        : filterHistory.sort(
              (e1: IFilterHistoryEntry, e2: IFilterHistoryEntry) =>
                  stringUtil.compareIgnoreDiacritics(e2.utcDate, e1.utcDate),
          );
};

/**
 * Creates a new historyEntry or updates the existing Entry for the
 * video that is currently playing
 * NOTE: A new Entry is created after each reload, navigate etc.
 *
 * @param hiddenVideos
 */
const saveForCurrentVideo = async (
    hiddenVideos: IFilterHistoryEntryVideo[],
): Promise<void> => {
    if (hiddenVideos.length === 0 || !isYoutubeWatchPage) {
        return;
    }

    await filterStatsMutex.acquire();
    ////////// SYNCHRONIZED //////////

    const currentVideo = youtubeDom.currentVideo.get();

    const currentHistory = await filterHistory.get();
    const currentHistoryEntry: IFilterHistoryEntry | undefined =
        currentHistory.filter(
            (h) =>
                h.sessionId === sessionId &&
                h.sourceVideo.id === currentVideo.id,
        )[0];

    // Use existing historyEntry or create a new one
    const newHistoryEntry: IFilterHistoryEntry = _.isUndefined(
        currentHistoryEntry,
    )
        ? {
              sessionId: sessionId,
              utcDate: new Date().toISOString(),
              sourceVideo: currentVideo,
              filteredVideos: [],
          }
        : currentHistoryEntry;
    newHistoryEntry.filteredVideos.push(...hiddenVideos);

    await save(newHistoryEntry);

    ////////// END SYNCHRONIZED //////////
    filterStatsMutex.release();
};

/**
 * Hook that provides the current filterStats and updates them onChange
 *
 * @returns IFilterHistoryEntry[]
 */
const useValue = (): IFilterHistoryEntry[] => {
    const [_val, _setVal] = React.useState<IFilterHistoryEntry[]>([]);

    React.useEffect(() => {
        get().then(_setVal);
    }, []);

    const callback = (changes: {
        [name: string]: chrome.storage.StorageChange;
    }): void => {
        if (!_.isUndefined(changes[storageKeys.filterStats])) {
            get().then(_setVal);
        }
    };

    chrome.storage.local.onChanged.addListener(callback.bind(filterHistory));

    return _val;
};

export const filterHistory = {
    save: save,
    get: get,
    saveForCurrentVideo: saveForCurrentVideo,
    useValue: useValue,
};
