angular.module('service', [])

.service('ClientService', function ($http, UrlsConst) {
  var list = function () {
    return $http.get(UrlsConst.baseUrl + '/api/v1/clients');
  };

  var save = function (params) {
    return $http.post(UrlsConst.baseUrl + '/api/v3/clients', params);
  };

  var find = function (id) {
    return $http.get(UrlsConst.baseUrl + '/api/v1/client/' + id);
  };

  return {
    save: save,
    list: list,
    find: find
  };

});

