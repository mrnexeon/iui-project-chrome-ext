import _ from 'lodash';
import React from 'react';

const storageKeys = {
    filterThreshold: 'filter-threshold',
};

/**
 * Persist filter threshold to chrome's local storage
 *
 * @param threshold
 */
const set = async (threshold: number): Promise<void> => {
    const data: { [key: string]: number } = {};
    data[storageKeys.filterThreshold] = threshold;

    return chrome.storage.local.set(data);
};

/**
 * Gets filter threshold from chrome's local storage.
 *
 * @returns filterThreshold - defaults to .7
 */
const get = async (): Promise<number> => {
    const storageObj = await chrome.storage.local.get(
        storageKeys.filterThreshold,
    );
    const filterThreshold = storageObj[storageKeys.filterThreshold];

    return _.isNumber(filterThreshold) ? filterThreshold : 0.7;
};

/**
 * Hook which has filter threshold and persists it on set
 *
 * @returns [filterThreshold, setFilterThreshold]
 */
const useValue = (): [number, (v: number) => void] => {
    const [_val, _setVal] = React.useState(0.7);

    React.useEffect(() => {
        filterThreshold.get().then(_setVal);
    }, []);

    const setVal = React.useCallback(async (v: number) => {
        await filterThreshold.set(v);
        _setVal(v);
    }, []);

    return [_val, setVal];
};

/**
 * EventListener that reacts on changes to filterThreshold
 *
 * @param callback
 */
const onChange = (callback: () => void): void => {
    const internalCallback = (changes: {
        [name: string]: chrome.storage.StorageChange;
    }): void => {
        if (!_.isUndefined(changes[storageKeys.filterThreshold])) {
            callback();
        }
    };

    chrome.storage.local.onChanged.addListener(
        internalCallback.bind(filterThreshold),
    );
};

export const filterThreshold = {
    set: set,
    get: get,
    useValue: useValue,
    onChange: onChange,
};
