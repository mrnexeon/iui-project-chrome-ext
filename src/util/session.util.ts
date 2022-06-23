import { guid } from './guid.util';

const sessionGuid = guid();

export const getSessionGuid = (): string => {
    return sessionGuid;
};
