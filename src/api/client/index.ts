import { Api } from './client';

const client = new Api();

/**
 * Reports a feedback about the filtered video to REST API server
 * 
 * @param video_id YouTube video ID
 * @param distractful true if the video is indeed distractful, false if the video should not be filtered out
 * @returns true if the report has been recieved by the server
 */
export function reportFeedback(video_id: string, distractful: boolean): Promise<boolean> {
    return new Promise((resolve, reject) => {
        client.api.feedbackCreate({ video_id, distractful })
            .then(res => resolve(res.status === 200))
            .catch(err => reject(err))
    })
}

/**
 * Requests REST API server to filter educational videos from the video list
 * 
 * @param videoIds YouTube videos IDs list
 * @returns educational videos IDs for displaying which are *not* distractful
 */
export function filterEducationalVideos(videoIds: string[]): Promise<string[]> {
    return new Promise((resolve, reject) => {

        // NB! the Endpoint name in REST API spec is not correct from the meaning, 
        // the endpoint does not filters distractful, but filters educational videos

        client.api.filterDistractfulVideosCreate({ recommended_ids: videoIds })
            .then(res => res.json())
            .catch(err => reject(err))
            .then(json => resolve(json.distractful_ids))
            .catch(err => reject(err))
    })
}