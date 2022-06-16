const MutationObserver = window.MutationObserver;

/**
 * Register new MutationObserver on DOM Node
 * Calls callback when DOM Node and children change
 *
 * @param observedNode DOM Node to observe
 * @param callback Gets called when DOM changes
 * @returns
 */
export const observeDOM = (
    observedNode: HTMLElement,
    callback: () => void,
): MutationObserver | null => {
    if (!observedNode || observedNode.nodeType !== 1) return null;

    if (MutationObserver) {
        const mutationObserver = new MutationObserver(callback);

        mutationObserver.observe(observedNode, {
            childList: true,
            subtree: true,
        });

        return mutationObserver;
    }

    // Fallback for old browsers
    observedNode.addEventListener('DOMNodeInserted', callback, false);
    observedNode.addEventListener('DOMNodeRemoved', callback, false);

    return null;
};
