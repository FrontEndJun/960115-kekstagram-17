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
  var FormModal = function () {
    window.Modal.apply(this, arguments);
  };
  FormModal.prototype = Object.create(window.Modal.prototype);
  FormModal.prototype.hide = function () {
    window.Modal.prototype.hide.apply(this);
    uploadFile.value = '';
    commentInput.value = '';
    hashtagsInput.value = '';
    resetEffects();
  };
  var previewImg = document.querySelector('.img-upload__preview img');
  var uploadFile = document.querySelector('#upload-file');
  var uploadPreview = new FormModal({overlaySelector: '.img-upload__overlay', closeButtonSelector: '#upload-cancel'});
  var scaleUp = document.querySelector('.scale__control--bigger');
  var scaleDown = document.querySelector('.scale__control--smaller');
  var scaleInput = document.querySelector('.scale__control--value');
  var effectsRadio = document.querySelectorAll('.img-upload__effects input[type="radio"]');
  var getScale = function () {
    return scaleInput.value.split('%')[0];
  };
  var effectLevel = document.querySelector('.img-upload__effect-level');

  effectLevel.classList.add('hidden');

  uploadFile.addEventListener('change', function (e) {
    var loadedImage = e.target.files[0];
    var reader = new FileReader();
    reader.onload = function (evt) {
      previewImg.src = evt.target.result;
      uploadPreview.show();
    };
    reader.readAsDataURL(loadedImage);

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
    uploadPreview.onEscPressCloseModal = false;
  });

  commentInput.addEventListener('blur', function () {
    uploadPreview.onEscPressCloseModal = true;
  });

  var Message = function (props) {
    this.template = props.template;
    document.body.querySelector('main').appendChild(this.template);
    window.Modal.apply(this, arguments);

  };
  Message.prototype = Object.create(window.Modal.prototype);
  Message.prototype.hide = function () {
    window.Modal.prototype.hide.apply(this);
    this.modalOverlay.remove();
  };


  var showMessage = function (type) {
    var template = document.getElementById(type).content;
    var messageTemplate = template.cloneNode(true);
    var messageModal = new Message({template: messageTemplate, overlaySelector: '.' + type, onOverlayClickCloseModal: true, modalInnerSelector: '.' + type + '__inner', closeButtonSelector: '.' + type + '__button'});
    messageModal.show();
  };

  var hashtagsInput = document.querySelector('.text__hashtags');

  hashtagsInput.addEventListener('focus', function () {
    uploadPreview.onEscPressCloseModal = false;
  });
  hashtagsInput.addEventListener('blur', function () {
    uploadPreview.onEscPressCloseModal = true;
  });
  var validateHashtags = function () {
    var error = '';
    var hashtagsVal = hashtagsInput.value.trim();
    if (hashtagsVal.match(/(#[-\w]{1,19}\b)(\s)(\1|.+\1\b)/gi)) {
      error = 'Хэштеги не должны повторяться';
    }
    var hashtags = hashtagsVal.split(/\s+/);
    hashtags.forEach(function (hashtag) {
      var hashtagTest = /#[-a-zA-z0-9_]{1,19}\b\s?/.test(hashtag);
      if (!hashtagTest && hashtag) {
        error = 'Хэштег слишком длинный, содержит недопустимые символы или состоит только из `#`';
      }
    });
    if (hashtags.length > 5) {
      error = 'Не может быть больше 5 хэштегов';
    }
    return error;
  };
  var onSuccessFormLoad = function () {
    uploadPreview.hide();
    showMessage('success');
  }
  var onErrorFormLoad = function () {
    uploadPreview.hide();
    showMessage('error');
  }
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
      window.sendAjaxFormData(formData);
    }
  });
})();

