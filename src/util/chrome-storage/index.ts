import { filterHistory } from './filter-history.util';
import { hiddenVideos } from './hidden-videos.util';
import { isFilterEnabled } from './is-filter-enabled.util';

export const chromeStorage = {
    isFilterEnabled: isFilterEnabled,
    filterHistory: filterHistory,
    hiddenVideos: hiddenVideos,
};
