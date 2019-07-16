'use strict';
var hashtagsInput = document.querySelector('.text__hashtags');
(function () {
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
  var getScale = function () {
    var scaleVal = scaleInput.value.split('%')[0];
    return scaleVal;
  };
  var effectLevel = document.querySelector('.img-upload__effect-level');

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
        effectLevel.classList.add('hidden');
        return;
      } else {
        effectLevel.classList.remove('hidden');
      }
      currEffect = effectsList[effectName];
      previewImg.className = 'effects__preview--' + effectName;
      previewImg.style = ' ';
      renderPreviewImage(currEffect.max);
      scalePreviewImage(100);
      thumbElem.style.left = '100%';
      progressLine.style.width = '100%';
    });
  }

  var resetEffects = function () {
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
      effectValInput.value = val;
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
    document.removeEventListener('keydown', onPreviewEscPress);
  });

  commentInput.addEventListener('blur', function () {
    document.addEventListener('keydown', onPreviewEscPress);
  });

  var validateHashtags = function () {
    var error = '';
    var hashtags = hashtagsInput.value.trim().split(' ');
    hashtags.forEach(function (hashtag) {
      if (!hashtag.match(/#[-\w]{1,19}\b\s?/)) {
        error = 'ВВедите корректный хэш';
      }
    });
    return error;
  };

  uploadForm.addEventListener('submit', function (e) {
    var err = validateHashtags();
    hashtagsInput.setCustomValidity(err);
    if (!hashtagsInput.checkValidity()) {
      e.preventDefault();
      hashtagsInput.onchange = function () {
        hashtagsInput.setCustomValidity('');
      };
    }
    hashtagsInput.onchange = null;
  });
})();
