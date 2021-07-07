export default class Dispatcher {

    constructor() {
        this._callbacks = {};
        this._lastID = 1;
    };

    register(callback) {
        const id = this._lastID++;
        this._callbacks[id] = callback;
        return id;
    };

    unregister(id) {
        delete this._callbacks[id];
    }

    dispatch(payload) {
        for (let cb in this._callbacks) {
            this._callbacks[cb](payload);
        }
    }

    handleViewAction(action) {
        this.dispatch({
            action: action
        })
    }
}

