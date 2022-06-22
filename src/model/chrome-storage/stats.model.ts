export interface IFilterStats {
    sourceVideoId: string;
    filterData: {
        wasFiltered: boolean;
        videoId: string;
    };
}
