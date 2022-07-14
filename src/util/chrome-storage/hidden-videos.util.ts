import _ from 'lodash';
import React from 'react';

const storageKeys = {
    hiddenVideos: 'hidden-videos',
};

/**
 * Sets the hiddenVideos Array in localStorage
 *
 * @param hiddenVideos
 * @returns
 */
const set = async (hiddenVideos: string[]): Promise<void> => {
    const data: { [key: string]: string[] } = {};
    data[storageKeys.hiddenVideos] = hiddenVideos;

    return chrome.storage.local.set(data);
};

/**
 * Gets the hiddenVideos from localStorage
 *
 * @returns hidden videos
 */
const get = async (): Promise<string[]> => {
    const storageObj = await chrome.storage.local.get(storageKeys.hiddenVideos);
    const hiddenVideos = storageObj[storageKeys.hiddenVideos] as
        | string[]
        | undefined;

    return _.isUndefined(hiddenVideos) ? [] : hiddenVideos;
};

/**
 * Pushes an id to the hidden videos in local storage
 *
 * @param id
 */
const push = async (id: string): Promise<void> => {
    const ids = await get();
    ids.push(id);
    set(ids);
};

/**
 * Hook to use the hiddenVideos' value
 *
 * @returns hiddenVideos
 */
const useValue = (): string[] => {
    const [_val, _setVal] = React.useState<string[]>([]);

    React.useEffect(() => {
        get().then(_setVal);
    }, []);

    const callback = (changes: {
        [name: string]: chrome.storage.StorageChange;
    }): void => {
        if (!_.isUndefined(changes[storageKeys.hiddenVideos])) {
            get().then(_setVal);
        }
    };

    chrome.storage.local.onChanged.addListener(callback.bind(hiddenVideos));

    return _val;
};

/**
 * EventListener that reacts on changes to isFilterEnabled
 *
 * @param callback
 */
const onChange = (callback: () => void): void => {
    const internalCallback = (changes: {
        [name: string]: chrome.storage.StorageChange;
    }): void => {
        if (!_.isUndefined(changes[storageKeys.hiddenVideos])) {
            callback();
        }
    };

    chrome.storage.local.onChanged.addListener(
        internalCallback.bind(hiddenVideos),
    );
};

/**
 * Clears the hidden videos
 */
const clear = (): void => {
    chrome.storage.local.remove(storageKeys.hiddenVideos);
};

export const hiddenVideos = {
    set: set,
    get: get,
    push: push,
    useValue: useValue,
    onChange: onChange,
    clear: clear,
};
