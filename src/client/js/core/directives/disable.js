angular.module('RequelPro').directive('disable', function () {
  'use strict';
  return {
    restrict: 'A',
    link: function ($scope, $el, attr) {
      $scope.$watch(function () {
        return $scope.$eval(attr.disable);
      }, function (disable) {
        if (disable) {
          $el.addClass('disabled').attr('disabled', 'disabled');
          if ($el.is('a')) {
            $el.bind('click.disable', function (e) {
              e.preventDefault();
              e.stopPropagation();
              return false;
            });
          }
        } else {
          $el.removeClass('disabled').removeAttr('disabled');
          if ($el.is('a')) {
            $el.unbind('click.disable');
          }
        }
      });

      if ($el.is('a')) {
        $scope.$on('$destroy', function () {
          $el.unbind('click.disable');
        });
      }
    }
  };
});
