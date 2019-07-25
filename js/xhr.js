'use strict';
(function () {
  window.getAjax = function (url, callback) {
    var xhr = new XMLHttpRequest();
    var res = 0;
    xhr.onreadystatechange = function () {
      if (xhr.status === 200 && xhr.readyState === 4) {
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

  window.sendAjax = function (url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        callback(xhr.status);
      }
    };
    xhr.open('POST', url);
    xhr.send(data);
  };
})();
