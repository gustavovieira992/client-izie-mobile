angular.module('controllers', ['service'])

.controller('listController', function ($scope, ClientService, $state, $filter) {
  $scope.loading = true;

  ClientService.list()
    .then(function (result) {
      $scope.list = result.data;
      $scope.loading = false;
    });

  $scope.goEdit = function (id) {
    $state.go('client.edit', {id: id});
  };

  $scope.formatDate = function (val) {
    var data = new Date(val);
    return $filter('date')(data, 'dd/MM/yyyy');
  }



})

.controller('viewController', function ($scope, ClientService, $stateParams, $filter) {
  $scope.loading = true;

  ClientService.find($stateParams.id)
    .then(function (result) {
      $scope.client = result.data;
      $scope.client.dt_birth = $scope.formatDate($scope.client.dt_birth);
      $scope.loading = false;
    })

  $scope.formatDate = function (val) {
    var data = new Date(val);
    return $filter('date')(data, 'dd/MM/yyyy');
  }


})

.controller('formController', function ($scope, ionicDatePicker, ClientService, ionicToast, $state, $stateParams, $filter) {
  $scope.formData = {};


  $scope.title = 'Novo cliente';
  if ($stateParams.id) {
    $scope.loading = true;
    $scope.title = 'Editar cliente';

    ClientService.find($stateParams.id)
      .then(function (result) {
        $scope.formData = result.data;
        var data = new Date($scope.formData.dt_birth);
        $scope.formData.dt_birth_input = $filter('date')(data, 'dd/MM/yyyy');
        $scope.loading = false;
      })
  }

  var ipObj1 = {
    callback: function (val) {  //Mandatory
      var data = new Date(val);
      $scope.formData.dt_birth_input = $filter('date')(data, 'dd/MM/yyyy');
      $scope.formData.dt_birth = $filter('date')(data, 'yyyy-MM-dd');

    },
    closeOnSelect: true,
    to: new Date()
  };

  $scope.openDatePicker = function(){
    ionicDatePicker.openDatePicker(ipObj1);
  };

  $scope.save = function() {

    ClientService.save($scope.formData)
      .then(function (result) {
        ionicToast.show(result.data.message, 'bottom', true, 2500);
        $state.go('client.list', {}, {reload: true});
      }, function(err) {
        console.log(err);
        ionicToast.show(err.data.message, 'bottom', true, 2500);
      })
  };


});
