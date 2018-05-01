export default class Model {
    constructor() {
        this.attrs = {};
    }

    set(key, value) {
        this.attrs[key] = value;
    }

    get(key, defaultValue){
        return this.attrs[key] || defaultValue;
    }
}