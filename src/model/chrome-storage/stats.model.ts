export interface IFilterHistoryEntry {
    sessionId: string;
    utcDate: string;
    sourceVideo: IFilterHistoryEntryVideo;
    filteredVideos: IFilterHistoryEntryVideo[];
}

export interface IFilterHistoryEntryVideo {
    title: string;
    channelName: string;
    id: string;
}
