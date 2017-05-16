angular.module('constants', [])

.constant('UrlsConst', (function () {
  var baseUrl = 'http://localhost:8000';

  return {
    'baseUrl': baseUrl
  }

})());
