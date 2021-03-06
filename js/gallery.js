'use strict';

(function () {
  var timer;
  var picsData = [];
  var template = document.querySelector('#picture').content;
  var fragment = document.createDocumentFragment();
  var picturesBlock = document.querySelector('.pictures');
  var imgFilters = document.querySelector('.img-filters');

  var filterForm = document.querySelector('.img-filters__form');
  var filterPopular = filterForm.querySelector('#filter-popular');
  var filterNew = filterForm.querySelector('#filter-new');
  var filterDisc = filterForm.querySelector('#filter-discussed');
  var BigPictureModal = function () {
    window.Modal.apply(this, arguments);
  };
  BigPictureModal.prototype = Object.create(window.Modal.prototype);
  BigPictureModal.prototype.showComments = function (comments) {
    var self = this;
    var counter = 0;
    do {
      var comment = comments.pop();
      var c = commentInner.cloneNode(true);

      c.querySelector('img').alt = comment.name;
      c.querySelector('img').src = comment.avatar;
      c.querySelector('p').innerHTML = comment.message;
      self.modalOverlay.querySelector('.social__comments').appendChild(c);
      if (!comments[0]) {
        this.modalOverlay.querySelector('.comments-loader').classList.add('hidden');
        this.modalOverlay.querySelector('.comments-loader').onclick = null;
      }
    } while (++counter < 5 && comments[0]);
  };
  BigPictureModal.prototype.render = function (pic) {
    var self = this;
    var comments = this.modalOverlay.querySelector('.social__comments');
    var commentsList = pic.comments.slice().reverse();
    while (comments.firstChild) {
      comments.removeChild(comments.firstChild);
    }
    this.modalOverlay.querySelector('.comments-loader').classList.remove('hidden');
    // this.modalOverlay.querySelector('.social__comment-count').classList.add('hidden');
    this.modalOverlay.querySelector('.big-picture__img img').src = pic.url;
    this.modalOverlay.querySelector('.likes-count').textContent = pic.likes;
    this.modalOverlay.querySelector('.comments-count').textContent = pic.comments.length;
    this.modalOverlay.querySelector('.social__caption').textContent = pic.description;
    this.showComments(commentsList);
    this.modalOverlay.querySelector('.comments-loader').onclick = function () {
      self.showComments(commentsList);
    };
    this.show();
  };
  var bigPhoto = new BigPictureModal({overlaySelector: '.big-picture', closeButtonSelector: '#picture-cancel'});

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
      renderGallery(picsData.slice());
    }, 500);
  };

  var onNewClickHandler = function () {
    var sortedData = picsData.slice().sort(function () {
      return Math.random() - 0.5;
    }).slice(0, 10);
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      renderGallery(sortedData);
    }, 500);
  };

  var onDiscClickHandler = function () {
    var sortedData = picsData.slice().sort(function (a, b) {
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
      renderGallery(sortedData);
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
  var findPic = function (arr, source) {
    return arr.find(function (picture) {
      return picture.url === source;
    });
  };

  window.getAjax('https://js.dump.academy/kekstagram/data', function (data) {
    picsData = data;
    renderGallery(data);
    imgFilters.classList.remove('img-filters--inactive');
    picturesBlock.addEventListener('click', function (e) {
      var pictures = picturesBlock.querySelectorAll('.picture');

      // document.addEventListener('keydown', onBigPictureEscPress);
      var tg = e.target;
      pictures.forEach(function (elm) {
        while (tg !== picturesBlock) {
          if (tg === elm) {
            var picSource = elm.querySelector('img').getAttribute('src');
            var picture = findPic(picsData, picSource);
            bigPhoto.render(picture);
          }
          tg = tg.parentNode;
        }
        tg = e.target;
      });
    });
  });

})();
