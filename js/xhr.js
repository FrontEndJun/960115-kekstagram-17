'use strict';
(function () {
  var READY = 4;
  var STATUS_OK = 200;
  window.getAjax = function (url, callback) {
    var xhr = new XMLHttpRequest();
    var res = 0;
    xhr.onreadystatechange = function () {
      if (xhr.status === STATUS_OK && xhr.readyState === READY) {
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
    onError = onError || function () {};
    xhr.onreadystatechange = function () {
      if (xhr.readyState === READY) {
        if (xhr.status !== STATUS_OK) {
          onError();
        }
        onSuccess();
      }
    };
    xhr.open('POST', 'https://js.dump.academy/kekstagram');
    xhr.send(data);
  };
})();
