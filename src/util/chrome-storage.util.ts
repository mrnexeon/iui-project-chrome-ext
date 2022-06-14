import _ from 'lodash';
import React from 'react';

const storageKeys = {
    isFilterEnabled: 'is-filter-enabled',
};

const isFilterEnabled = {
    /**
     * Persist isFilterEnabled to chrome's local storage
     *
     * @param enabled isFilterEnabled
     */
    set: async (enabled: boolean): Promise<void> => {
        const data: { [key: string]: boolean } = {};
        data[storageKeys.isFilterEnabled] = enabled;

        return chrome.storage.local.set(data);
    },

    /**
     * Gets isFilterEnabled from chrome's local storage.
     *
     * @returns isFilterEnabled or false if isFilterEnabled was not saved
     */
    get: async (): Promise<boolean> => {
        const storageObj = await chrome.storage.local.get(
            storageKeys.isFilterEnabled,
        );
        const isEnabled = storageObj[storageKeys.isFilterEnabled];

        return _.isBoolean(isEnabled) ? isEnabled : false;
    },

    /**
     * Hook which has isFilterEnabledValue and persists it
     *
     * @returns [isFilterEnabled, setIsFilterEnabled]
     */
    useValue: (): [boolean, (v: boolean) => void] => {
        const [_val, _setVal] = React.useState(false);

        React.useEffect(() => {
            isFilterEnabled.get().then(_setVal);
        }, []);

        const setVal = React.useCallback(async (v: boolean) => {
            await isFilterEnabled.set(v);
            _setVal(v);
        }, []);

        return [_val, setVal];
    },

    onChange: (callback: () => void): void => {
        const internalCallback = (changes: {
            [name: string]: chrome.storage.StorageChange;
        }): void => {
            if (!_.isUndefined(changes[storageKeys.isFilterEnabled])) {
                callback();
            }
        };

        chrome.storage.local.onChanged.addListener(
            internalCallback.bind(chromeStorage.isFilterEnabled),
        );
    },
};

export const chromeStorage = {
    isFilterEnabled: isFilterEnabled,
};
