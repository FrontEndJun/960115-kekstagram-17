'use strict';
(function () {
  var timer;
  var pics = [];
  var template = document.querySelector('#picture').content;
  var fragment = document.createDocumentFragment();
  var picturesBlock = document.querySelector('.pictures');
  var imgFilters = document.querySelector('.img-filters');

  var filterForm = document.querySelector('.img-filters__form');
  var filterPopular = filterForm.querySelector('#filter-popular');
  var filterNew = filterForm.querySelector('#filter-new');
  var filterDisc = filterForm.querySelector('#filter-discussed');

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
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      renderGallery(pics);
    }, 500);
  };

  var onNewClickHandler = function () {
    var filtered = pics.slice().sort(function () {
      return Math.random() - 0.5;
    }).slice(0, 10);
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      renderGallery(filtered);
    }, 500);
  };

  var onDiscClickHandler = function () {
    var filtered = pics.slice();
    filtered.sort(function (a, b) {
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
      renderGallery(filtered);
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

  window.getAjax('GET', 'https://js.dump.academy/kekstagram/data', function (data) {
    pics = data;
    renderGallery(pics);
    imgFilters.classList.remove('img-filters--inactive');
  });

})();
