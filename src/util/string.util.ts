const normalize = (str: string): string => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
};

const compareIgnoreDiacritics = (e1: string, e2: string): number => {
    return e1.localeCompare(e2, undefined, { sensitivity: 'base' });
};

export const stringUtil = {
    normalize: normalize,
    compareIgnoreDiacritics: compareIgnoreDiacritics,
};
