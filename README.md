## Запуск сервера
```
npm i
npm run dev
```
Доступен по адресу  [localhost:8000](localhost:8000)

## Для задания по типизации миграция на TypeScript api/events и /status

`npm run type` 

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
