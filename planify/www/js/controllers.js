angular.module('starter.controllers', [])

.value('userInSession',0)

<<<<<<< Updated upstream
.controller('HomeCtrl', function($scope, $ionicModal, $timeout, $location, $ionicPopup, $state) {
=======
.controller('HomeCtrl', function($scope, $ionicModal, $timeout, $location, $ionicPopup, $state, Users, userInSession) {
>>>>>>> Stashed changes

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
      alert(userInSession);
  };
   
<<<<<<< Updated upstream
=======
    $scope.doLogin = function() {
        var currentUser;
        var allUsers = Users.all();
        for(var i = 0; i < allUsers.length; i++)
            {
                if(allUsers[i].email == $scope.loginData.username)
                    {
                        currentUser = allUsers[i];
                  }
            }
        if(currentUser != null && CryptoJS.AES.decrypt(currentUser.password, currentUser.email).toString(CryptoJS.enc.Utf8) == $scope.loginData.password)
            {
                $scope.closeLogin();
                $state.go('tab.dash');
                userInSession = currentUser.id;
            }
        else
            {
                $scope.informPopup('Revise los datos', 'El correo electrónico y la contraseña no coinciden. Por favor, revise el formulario de nuevo');
            }
    };
    $scope.informPopup = function(title, subTitle) {
  
  var myPopup = $ionicPopup.show({
//    template: '<input type="email" class="custom-input custom-input-pass" placeholder="Correo electrónico">',
    title: title,
    subTitle: subTitle,
    scope: $scope,
    buttons: [
      {
        text: '',
          type: 'button-clear'
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
    
>>>>>>> Stashed changes
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

.controller('ProjectsCtrl', function($scope, $timeout, $ionicPopup, Projects, Users, userInSession) {
    
    $scope.doRefresh = function() {
    
    console.log('Refreshing!');
    $timeout( function() {
      
      $scope.$broadcast('scroll.refreshComplete');
    
    }, 1000);
      
  };
    
    $scope.projects = Projects.all();
    $scope.users = Users.all();
    
    $scope.showMe = function(n){
        if($('ion-item[aria-order="'+n+'"]').hasClass('activenow'))
            {
                $('.hidden').slideUp(400);
                $('.activenow').removeClass('activenow');
                $('ion-item[aria-order="'+n+'"] i').removeClass('ion-chevron-up');
                $('ion-item[aria-order="'+n+'"] i').addClass('ion-chevron-down');
            }
        else
            {
                $('.projects-content i').removeClass('ion-chevron-up');
                $('.projects-content i').addClass('ion-chevron-down');
                $('.hidden').slideUp(400);
                $('.hidden' + n).slideDown(400);
                $('.activenow').removeClass('activenow');
                $('ion-item[aria-order="'+n+'"]').addClass('activenow');
                $('ion-item[aria-order="'+n+'"] i').removeClass('ion-chevron-down');
                $('ion-item[aria-order="'+n+'"] i').addClass('ion-chevron-up');
            }
        
    };
    
    $scope.showMembers = function(pro)
    {
        var template = "";
        var project = Projects.get(pro);
        var members = project.miembros;
        for(var i = 0; i < members.length; i++)
            {
                var member = Users.get(members[i]);
                template += '<ion-item class="item-remove-animate item-avatar item-icon-right item-borderless" type="item-text-wrap" style="padding-right:0 !important"><img style="background-color:lightgreen"><h2>'+member.nombre+'</h2><p>'+member.email+'</p></ion-item>';
            }
        var myPopup = $ionicPopup.show({
    template: template,
    title: 'Miembros',
    scope: $scope,
    buttons: [
      
        { text: 'CERRAR',
       type: 'button-clear button-calm'
      },
        
      {
        text: 'AGREGAR',
        type: 'button-clear button-calm',
          onTap: function()
          {
              $scope.addMember(pro);
          }
      }
    ]
  });
    };
    
    $scope.add = {};
    $scope.addMember = function(pro)
    {
        var myPopup = $ionicPopup.show({
    template: '<input type="email" class="custom-input custom-input-pass" placeholder="Correo electrónico" ng-model="add.email">',
    title: 'Agregar miembro',
    subTitle: 'Por favor, introduzca el correo electrónico de la persona que se agregará al proyecto:',
    scope: $scope,
    buttons: [
      
        { text: 'CANCELAR',
       type: 'button-clear button-calm',
         onTap: function()
         {
             $('.custom-input').html('');
         }
      },
        
      {
        text: 'ACEPTAR',
        type: 'button-clear button-calm',
          onTap: function()
          {
              $('.custom-input').html('');
              var member = Users.getByEmail($scope.add.email);
              if(member != null)
                  {
                      if(Projects.isPartOf(pro, member.id))
                          {
                               $scope.informPopup('Error', 'El correo electrónico corresponde a un usuario que ya es parte del proyecto. Inténtelo de nuevo',$scope.addMember());
                          }
                      else Projects.addMember(pro, member.id);
                  }
              else
                  {
                      
                      $scope.informPopup('Error', 'El correo electrónico no corresponde a ningún usuario. Inténtelo de nuevo',$scope.addMember());
                  }
          }
      }
    ]
  });
    }
    
     $scope.informPopup = function(title, subTitle, callback) {
  
  var myPopup = $ionicPopup.show({
//    template: '<input type="email" class="custom-input custom-input-pass" placeholder="Correo electrónico">',
    title: title,
    subTitle: subTitle,
    scope: $scope,
    buttons: [
      {
        text: '',
          type: 'button-clear'
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
    $scope.pro = {};
    $scope.addProject = function()
    {
        var myPopup = $ionicPopup.show({
        template: '<input type="text" class="custom-input custom-input-pass" placeholder="Nombre del proyecto" ng-model="pro.nombre"><textarea rows="4" type="text" class="custom-input custom-input-pass" placeholder="Descripción" style="resize:none" ng-model="pro.descripcion">',
        title: 'Agregar proyecto',
        scope: $scope,
        buttons: [
          {
            text: 'CANCELAR',
              type: 'button-clear button-calm'
          },

          {
            text: 'ACEPTAR',
            type: 'button-clear button-calm',
              onTap: function()
              {
                  if($scope.pro.nombre != "" && $scope.pro.descripcion)
                      {
                          var color = 'rgb('+ Math.floor((Math.random() * 255) + 1) +','+ Math.floor((Math.random() * 255) + 1) +','+ Math.floor((Math.random() * 255) + 1) +')';
                          Projects.addProject($scope.pro.nombre, $scope.pro.descripcion, userInSession, color);
                          $('.custom-input').html('');
                      }
                  else{
                      $scope.informPopup('Error', 'Debe introducir un nombre y una descripción', $scope.addProject());
                  }
                  
                  
              }
          }
        ]
      });
    }
})

.controller('TasksCtrl', function($scope) {})

.controller('PreferencesCtrl', function($scope) {});