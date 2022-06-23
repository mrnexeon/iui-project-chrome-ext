import { filterHistory } from './filter-history.util';
import { isFilterEnabled } from './is-filter-enabled.util';

export const chromeStorage = {
    isFilterEnabled: isFilterEnabled,
    filterHistory: filterHistory,
};
