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

  window.getAjax('GET', 'https://js.dump.academy/kekstagram/data', function (data) {
    for (var i = 0; i < data.length; i++) {
      createFragmentItem(data[i]);
    }
    picturesBlock.appendChild(fragment);
  });

})();
