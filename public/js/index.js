import Dispatcher from './lib/dispatcher.js';
import Store from './lib/store.js';

const appDispatcher = new Dispatcher();

const appStore = new Store({
    _items: [1, 2, 3, 4]
});

var actions = {
    get: (text) => {
        appDispatcher.handleViewAction({
            actionType: 'GET_PAGE',
            text: text
        })
        console.log('actions -> handleViewAction', text)
    }
}

appDispatcher.register(function(payload) {
    const action = payload.action;

    switch(action.actionType) {
        case 'GET_PAGE':
            console.log("GET_PAGE ACTION!");
            break;
        default:
            return true;
    }
});

const app = {

    _get: function (text) {
        actions.get(text);
    },

    init: function () {
        this._get('my text');
        console.log(appStore);
    }
}

window.onload = app.init();