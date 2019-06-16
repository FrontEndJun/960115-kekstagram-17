'use strict';
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

var effectsList = {
  'chrome': {
    style: 'grayscale',
    min: 0,
    max: 1,
    units: ''
  },
  'sepia': {
    style: 'sepia',
    min: 0,
    max: 1,
    units: ''
  },
  'marvin': {
    style: 'invert',
    min: 0,
    max: 100,
    units: '%'
  },
  'phobos': {
    style: 'blur',
    min: 0,
    max: 3,
    units: 'px'
  },
  'heat': {
    style: 'brightness',
    min: 1,
    max: 3,
    units: ''
  },
};
var previewImg = document.querySelector('.img-upload__preview img');

var uploadFile = document.getElementById('upload-file');
var uploadPreview = document.querySelector('.img-upload__overlay');

var previewClose = document.getElementById('upload-cancel');
var scaleUp = document.querySelector('.scale__control--bigger');
var scaleDown = document.querySelector('.scale__control--smaller');

var scaleInput = document.querySelector('.scale__control--value');
var effectsRadio = document.querySelectorAll('.img-upload__effects input[type="radio"]');
var scaleVal = scaleInput.value.split('%')[0];

var effectLevel = document.querySelector('.img-upload__effect-level');
var effectValInput = document.querySelector('.effect-level__value');
// var effectVal = effectValInput.value;

var closeLoadPreview = function () {
  uploadPreview.classList.add('hidden');
  uploadFile.value = '';
  document.removeEventListener('keydown', onPreviewEscPress);
  resetEffects();
};
var onPreviewEscPress = function (e) {
  if (e.keyCode === 27) {
    closeLoadPreview();
  }
};

effectLevel.classList.add('hidden');

uploadFile.addEventListener('change', function () {
  uploadPreview.classList.remove('hidden');

  document.addEventListener('keydown', onPreviewEscPress);
});

previewClose.addEventListener('click', function () {
  closeLoadPreview();
});

scaleUp.addEventListener('click', function () {
  scaleVal = scaleVal + 25 > 100 ? 100 : scaleVal + 25;
  scalePreviewImage(scaleVal);
});

scaleDown.addEventListener('click', function () {
  scaleVal = scaleVal - 25 < 25 ? 25 : scaleVal - 25;
  scalePreviewImage(scaleVal);
});

var scalePreviewImage = function (val) {
  scaleInput.value = val + '%';
  previewImg.style.transform = 'scale(' + val / 100 + ')';
};

var renderPreviewImage = function (val) {
  previewImg.style.filter = currEffect.style + '(' + val + currEffect.units + ')';
};

var currEffect;// = effectsList['none'];
for (var i = 0; i < effectsRadio.length; i++) {
  effectsRadio[i].addEventListener('click', function (e) {
    var effectName = e.target.value;
    if (effectName === 'none') {
      effectLevel.classList.add('hidden');
    } else {
      effectLevel.classList.remove('hidden');
    }
    currEffect = effectsList[effectName];
    previewImg.className = 'effects__preview--' + effectName;
    previewImg.style = ' ';
    renderPreviewImage(currEffect.max);
    thumbElem.style.left = '100%';
    progressLine.style.width = '100%';
  });
}

var resetEffects = function () {
  previewImg.className = 'effects__preview--none';
  effectLevel.classList.add('hidden');
  scalePreviewImage(100);
};

var remap = function (n, start1, stop1, start2, stop2) {
  return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};

var sliderElem = document.querySelector('.effect-level__line');
var thumbElem = document.querySelector('.effect-level__pin');
var progressLine = document.querySelector('.effect-level__depth');

thumbElem.onmousedown = function(e) {
  var thumbCoords = getCoords(thumbElem);
  var shiftX = e.pageX - thumbCoords.left;
  var sliderCoords = getCoords(sliderElem);
  var rightEdge = sliderElem.offsetWidth;

  document.onmousemove = function (e) {
    var newLeft = e.pageX - shiftX - sliderCoords.left;
    if (newLeft < 0) {
      newLeft = 0;
    }

    if (newLeft > rightEdge) {
      newLeft = rightEdge;
    }
    thumbElem.style.left = newLeft + 'px';
    progressLine.style.width = newLeft + 'px';
    var val = remap(newLeft, 0, rightEdge, 0, 100);
    effectValInput.value = val;
    val = remap(newLeft, 0, rightEdge, currEffect.min, currEffect.max);
    renderPreviewImage(val);
  };

  document.onmouseup = function () {
    document.onmousemove = document.onmouseup = null;
  };

  return false; // disable selection start (cursor change)
};

thumbElem.ondragstart = function () {
  return false;
};


function getCoords(elem) { // кроме IE8-
  var box = elem.getBoundingClientRect();

  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
}

