export interface IFilterHistoryEntry {
    sessionId: string;
    utcDate: string;
    sourceVideoId: string;
    filteredVideos: IFilterHistoryEntryVideo[];
}

export interface IFilterHistoryEntryVideo {
    title: string;
    channelName: string;
    id: string;
}
