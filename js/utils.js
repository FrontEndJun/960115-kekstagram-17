'use strict';
(function () {
  var ESC = 27;
  window.Modal = function (props) {
    this.modalOverlay = document.querySelector(props.overlaySelector);
    if (props.modalInnerSelector) {
      this.modalInnerSelector = props.modalInnerSelector;
    }
    this.onOverlayClickCloseModal = props.onOverlayClickCloseModal || false;
    if (!this.modalOverlay) {
      return;
    }
    this.closeButtons = this.modalOverlay.querySelectorAll(props.closeButtonSelector);
    this.escPressHandler = this.onEscPress.bind(this);
    this.onEscPressCloseModal = props.onEscPressCloseModal || true;
  };
  window.Modal.prototype.onEscPress = function (e) {
    if (!this.onEscPressCloseModal) {
      return;
    }
    if (e.keyCode !== ESC) {
      return;
    }
    this.hide();
  };
  window.Modal.prototype.hide = function () {
    this.modalOverlay.classList.add('hidden');
    document.removeEventListener('keydown', this.escPressHandler);
  };
  window.Modal.prototype.show = function () {
    var self = this;
    this.modalOverlay.classList.remove('hidden');
    document.addEventListener('keydown', this.escPressHandler);
    this.closeButtons.forEach(function (button) {
      button.addEventListener('click', self.hide.bind(self));
    });
    if (this.modalInnerSelector && this.onOverlayClickCloseModal) {
      this.modalOverlay.addEventListener('click', function (e) {
        var tg = e.target;
        if (tg.querySelector(self.modalInnerSelector)) {
          self.modalOverlay.remove();
        }
      });
    }
  };
  var utils = window.utils;
  window.utils = {
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1) + min);
    },
    remap: function (n, start1, stop1, start2, stop2) {
      return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
    },
    getCoords: function (elem) {
      var box = elem.getBoundingClientRect();

      return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
      };
    }
  };
  return utils;
})();
