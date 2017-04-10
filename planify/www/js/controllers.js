angular.module('starter.controllers', [])

  .value('userInSession',0)

  .controller('HomeCtrl', function($scope, $ionicModal, $timeout, $location, $ionicPopup, $state, Users, UserInSession, $ionicHistory, $cordovaToast, $http) {

    var mailUrl =  "api:key-7c3464b6ed9c2d409179223b076d425b@api.mailgun.net/v3/pasaporgo.com/messages";
    var mailApiKey = "";

    $scope.showToast = function(message, duration, location) {
      $cordovaToast.show(message, "long", "bottom").then(function(success) {
        console.log("The toast was shown");
      }, function (error) {
        console.log("The toast was not shown due to " + error);
      });
    }
    $scope.newuser = {};
    $scope.validateEmail = function (email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    };

    $scope.showAlert = function(errors) {
      var alertPopup = $ionicPopup.alert({
        title: 'Ocurrió un error',
        template: errors,
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
    };

    $scope.register = function()
    {
      console.log('Doing signup', $scope.newuser);
      var data = $scope.newuser;
      var errors = [];
      if(data.nombre == null || data.nombre == "")
      {
        errors.push("<br />El nombre no puede estar en blanco");
      }
      if(data.email == null || !$scope.validateEmail(data.email))
      {
        errors.push("<br />El email no es valido");
        console.log(data.email);
      }
      if(data.pass == null || data.pass2 == null || data.pass != data.pass2)
      {
        errors.push("<br />Las contraseñas no coinciden");
      }
      if(data.phone == null || data.phone == "")
      {
        errors.push("<br />Introduzca un telefono");
      }
      console.log(errors);
      if(errors.length > 0)
      {

        $scope.showAlert(errors);
      }
      else
      {
        if(Users.getByEmail(data.email))
        {
          $scope.informPopup('Hubo un error','Un usuario con ese correo electrónico ya existe. Si olvidate tu contraseña, haz tap en "Olvidé mi contraseña" en la pantalla de inicio');
        }
        else
        {
          try{
            var obj = {};
            obj.nombre = data.nombre;
            obj.email = data.email;
            obj.phone = data.phone;
            obj.pass = CryptoJS.AES.encrypt(data.pass, data.email);
            Users.new(obj);
            //   $scope.informPopup('¡Todo listo!','Bienvenido a Planify, ' + obj.nombre + '. Por favor, inicia sesión para comenzar');
            $scope.closeLogin();
            
            $scope.showToast('¡Cuenta creada! Por favor, inicia sesión para comenzar','long','bottom');
            var settings = {
              "async": true,
              "crossDomain": true,
              "url": "https://api.mailgun.net/v3/pasaporgo.com/messages?from=planify@pasaporgo.com&to="+obj.email+"&subject="+obj.nombre+", te damos la bienvenida a Planify&text=Gracias por confiar en Planify para gestionar tus proyectos personales y profesionales. Comienza a trabajar",
              "method": "POST",
            "username": "api",
            "password": "key-7c3464b6ed9c2d409179223b076d425b",
              beforeSend: function (xhr) {
                xhr.setRequestHeader ("Access-Control-Allow-Headers", "Authorization");
                xhr.setRequestHeader ("Authorization", "Basic " + btoa("api" + ":" + "key-7c3464b6ed9c2d409179223b076d425b"));
            }
            }

            $.ajax(settings).done(function (response) {
              console.log(response);
            });
          }
          catch(e)
          {
            alert(e.message);
          }

          //     $state.go('tab.dash');
        }

      }
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
        $scope.setter = UserInSession.set(currentUser.id)
        console.log("Now " + currentUser.id + " " + currentUser.nombre + " is logged in!");
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

    $scope.forgot = {};

    $scope.showPopup = function() {
      $scope.data = {};


      var myPopup = $ionicPopup.show({
        template: '<input type="email" class="custom-input custom-input-pass" placeholder="Correo electrónico" ng-model="forgot.pass">',
        title: 'Olvidé mi contraseña',
        subTitle: 'Por favor, introduzca su correo electrónico para recuperarla:',
        scope: $scope,
        buttons: [

          { text: 'CANCELAR',
            type: 'button-clear button-calm'
          },

          {
            text: 'ACEPTAR',
            type: 'button-clear button-calm',
            onTap: function()
            {
              if($scope.validateEmail($scope.forgot.pass)){
                $scope.showToast('Si tiene una cuenta en Planify, recibirá un correo electrónico a ' + $scope.forgot.pass + ' con instrucciones para recuperar su contraseña','long','bottom');
                var settings = {
              "async": true,
              "crossDomain": true,
              "url": "https://api.mailgun.net/v3/pasaporgo.com/messages?from=planify@pasaporgo.com&to="+$scope.forgot.pass+"&subject=Instrucciones para recuperar tu contraseña&text=Solicitaste recuperar tu contraseña. Dentro de poco, un miembro del equipo de Planify te contactará por teléfono para volver a tener acceso a tu cuenta. Gracias.",
              "method": "POST",
            "username": "api",
            "password": "key-7c3464b6ed9c2d409179223b076d425b",
              beforeSend: function (xhr) {
                xhr.setRequestHeader ("Access-Control-Allow-Headers", "Authorization");
                xhr.setRequestHeader ("Authorization", "Basic " + btoa("api" + ":" + "key-7c3464b6ed9c2d409179223b076d425b"));
            }
            }

            $.ajax(settings).done(function (response) {
              console.log(response);
            });
              } else {
                $scope.showToast('Ese no es un correo electrónico','long','bottom');
              }

            }}
        ]
      });

      myPopup.then(function(res) {
        console.log('Tapped!', res);
      });

    };
  })

  .controller('DashCtrl', function($scope, Users, UserInSession, Projects, $timeout, Tasks) {

    $scope.doRefresh = function() {

      console.log('Refreshing!');
      $timeout( function() {

        $scope.pros = $scope.getProjects();
        $scope.tasks = $scope.getTasks();
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);

    };
    $scope.user = Users.get(UserInSession.get());
    $scope.getTasks = function()
    {
      var tasks = Tasks.all();
      var renderedTasks = [];
      for(var i = 0; i < tasks.length; i++)
      {
        if(tasks[i].creator === UserInSession.get() || tasks[i].assignedTo === UserInSession.get()){

          renderedTasks.push(tasks[i])}

      }
      return renderedTasks.length;
    }
    $scope.tasks = $scope.getTasks();
    $scope.getProjects = function(){
      var projects = Projects.allMine(UserInSession.get());
      return projects.length;
    }
    $scope.doRefresh();
    $scope.pros = $scope.getProjects();
  })

  .controller('ProjectsCtrl', function($scope, $timeout, $ionicPopup, Projects, Users, UserInSession) {

    var mailUrl =  "https://api.mailgun.net/v3/intec.planify.com/messages"
    var mailApiKey = window.btoa("api:key-9377d5c0f0e2db99510d6a449b49b334")

    $scope.doRefresh = function() {

      console.log('Refreshing!');
      $timeout( function() {

        $scope.projects = Projects.allMine(UserInSession.get());
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);

    };
    $scope.userInSession = UserInSession.get();
    $scope.projects = Projects.allMine($scope.userInSession);
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
                if(Projects.isPartOf(pro, member.id)){
                  $scope.informPopup('Error', 'El correo electrónico corresponde a un usuario que ya es parte del proyecto. Inténtelo de nuevo',$scope.addMember());
                } else{
                  Projects.addMember(pro, member.id);
                 /* $http({
                      "method": "POST",
                      "url": mailUrl,
                      "headers": {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "POST, GET",
                        "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
                        "Authorization": "Basic " + mailApiKey
                      },
                      data: "from=" + "donotreply@planify.com" + "&to=" + $scope.add.email + "&subject= Added to project" + "&text= You've been assigned to the task: " + pro.nombre + " by user: " + UserInSession.get().nombre
                    }
                  ).then(function(success) {
                    console.log("SUCCESS " + JSON.stringify(success));
                  }, function(error) {
                    alert("Ha ocurrido un error al enviarle el correo.");
                  });*/
                }
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

              if($scope.pro.nombre != null && $scope.pro.descripcion != null)

              {
                var color = 'rgb('+ Math.floor((Math.random() * 255) + 1) +','+ Math.floor((Math.random() * 255) + 1) +','+ Math.floor((Math.random() * 255) + 1) +')';
                Projects.addProject($scope.pro.nombre, $scope.pro.descripcion, UserInSession.get(), color);
                $('.custom-input').html('');
                $scope.doRefresh();
              }
              else{
                $scope.informPopup('Error', 'Debe introducir un nombre y una descripción', $scope.addProject());
              }

              /*
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
               }*/
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

              if($scope.pro.nombre != null && $scope.pro.descripcion != null)

              {
                var color = 'rgb('+ Math.floor((Math.random() * 255) + 1) +','+ Math.floor((Math.random() * 255) + 1) +','+ Math.floor((Math.random() * 255) + 1) +')';
                Projects.addProject($scope.pro.nombre, $scope.pro.descripcion, UserInSession.get(), color);
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

  .controller('TasksCtrl', function($scope, $timeout, $ionicPopup, Tasks, Users, UserInSession, Projects) {

    var mailUrl =  "https://api.mailgun.net/v3/intec.planify.com/messages"
    var mailApiKey = window.btoa("api:key-9377d5c0f0e2db99510d6a449b49b334")

    $scope.myProjects = Projects.allMine(UserInSession.get());
    $scope.doRefresh = function() {

      console.log('Refreshing!');
      $timeout( function() {

        $scope.myProjects = Projects.allMine(UserInSession.get());
        $scope.tasks = $scope.getTasks();
        $scope.users = Users.all();
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);

    };
    $scope.getTasks = function()
    {
      var tasks = Tasks.all();
      var renderedTasks = [];
      for(var i = 0; i < tasks.length; i++)
      {
        if(tasks[i].creator === UserInSession.get() || tasks[i].assignedTo === UserInSession.get()){
          var creator = tasks[i].creator;
          var user = Users.get(parseInt(creator));
          var nombreUsuario = user.nombre;
          var project = tasks[i].project;
          var pro = Projects.get(parseInt(project));
          var nombreProyecto = pro.nombre;
          var assignee = tasks[i].assignedTo;
          var user2 = Users.get(parseInt(assignee));
          var nombreAsignado = user2.nombre;
          var task = {
            id: tasks[i].id,
            nombre: tasks[i].nombre,
            descripcion: tasks[i].descripcion,
            project: nombreProyecto,
            creator: nombreUsuario,
            datecreated: tasks[i].datecreated,
            datelimit: tasks[i].datelimit,
            priority: tasks[i].priority,
            assignedTo: nombreAsignado,
            color: tasks[i].color
          }

          renderedTasks.push(task);}

      }
      return renderedTasks;
    }
    $scope.tasks = $scope.getTasks();
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

    $scope.task = {
      nombre: null,
      selectedProject: null,
      selectedTask: null,
      fecha: null,
      descripcion: null
    };
    $scope.members = [];
    $scope.$watch('task.selectedProject', function()
    {
      if($scope.task != null)
        console.log($scope.task);
      $scope.getMembers();
    })
    $scope.getMembers = function()
    {
      if($scope.task.selectedProject >= 0)
      {
        console.log('Hubo otro cambio');
        var project = Projects.get($scope.task.selectedProject);
        var miembros = [];
        for(var i = 0; i < project.miembros.length; i++)
        {
          var user = Users.get(project.miembros[i]);
          miembros.push(user);

        }
        $scope.members = miembros;
      }

    }
    $scope.pro = {};
    $scope.addTask = function()
    {
      var myPopup = $ionicPopup.show({
        template: '<input type="text" class="custom-input custom-input-pass" placeholder="Nombre de la tarea" ng-model="task.nombre"><label for="proyecto">Proyecto</label><select name="proyecto" class="custom-input custom-input-pass" id="custom-input-sel" style="border:none" placeholder="Proyecto" ng-model="task.selectedProject"><option ng-repeat="pro in myProjects" value="{{pro.id}}">{{pro.nombre}}</option></select><label for="asignado">Asignado a</label><select name="asignado" class="custom-input custom-input-pass" style="border:none" placeholder="Asignado a" ng-model="task.selectedTask"><option ng-repeat="member in members" value="{{member.id}}">{{member.nombre}}</option></select><label for="fecha">Fecha límite</label><input name="fecha" type="date" class="custom-input custom-input-pass" ng-model="task.fecha"><textarea rows="4" type="text" class="custom-input custom-input-pass" placeholder="Descripción" style="resize:none" ng-model="task.descripcion">',
        title: 'Agregar tarea',
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

              if($scope.task.nombre != null && $scope.task.descripcion != null && $scope.task.fecha != null && $scope.task.selectedProject != null && $scope.task.selectedTask != null)

              {
                var projectOfMine = Projects.get($scope.task.selectedProject);
                var color = projectOfMine.color;
                Tasks.addTask($scope.task.nombre, $scope.task.descripcion, UserInSession.get(), $scope.task.selectedTask, $scope.task.selectedProject, color);
                var assignedUser = Users.get(parseInt($scope.task.selectedTask));

              /*  $http({
                    "method": "POST",
                    "url": mailUrl,
                    "headers": {
                      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                      "Access-Control-Allow-Origin": "*",
                      "Access-Control-Allow-Methods": "POST, GET",
                      "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
                      "Authorization": "Basic " + mailApiKey
                    },
                    data: "from=" + "donotreply@planify.com" + "&to=" + assignedUser.email + "&subject= Task assignment" + "&text= You've been assigned to the task: " + $scope.task.nombre + " by user: " + UserInSession.get().nombre
                  }
                ).then(function(success) {
                  console.log("SUCCESS " + JSON.stringify(success));
                }, function(error) {
                  console.log("ERROR " + JSON.stringify(error));
                });*/

                $('.custom-input').html('');
                $scope.doRefresh();
              }
              else{
                $scope.informPopup('Error', 'Debe llenar y seleccionar todos los campos', $scope.addTask());
              }


            }
          }
        ]
      });
    }

  })


  .controller('PreferencesCtrl', function($scope, $ionicModal,$ionicPopup, $state) {

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/edit.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeEdit = function() {
      $scope.modal.hide();
    };

    // Triggered in the login modal to close it
    $scope.save = function() {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.editPreferences = function() {
      $scope.modal.show();
    };

    $scope.showAbout = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Acerca de',
        template: '<p>Versión 1.0.2</p> <p>Planify</p> <p>Creada por: José Torres, Kevin Curiel, Alvin Durán y Dariel Cruz</p> <p>Desarrollo de Aplicaciones Móviles @2017</p>',
        buttons: [
          {
            text: 'ACEPTAR',
            type: 'button-clear button-calm'
          }
        ]
      });
    };

    $scope.showTerms = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Términos y Condiciones',
        template: '<p>App hecha para fines educativos</p>',
        buttons: [
          {
            text: 'ACEPTAR',
            type: 'button-clear button-calm'
          }
        ]
      });
    };

    $scope.enablePasswordsFields = function() {
      $("#passwordsFields").toggle(1000);
    };

    $scope.logout = function() {
      $state.go('home');
    };

  });
