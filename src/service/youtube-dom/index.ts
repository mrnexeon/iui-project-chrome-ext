import { currentVideo } from './current-video.service';
import { player } from './player.service';
import { recommendations } from './recommendations.service';
import { ui } from './ui.service';

export const youtubeDom = {
    recommendations: recommendations,
    player: player,
    currentVideo: currentVideo,
    ui: ui,
};
