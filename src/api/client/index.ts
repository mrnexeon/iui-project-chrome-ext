import { Api, Feedback, HttpResponse } from './api';

const client = new Api();

export function postFeedback(video_id: string, distractful: boolean) : Promise<HttpResponse<void, any>> {
    let fb: Feedback = { video_id, distractful };
    return client.api.feedback(fb)
}

export function filterVideos(videoIds: string[]) : Promise<HttpResponse<string[], string>> {
    return client.api.filterVideos(videoIds);
}