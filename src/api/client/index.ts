import { Api, HttpResponse } from './client';

const client = new Api();

export function postFeedback(video_id: string, distractful: boolean) : Promise<HttpResponse<void, any>> {
    return client.api.feedbackCreate({ video_id, distractful })
}

export function filterVideos(videoIds: string[]) : Promise<HttpResponse<{distractful_ids: string[] }, string>> {
    return client.api.filterDistractfulVideosCreate({ recommended_ids: videoIds });
}