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
  'Ника'];
var template = document.querySelector('#picture').content;
var fragment = document.createDocumentFragment();
var picturesBlock = document.querySelector('.pictures');

var createRandomImgs = function (n) {
  for (var i = 1; i <= n; i++) {
    var obj = {
      url: 'photos/' + i + '.jpg',
      likes: getRandomInt(15, 200),
      comments: getComments()
    };
    descriptions.push(obj);
  }
};

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var getComments = function () {
  var arr = [];
  var commentsAmount = getRandomInt(0, 4);
  for (var j = 0; j < commentsAmount; j++) {
    var o = {
      avatar: 'img/avatar-' + getRandomInt(1, 6) + '.svg',
      message: userComments[getRandomInt(0, userComments.length - 1)],
      name: userNames[getRandomInt(0, userNames.length - 1)]
    };
    arr.push(o);
  }
  return arr;
};

var createFragmentItem = function (item) {
  var photoDescr = item;
  var templateItem = template.cloneNode(true);
  templateItem.querySelector('.picture__img').src = photoDescr.url;
  templateItem.querySelector('.picture__comments').textContent = photoDescr.comments.length;
  templateItem.querySelector('.picture__likes').textContent = photoDescr.likes;
  fragment.appendChild(templateItem);
};

var showPictures = function () {
  createRandomImgs(25);
  for (var i = 0; i < descriptions.length; i++) {
    createFragmentItem(descriptions[i]);
  }
  picturesBlock.appendChild(fragment);
};

showPictures();
