'use strict';
(function () {
  var effectsList = {
    'none': {
      style: ' ',
      min: 0,
      max: 0,
    },
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

  var uploadFile = document.querySelector('#upload-file');
  var uploadPreview = document.querySelector('.img-upload__overlay');

  var previewClose = document.querySelector('#upload-cancel');
  var scaleUp = document.querySelector('.scale__control--bigger');
  var scaleDown = document.querySelector('.scale__control--smaller');

  var scaleInput = document.querySelector('.scale__control--value');
  var effectsRadio = document.querySelectorAll('.img-upload__effects input[type="radio"]');
  var getScale = function () {
    return scaleInput.value.split('%')[0];
  };
  var effectLevel = document.querySelector('.img-upload__effect-level');

  var closeLoadPreview = function () {
    uploadPreview.classList.add('hidden');
    uploadFile.value = '';
    commentInput.value = '';
    hashtagsInput.value = '';

    // document.removeEventListener('keydown', onPreviewEscPress);
    resetEffects();
  };
  effectLevel.classList.add('hidden');

  uploadFile.addEventListener('change', function () {
    uploadPreview.classList.remove('hidden');

    window.popupOnEscClose(closeLoadPreview);
  });

  previewClose.addEventListener('click', function () {
    closeLoadPreview();
  });

  scaleUp.addEventListener('click', function () {
    var scaleVal = getScale();
    scaleVal = scaleVal + 25 > 100 ? 100 : scaleVal + 25;
    scalePreviewImage(scaleVal);
  });

  scaleDown.addEventListener('click', function () {
    var scaleVal = getScale();
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

  var effectValInput = document.querySelector('.effect-level__value');
  var sliderElem = document.querySelector('.effect-level__line');
  var thumbElem = document.querySelector('.effect-level__pin');
  var progressLine = document.querySelector('.effect-level__depth');
  var currEffect;
  for (var i = 0; i < effectsRadio.length; i++) {
    effectsRadio[i].addEventListener('click', function (e) {
      var effectName = e.target.value;
      if (effectName === 'none') {
        resetEffects();
      } else {
        effectLevel.classList.remove('hidden');
        thumbElem.style.left = '100%';
        progressLine.style.width = '100%';
      }
      currEffect = effectsList[effectName];
      renderPreviewImage(currEffect.max);
      previewImg.className = 'effects__preview--' + effectName;
      scalePreviewImage(100);
    });
  }

  var resetEffects = function () {
    previewImg.removeAttribute('style');
    previewImg.className = 'effects__preview--none';
    effectLevel.classList.add('hidden');
    scalePreviewImage(100);
  };

  thumbElem.onmousedown = function (e) {
    var thumbCoords = window.utils.getCoords(thumbElem);
    var shiftX = e.pageX - thumbCoords.left;
    var sliderCoords = window.utils.getCoords(sliderElem);
    var rightEdge = sliderElem.offsetWidth;

    document.onmousemove = function (evt) {
      var newLeft = evt.pageX - shiftX - sliderCoords.left;
      if (newLeft < 0) {
        newLeft = 0;
      }

      if (newLeft > rightEdge) {
        newLeft = rightEdge;
      }
      thumbElem.style.left = newLeft + 'px';
      progressLine.style.width = newLeft + 'px';
      var val = window.utils.remap(newLeft, 0, rightEdge, 0, 100);
      effectValInput.value = Math.round(val);
      val = window.utils.remap(newLeft, 0, rightEdge, currEffect.min, currEffect.max);
      renderPreviewImage(val);
    };

    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    };

    return false;
  };

  thumbElem.ondragstart = function () {
    return false;
  };

  var commentInput = document.querySelector('.text__description');

  var uploadForm = document.querySelector('.img-upload__form');

  commentInput.addEventListener('focus', function () {
    window.popupOnEscClose(function () {
    });
  });

  commentInput.addEventListener('blur', function () {
    window.popupOnEscClose(closeLoadPreview);
  });

  var showMessage = function (type) {
    var template = document.getElementById(type).content;
    var message = template.cloneNode(true);
    document.body.querySelector('main').appendChild(message);
    message = document.querySelector('.' + type);
    var closeButtons = message.querySelectorAll('.' + type + '__button');
    closeButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        message.remove();
      });
    });
    message.addEventListener('click', function (e) {
      var tg = e.target;
      if (tg.querySelector('.' + type + '__inner')) {
        message.remove();
      }
    });
    window.popupOnEscClose(function () {
      message.remove();
    });
  };

  var hashtagsInput = document.querySelector('.text__hashtags');

  hashtagsInput.addEventListener('focus', function () {
    window.popupOnEscClose(function () {
    });
  });
  hashtagsInput.addEventListener('blur', function () {
    window.popupOnEscClose(closeLoadPreview);
  });
  var validateHashtags = function () {
    var error = '';
    var hashtagsVal = hashtagsInput.value.trim();
    if (hashtagsVal.match(/(#[-\w]{1,19}\b)(\s)(\1|.+\1\b)/gi)) {
      error = 'Хэштеги не должны повторяться';
    }
    var hashtags = hashtagsVal.split(/\s+/);
    hashtags.forEach(function (hashtag) {
      if (!hashtag.match(/|#[-\w]{1,19}\b\s?/)) {
        error = 'Хэштег слишком длинный или содержит недопустимые символы';
      }
    });
    if (hashtags.length > 5) {
      error = 'Указано больше 5 хэштегов';
    }
    return error;
  };
  uploadForm.addEventListener('submit', function (e) {
    var err = validateHashtags();
    hashtagsInput.setCustomValidity(err);
    e.preventDefault();
    if (!hashtagsInput.checkValidity()) {
      hashtagsInput.style.borderColor = 'red';
      hashtagsInput.onchange = function () {
        hashtagsInput.setCustomValidity('');
        hashtagsInput.style.borderColor = '';
      };
    } else {
      var formData = new FormData(document.forms[1]);
      window.sendAjax('https://js.dump.academy/kekstagram', formData, function (status) {
        closeLoadPreview();
        if (status === 200) {
          showMessage('success');
        } else {
          showMessage('error');
        }
      });
    }
  });
})();
