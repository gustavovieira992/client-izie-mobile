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

.controller('formController', function ($scope, ionicDatePicker, ClientService, ionicToast, $state, $stateParams, $filter,
                                        $cordovaCamera, $cordovaFile, $cordovaFileTransfer, $cordovaDevice, $ionicPopup, $cordovaActionSheet, UrlsConst) {
  $scope.formData = {};


  $scope.image = null;

  // Present Actionsheet for switch beteen Camera / Library
  $scope.loadImage = function() {
    var options = {
      title: 'Select Image Source',
      buttonLabels: ['Load from Library', 'Use Camera'],
      addCancelButtonWithLabel: 'Cancel',
      androidEnableCancelButton : true,
    };
    $cordovaActionSheet.show(options).then(function(btnIndex) {
      var type = null;
      if (btnIndex === 1) {
        type = Camera.PictureSourceType.PHOTOLIBRARY;
      } else if (btnIndex === 2) {
        type = Camera.PictureSourceType.CAMERA;
      }
      if (type !== null) {
        $scope.selectPicture(type);
      }
    });
  };

  $scope.selectPicture = function(sourceType) {
    var options = {
      quality: 50,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
    };

    $cordovaCamera.getPicture(options).then(function(imagePath) {

      var currentName = imagePath.replace(/^.*[\\\/]/, '');

      //Create a new name for the photo
      var d = new Date(),
        n = d.getTime(),
        newFileName =  n + ".jpg";

      // If you are trying to load image from the gallery on Android we need special treatment!
      if ($cordovaDevice.getPlatform() == 'Android' && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
        window.FilePath.resolveNativePath(imagePath, function(entry) {
            window.resolveLocalFileSystemURL(entry, success, fail);
            function fail(e) {
              console.error('Error: ', e);
            }

            function success(fileEntry) {
              var namePath = fileEntry.nativeURL.substr(0, fileEntry.nativeURL.lastIndexOf('/') + 1);
              // Only copy because of access rights
              $cordovaFile.copyFile(namePath, fileEntry.name, cordova.file.dataDirectory, newFileName).then(function(success){
                $scope.image = newFileName;
              }, function(error){
                $scope.showAlert('Error', error.exception);
              });
            };
          }
        );
      } else {
        var namePath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        // Move the file to permanent storage
        $cordovaFile.moveFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(function(success){
          $scope.image = newFileName;
        }, function(error){
          $scope.showAlert('Error', error.exception);
        });
      }


      var targetPath = $scope.pathForImage($scope.image);
      var filename = $scope.image;
      var url = UrlsConst.baseUrl + '/api/v1/upload';

      var options = {
        fileKey: "file",
        fileName: filename,
        chunkedMode: false,
        mimeType: "image/jpg"
      };

      $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
        console.log("SUCCESS: " + JSON.stringify(result.response));
        console.log('Result_' + result.response[0] + '_ending');
        alert("success");
        alert(JSON.stringify(result.response));

      }, function(err) {
        console.log("ERROR: " + JSON.stringify(err));
        //alert(JSON.stringify(err));
      }, function (progress) {
        // constant progress updates
      });


    }, function(err) {
      // error
      console.log(err);
    });
  };

  $scope.pathForImage = function(image) {
    if (image === null) {
      return '';
    } else {
      return cordova.file.dataDirectory + image;
    }
  };

  $scope.uploadImage = function() {
    // Destination URL
    // var url = "http://localhost:8888/upload.php";
    var url = UrlsConst.baseUrl + '/api/v1/upload';

    // File for Upload
    var targetPath = $scope.pathForImage($scope.image);

    // File name only
    var filename = $scope.image;

    var options = {
      fileKey: "file",
      fileName: filename,
      chunkedMode: false,
      mimeType: "multipart/form-data",
      params : {'fileName': filename}
    };

    $cordovaFileTransfer.upload(url, targetPath, options).then(function(result) {
      $scope.showAlert('Success', 'Image upload finished.');
    });
  };

  $scope.showAlert = function(title, msg) {
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: msg
    });
  };



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
