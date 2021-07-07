## Запуск сервера
```
npm i
npm run dev
```
Доступен по адресу  [localhost:8000](localhost:8000)

Для запуска видео необходимо сделать следующее:
```
$ git clone https://github.com/mad-gooze/shri-2018-2-multimedia-homework.git
$ cd shri-2018-2-multimedia-homework
$ npm i
$ npm start
```

## Задание 10 "Архитектура"

Файлы фреймворка находятся в `public\js\lib`

Обновление состояний происходит через экземпляр `Store`. 

```js
const appStore = new Store();
appStore.watch('update', this._render); //подписка на определённое событие
appStore.emit('update'); //генерация события
appStore.remove('update', this._render); //удаление подписки
```

Диспетчер

```js
const appDispatcher = new Dispatcher(); 
appDispatcher.register(function(payload) { // регистрируем события и обработчики
    const action = payload.action;
    switch(action.actionType) {
        case 'foo':
            // ... 
            break;
    }
});
appDispatcher.handleViewAction({actionType: 'foo', foo: foo}) // реакция диспетчера на события с вьюхи
```

Интерактивность была реализована для вкладок "События" и "Видеонаблюдение". Переключение осуществляется при помощи фреймворка, при переключении с сервера запрашивается необходимая часть страницы. Умеет запоминать выбор страницы с помощью localStorage.

## Задание 3 "Мультимедиа"

Страница с видео [http://localhost:8000/broadcast](http://localhost:8000/broadcast)

Видео при клике открывается во всплывающем окне, сверху доступны фильтры и кнопка "Все камеры", которая закрывает окно.

Уровень громкости отображается в левом нижнем углу в виде столбика жёлтого цвета, если в видео есть звук.

Отлаживалось на Andriod в Chrome Dev.

## Задание 4 "Node.js"

Код обработчиков находится в `controllers\apiController.js`

Принимает как GET, так и POST запросы на `api/events`

Реализована пагинация с указанием текущей страницы `page` и количества записей на страницу `limit`

 ###### Примеры линков
 
- [http://localhost:8000/status](http://localhost:8000/status) - время, прошедшее с запуска сервера
- [http://localhost:8000/api/events](http://localhost:8000/api/events)
- [http://localhost:8000/api/events?type=info:aaa](http://localhost:8000/api/events?type=info:aaa) - 400 incorrect type
- [http://localhost:8000/api/events?type=info&page=1&limit=bbb](http://localhost:8000/api/events?type=info&page=1&limit=bbb) - 400 incorrect number of page or limit
- [http://localhost:8000/api/events?type=info:critical&page=3&limit=5](http://localhost:8000/api/events?type=info:critical&page=3&limit=5)
- [http://localhost:8000/api/events?type=critical&page=3&limit=5](http://localhost:8000/api/events?type=critical&page=3&limit=5)- 400 page number is too big

## Задание 7 "TypeScript" - миграция api/events и /status

Сборка:
`npm run build`
Запуск:
`npm run type` 
