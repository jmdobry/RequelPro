angular.module('RequelPro').filter('truncate', function () {
  'use strict';

  return function (text, length, end) {
    if (isNaN(length)) {
      length = 10;
    }

    if (end === undefined) {
      end = '...';
    }

    if (text.length <= length || text.length - end.length <= length) {
      return text;
    } else {
      return String(text).substring(0, length - end.length) + end;
    }
  };
}).filter('clean', function () {
  'use strict';

  return function (text) {
    if (text && angular.isString(text)) {
      return text.replace(/&nbsp;/gi, ' ');
    } else {
      return text;
    }
  };
});
