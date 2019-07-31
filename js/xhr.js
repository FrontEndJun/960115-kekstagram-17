'use strict';
(function () {
  var READY = 4;
  var SUCCESS_STATUS = 200;
  window.getAjax = function (url, callback) {
    var xhr = new XMLHttpRequest();
    var res = 0;
    xhr.onreadystatechange = function () {
      if (xhr.status === SUCCESS_STATUS && xhr.readyState === READY) {
        try {
          res = JSON.parse(xhr.responseText);
        } catch (err) {
          throw new Error('Не удалось обработать данные');
        }
        callback(res);
      }
    };
    xhr.open('GET', url);
    xhr.send();
  };

  window.sendAjaxFormData = function (data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    onSuccess = onSuccess || function () {};
    onError = onError || function () {};
    xhr.onreadystatechange = function () {
      if (xhr.readyState === READY) {
        if (xhr.status !== 200) {
          onError();
        }
        onSuccess();
      }
    };
    xhr.open('POST', 'https://js.dump.academy/kekstagram');
    xhr.send(data);
  };
})();
