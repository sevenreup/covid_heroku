import { createLocalStorage, LocalStoragePonyfill } from 'localstorage-ponyfill';

export default class Storage {
    local: LocalStoragePonyfill;

    constructor() {
        this.local = createLocalStorage();
    }

    public set(key: string, value: string) {
        this.local.setItem(key, value);
    }

    public get(key: string) {
        return this.local.getItem(key);
    }

    public check(key: string): boolean {
        if (this.get(key) === 'true') return true
        return false;
    }
}
