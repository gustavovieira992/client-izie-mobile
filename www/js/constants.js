angular.module('constants', [])

.constant('UrlsConst', (function () {
  var baseUrl = 'http://192.168.0.13:8000';

  return {
    'baseUrl': baseUrl
  }

})());
