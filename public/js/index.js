import Dispatcher from './lib/dispatcher.js';
import Store from './lib/store.js';

const appDispatcher = new Dispatcher();

const appStore = new Store({
    current: ''
});

var actions = {
    get: (name) => {
        appStore.current = name;
        appDispatcher.handleViewAction({
            actionType: 'GET_PAGE',
            name: name
        })
    }
}

appDispatcher.register(function(payload) {
    const action = payload.action;
    switch(action.actionType) {
        case 'GET_PAGE':
            appStore.emit('update');
            break;
        default:
            return true;
    }
});

const app = {

    _get: function (page) {
        actions.get(page);
    },

    _clickHandler: function(event) {
        event.preventDefault();
        const id = event.target.id;
        if(appStore.current === id) {
            return;
        } else {
            app._get(id);
            localStorage.setItem('page', id);
        }
    },

    _render: function () {
        const body = document.querySelector('main');
        fetch(`/${appStore.current}`)
            .then(function(response) {
                return response.text()
            })
            .then(function(html) {
                body.innerHTML = html;
                init();
            })
            .catch(alert);
    },

    init: function () {
        appStore.watch('update', this._render);
        if(!localStorage.getItem('page')) {
            localStorage.setItem('page', 'main');
            this._get('main');
        } else {
            this._get(localStorage.getItem('page'));
        }
        const main = document.getElementById('main');
        const video = document.getElementById('video');
        main.onclick = this._clickHandler;
        video.onclick = this._clickHandler;
    }
}

window.onload = app.init();