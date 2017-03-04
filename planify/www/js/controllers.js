angular.module('starter.controllers', [])


.controller('HomeCtrl', function($scope, $ionicModal, $timeout, $location, $ionicPopup, $state) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
    $scope.register = function()
    {
        $scope.closeLogin();
        $state.go('tab.dash');
    }
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/signup.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };
   
$scope.showPopup = function() {
  $scope.data = {};
   

  var myPopup = $ionicPopup.show({
    template: '<input type="email" class="custom-input custom-input-pass" placeholder="Correo electrónico">',
    title: 'Olvidé mi contraseña',
    subTitle: 'Por favor, introduzca su correo electrónico para recuperarla:',
    scope: $scope,
    buttons: [
      
        { text: 'CANCELAR',
       type: 'button-clear button-calm'
      },
        
      {
        text: 'ACEPTAR',
        type: 'button-clear button-calm'
      }
    ]
  });

  myPopup.then(function(res) {
    console.log('Tapped!', res);
  });

 };
})

.controller('DashCtrl', function($scope) {})

.controller('ProjectsCtrl', function($scope) {})

.controller('TasksCtrl', function($scope) {})

.controller('PreferencesCtrl', function($scope) {});