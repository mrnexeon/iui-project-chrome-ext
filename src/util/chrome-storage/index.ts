import { filterStats } from './filter-stats.util';
import { isFilterEnabled } from './is-filter-enabled.util';

export const chromeStorage = {
    isFilterEnabled: isFilterEnabled,
    filterStats: filterStats,
};
