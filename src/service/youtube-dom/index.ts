import { player } from './player.service';
import { recommendations } from './recommendations.service';

export const youtubeDom = {
    recommendations: recommendations,
    cache: {
        hiddenIds: new Set<string>()
    },
    player: player,
};
