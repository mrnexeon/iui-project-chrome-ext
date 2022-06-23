/**
 * Mutex class that can synchronize async functions
 */
export class Mutex {
    private _key: string;
    private _locked: boolean;
    private _eventTarget: EventTarget;
    public constructor(key: string) {
        this._key = `mutex-${key}`;
        this._locked = false;
        this._eventTarget = new EventTarget();
    }

    /**
     * Returns a Promise which resolves when the caller has quired and locked
     * the mutex. Await this Promise to synchronize your async function
     */
    public acquire = (): Promise<void> => {
        return new Promise<void>((resolve) => {
            if (!this._locked) {
                this._locked = true;
                return resolve();
            }
            const tryLock = () => {
                if (!this._locked) {
                    this._locked = true;
                    this._eventTarget.removeEventListener(this._key, tryLock);
                    return resolve();
                }
            };
            this._eventTarget.addEventListener(this._key, tryLock);
        });
    };

    /**
     * Releases the mutex
     */
    public release = (): void => {
        this._locked = false;
        Promise.resolve().then(() =>
            this._eventTarget.dispatchEvent(new Event(this._key)),
        );
    };
}
