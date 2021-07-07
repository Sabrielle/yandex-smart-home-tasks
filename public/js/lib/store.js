import Event from './event.js';

export default class Store extends Event {

    constructor(data) {
        super();
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }
    }

    emit(event) {
        this.trigger(event);
    }

    watch(event, callback) {
        this.bind(event, callback);
    }

    remove(event, callback) {
        this.unbind(event, callback);
    }

};