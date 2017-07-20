const path = require('path');

exports.up = function(knex, Promise) {
  let initialTweets = [
    {
      id: 1,
      message: 'советую заглянуть на #telegram-канал',
      image: 'public/upload/image_1.png',
      user_id: 1
    },
    {
      id: 2,
      message: 'Первая часть статьи об #ICO',
      image: 'public/upload/image_2.png',
      user_id: 2
    },
    {
      id: 3,
      message: 'Взаимная подписка, друзья! Поможем друг другу! ',
      image: null,
      user_id: 3
    },
    {
      id: 4,
      message: 'Боты в Telegram (урок)',
      image: null,
      user_id: 4
    },
    {
      id: 5,
      message: '1 или 2?',
      image: 'public/upload/image_3.png',
      user_id: 5
    },
    {
      id: 6,
      message: 'Тест на бота не пройден :)',
      image: null,
      user_id: 2
    },
    {
      id: 7,
      message: 'хочу чтобы люди были счастливы',
      image: null,
      user_id: 2
    },
    {
      id: 8,
      message: 'Shellac представляет собой гениальное слияние лака и геля.',
      image: null,
      user_id: 1
    },
    {
      id: 9,
      message: 'God is Love',
      image: null,
      user_id: 1
    },
    {
      id: 10,
      message: 'Вступайте на telegram-канал нашего портала',
      image: null,
      user_id: 4
    }
  ];
  if (process.env.NODE_ENV === 'testing') {
    initialTweets.push({
      id: 11,
      message: 'Все, что происходило на первой игре сезона УПЛ #ВорсклаШахтер',
      image: 'public/upload/image_4.png',
      user_id: 1
    });
    initialTweets.push({
      id: 12,
      message: 'чТО делАть каК быТЬ????',
      image: null,
      user_id: 2
    });
    initialTweets.push({
      id: 13,
      message: 'Подскажите: какую нормальную мобилу можно купить за 100 баксов ???',
      image: 'public/upload/image_5.png',
      user_id: 3
    });
    initialTweets.push({
      id: 14,
      message: 'Telegram для macOS был обновлен до версии 3.1.1',
      image: 'public/upload/image_6.png',
      user_id: 4
    });
    initialTweets.push({
      id: 15,
      message: 'сколько понадобится времени, чтобы накачать пресс?',
      image: null,
      user_id: 5
    });
    initialTweets.push({
      id: 16,
      message: 'Изучив красноречие,можно перейти к любой науке?',
      image: 'public/upload/image_7.png',
      user_id: 1
    });
    initialTweets.push({
      id: 17,
      message: 'Насколько люди понимают друг друга?',
      image: 'public/upload/image_8.png',
      user_id: 2
    });
  }
  return knex.table('tweets').insert(initialTweets);
};

exports.down = function(knex, Promise) {
  return knex.table('tweets').del();
};
