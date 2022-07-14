import { Api } from './client';

const baseUrl = 'http://youlearn.thiers.ch';
const client = new Api({ baseUrl: baseUrl });

/**
 * Reports a feedback about the filtered video to REST API server
 *
 * @param video_id YouTube video ID
 * @param distractful true if the video is indeed distractful, false if the video should not be filtered out
 * @returns true if the report has been recieved by the server
 */
export function reportFeedback(
    video_id: string,
    distractful: boolean,
): Promise<boolean> {
    return new Promise((resolve, reject) => {
        client.api
            .feedbackCreate({ video_id, distractful })
            .then((res) => resolve(res.status === 200))
            .catch((err) => reject(err));
    });
}

/**
 * Requests REST API server to filter distractful videos from the video list
 *
 * @param recommended_video_ids videos IDs recommmended by the YouTube
 * @returns distractful videos IDs
 */
export function filterDistractfulVideos(
    recommended_video_ids: string[],
): Promise<string[]> {
    return new Promise((resolve, reject) => {
        client.api
            .filterDistractfulVideosCreate({
                recommended_ids: recommended_video_ids,
            })
            .then((res) => res.json())
            .catch((err) => reject(err))
            .then((json) => resolve(json.distractful_ids))
            .catch((err) => reject(err));
    });
}

export async function filterAndSortDistractfulVideos(
    recommendedIds: string[],
    filterThreshold: number,
): Promise<string[]> {
    const body = {
        recommended_ids: recommendedIds,
        filter_threshold: filterThreshold,
    };

    const rawResponse = await fetch(
        `${baseUrl}/api/filterAndSortDistractfulVideos`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        },
    );

    const response = await rawResponse.json();

    return response.recommended_and_sorted_ids;
}
