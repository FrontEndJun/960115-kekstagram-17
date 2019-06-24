'use strict';
(function () {
  var template = document.querySelector('#picture').content;
  var fragment = document.createDocumentFragment();
  var picturesBlock = document.querySelector('.pictures');

  var createFragmentItem = function (item) {
    var photoDescr = item;
    var templateItem = template.cloneNode(true);
    templateItem.querySelector('.picture__img').src = photoDescr.url;
    templateItem.querySelector('.picture__comments').textContent = photoDescr.comments.length;
    templateItem.querySelector('.picture__likes').textContent = photoDescr.likes;
    fragment.appendChild(templateItem);
  };
  var desc = window.createRandomImgsData(25);
  for (var i = 0; i < desc.length; i++) {
    createFragmentItem(desc[i]);
  }
  picturesBlock.appendChild(fragment);
})();
