'use strict';
(function () {
  var descriptions = [];
  var userComments = ['Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
  var userNames = ['Емельян',
    'Ростислав',
    'Ерофей',
    'Всеволод',
    'Валентин',
    'Мартын',
    'Марк',
    'Олег',
    'Юрий',
    'Архип',
    'Лариса',
    'Анфиса',
    'Мария',
    'Ираида',
    'Эвелина',
    'Ника'
  ];

  window.createRandomImgsData = function (n) {
    for (var i = 1; i <= n; i++) {
      var obj = {
        url: 'photos/' + i + '.jpg',
        likes: window.utils.getRandomInt(15, 200),
        comments: getMockComments()
      };
      descriptions.push(obj);
    }
    return descriptions;
  };

  var getMockComments = function () {
    var arr = [];
    var commentsAmount = window.utils.getRandomInt(0, 4);
    for (var j = 0; j < commentsAmount; j++) {
      var o = {
        avatar: 'img/avatar-' + window.utils.getRandomInt(1, 6) + '.svg',
        message: userComments[window.utils.getRandomInt(0, userComments.length - 1)],
        name: userNames[window.utils.getRandomInt(0, userNames.length - 1)]
      };
      arr.push(o);
    }
    return arr;
  };
})();

