'use strict';
(function () {
  window.getAjax = function (method, url, callback) {
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
    xhr.open(method, url);
    xhr.send();
  };
})();
