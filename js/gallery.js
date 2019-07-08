'use strict';
(function () {
  var timer;
  var picsData = [];
  var currentData = [];
  var template = document.querySelector('#picture').content;
  var fragment = document.createDocumentFragment();
  var picturesBlock = document.querySelector('.pictures');
  var imgFilters = document.querySelector('.img-filters');

  var filterForm = document.querySelector('.img-filters__form');
  var filterPopular = filterForm.querySelector('#filter-popular');
  var filterNew = filterForm.querySelector('#filter-new');
  var filterDisc = filterForm.querySelector('#filter-discussed');
  var bigPic = document.querySelector('.big-picture');

  var renderGallery = function (p) {
    clearGallery();
    for (var i = 0; i < p.length; i++) {
      createFragmentItem(p[i]);
    }
    picturesBlock.appendChild(fragment);
  };

  var clearGallery = function () {
    var pictures = picturesBlock.querySelectorAll('a.picture');
    for (var i = 0; i < pictures.length; i++) {
      pictures[i].parentNode.removeChild(pictures[i]);
    }
  };

  var onPopularClickHandler = function () {
    currentData = picsData;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      renderGallery(currentData);
    }, 500);
  };

  var onNewClickHandler = function () {
    currentData = picsData.slice().sort(function () {
      return Math.random() - 0.5;
    }).slice(0, 10);
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      renderGallery(currentData);
    }, 500);
  };

  var onDiscClickHandler = function () {
    currentData = picsData.slice();
    currentData.sort(function (a, b) {
      if (a.comments.length > b.comments.length) {
        return -1;
      }
      if (a.comments.length < b.comments.length) {
        return 1;
      }
      return 0;
    });
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      renderGallery(currentData);
    }, 500);
  };

  filterPopular.addEventListener('click', onPopularClickHandler);
  filterNew.addEventListener('click', onNewClickHandler);
  filterDisc.addEventListener('click', onDiscClickHandler);

  filterForm.addEventListener('click', function (e) {
    var target = e.target;
    if (!target.classList.contains('img-filters__button')) {
      return;
    }
    for (var i = 0; i < filterForm.length; i++) {
      filterForm[i].classList.remove('img-filters__button--active');
    }
    target.classList.add('img-filters__button--active');
  });


  var createFragmentItem = function (item) {
    var photoDescr = item;
    var templateItem = template.cloneNode(true);
    templateItem.querySelector('.picture__img').src = photoDescr.url;
    templateItem.querySelector('.picture__comments').textContent = photoDescr.comments.length;
    templateItem.querySelector('.picture__likes').textContent = photoDescr.likes;
    fragment.appendChild(templateItem);
  };

  var commentInner = document.createElement('li');
  commentInner.classList.add('social__comment');
  var commentImg = document.createElement('img');
  commentImg.classList.add('social__picture');
  commentImg.alt = 'Аватар комментатора фотографии';
  commentImg.width = '35';
  commentImg.height = '35';
  var commentText = document.createElement('p');
  commentText.classList.add('social__text');
  commentInner.appendChild(commentImg);
  commentInner.appendChild(commentText);
  var showBigPicture = function (pic) {
    bigPic.querySelector('.social__comment-count').classList.add('hidden');
    bigPic.querySelector('.comments-loader').classList.add('hidden');
    bigPic.classList.remove('hidden');
    bigPic.querySelector('.big-picture__img img').src = pic.url;
    bigPic.querySelector('.likes-count').textContent = pic.likes;
    bigPic.querySelector('.comments-count').textContent = pic.comments.length;
    bigPic.querySelector('.social__caption').textContent = pic.description;
    pic.comments.forEach(function (comm) {
      var c = commentInner.cloneNode(true);
      c.querySelector('img').src = comm.avatar;
      c.querySelector('p').innerHTML = comm.message;

      // comments.appendChild(commentInner);
      bigPic.querySelector('.social__comments').appendChild(c);
    });
  };

  var closeBigPicture = function () {
    bigPic.classList.add('hidden');
    document.removeEventListener('keydown', onBigPictureEscPress);
  };

  var onBigPictureEscPress = function (e) {
    if (e.keyCode === 27) {
      closeBigPicture();
    }
  };
  window.getAjax('GET', 'https://js.dump.academy/kekstagram/data', function (data) {
    picsData = data;
    currentData = data;
    renderGallery(data);
    imgFilters.classList.remove('img-filters--inactive');
    picturesBlock.addEventListener('click', function (e) {
      var closeBigPictureButton = bigPic.querySelector('#picture-cancel');
      var pictures = picturesBlock.querySelectorAll('.picture');
      closeBigPictureButton.addEventListener('click', closeBigPicture);
      document.addEventListener('keydown', onBigPictureEscPress);

      var tg = e.target;
      pictures.forEach(function (elm, i) {
        while (tg !== picturesBlock) {
          if (tg === elm) {
            showBigPicture(currentData[i]);
          }
          tg = tg.parentNode;
        }
        tg = e.target;
      });
    });
  });

})();
