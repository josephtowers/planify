var base_url = 'http://66a7683e.ngrok.io/planify/public/';

angular.module('starter.services', [])
  .factory('Users', function ($http) {
    // Might use a resource here that returns a JSON array

    var users = [{
      id: 0,
      nombre: 'Jorge Lopez',
      email: 'jlo@planify.com',
      telefono: 8096032135,
      password: 'U2FsdGVkX19QOEUZgoRI3mFVdLZTNALRo/55Zqq1qtA=s'
    }, {
      id: 1,
      nombre: 'Abraham Fermin',
      email: 'afermin@planify.com',
      telefono: 8097520041,
      password: 'U2FsdGVkX19gU8mLKhj4dxRmT3w31ppV5KzXO79foLQ='
    }, {
      id: 2,
      nombre: 'Melissa Lama',
      email: 'mlama@planify.com',
      telefono: 8096032935,
      password: 'U2FsdGVkX19VKFaq7EQ9yrdfhUaoOOk1//MGyDVVtIw='
    }, {
      id: 3,
      nombre: 'Gilberto Duran',
      email: 'gduran@planify.com',
      telefono: 8093650135,
      password: 'U2FsdGVkX19Ifn/fUNonUd/O7Lgmd/0fgVejAR595oc='
    }, {
      id: 4,
      nombre: 'Raquel Aybar',
      email: 'raybar@planify.com',
      telefono: 8096827735,
      password: 'U2FsdGVkX1/uY2MzrnoJU/fYTiKnLlIWzyf3dbO+MCc='
    }];

    users = [];
    $http({
      method: 'GET',
      url: base_url + 'user',
      headers: {}
    }).then(function successCallback(response) {
      var usersData = response.data;
      for(var i = 0; i < usersData.length; i++) {
        var user = usersData[i];
        console.log(user);
        users.push({
          id: user.id,
          nombre: user.name,
          email: user.email,
          telefono: user.phone_number,
          password: 'U2FsdGVkX1/uY2MzrnoJU/fYTiKnLlIWzyf3dbO+MCc='
        });
      }
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });

    return {
      all: function () {
        return users;
      },

      new: function (obj) {
        var newuser = {
          id: users.length,
          nombre: obj.nombre,
          email: obj.email,
          telefono: obj.phone,
          password: obj.pass
        };
        users.push(newuser);

        var userRequest = {
          name: obj.nombre,
          email: obj.email,
          phone_number: obj.phone,
          password: obj.pass
        };

        $http({
          method: 'POST',
          url: base_url + 'user/add',
          headers: {},
          data: userRequest
        }).then(function successCallback(response) {
          console.log(response);
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
      },
      remove: function (user) {
        users.splice(users.indexOf(user), 1);
      },
      get: function (userId) {
        for (var i = 0; i < users.length; i++) {
          if (users[i].id === parseInt(userId)) {
            return users[i];
          }
        }
        return null;
      },
      getByEmail: function (email) {
        for (var i = 0; i < users.length; i++) {
          if (users[i].email === email) {
            return users[i];
          }
        }
        return null;
      }
    };
  })


  .factory('UserInSession', function () {
    var user = 0;

    return {
      get: function () {
        return user;
      },
      set: function (id) {
        user = id;
      }
    }
  })

  .factory('Projects', function ($http) {
    // Might use a resource here that returns a JSON array

    var projects = [{
      id: 0,
      nombre: 'Tienda de zapatos',
      descripcion: 'Este proyecto es para crear nuestra primera tienda de zapatos',
      miembros: [1, 2],
      miembrosCount: 2,
      imagen: 'img/shoestore.jpg',
      color: 'rgb(151, 213, 96)'
    }, {
      id: 1,
      nombre: 'Desarrollo web',
      descripcion: 'Este proyecto es para crear nuestra primera página web',
      miembros: [0, 1, 3],
      miembrosCount: 3,
      imagen: 'img/webdev.jpg',
      color: 'rgb(255, 101, 79)'
    }]

    projects = [];
    $http({
      method: 'GET',
      url: base_url + 'project',
      headers: {}
    }).then(function successCallback(response) {
      var projectsData = response.data;
      for (var i = 0; i < projectsData.length; i++) {
        var project = projectsData[i];
        console.log(project);
        projects.push({
          id: project.id,
          nombre: project.name,
          descripcion: project.description,
          miembros: project.users,
          miembrosCount: project.users.length,
          imagen: project.image_uri,
          color: project.color
        });
      }
    })

    return {
      all: function () {
        return projects;
      },

      allMine: function (id) {
        console.log("Buscando los proyectos de " + id);
        var thoseProjects = [];
        for (var i = 0; i < projects.length; i++) {
          for (var j = 0; j < projects[i].miembros.length; j++) {
            if (projects[i].miembros[j] === parseInt(id)) {
              thoseProjects.push(projects[i]);
            }
          }

        }
        return thoseProjects;
      },
      remove: function (pro) {
        projects.splice(projects.indexOf(pro), 1);
      },
      get: function (proId) {
        for (var i = 0; i < projects.length; i++) {
          if (projects[i].id === parseInt(proId)) {
            return projects[i];
          }
        }
        return null;
      },
      addMember: function (pro, id) {
        for (var i = 0; i < projects.length; i++) {
          if (projects[i].id === parseInt(pro)) {
            projects[i].miembros.push(id);
            projects[i].miembrosCount++;
          }
        }
      },
      isPartOf: function (pro, id) {
        for (var i = 0; i < projects.length; i++) {
          if (projects[i].id === parseInt(pro)) {
            for (var j = 0; j < projects[i].miembros.length; j++) {
              if (projects[i].miembros[j] === parseInt(id)) {
                return true;
              }
            }
          }
        }
        return false;
      },

      addProject: function (nombre, descripcion, id, color) {
        var newProject = {
          id: projects.length,
          nombre: nombre,
          descripcion: descripcion,
          miembros: [id],
          miembrosCount: 1,
          imagen: 'img/project.png',
          color: color
        }
        projects.push(newProject);
      }
    };
  })

  .factory('Tasks', function ($http) {
    // Might use a resource here that returns a JSON array

    var tasks = [{
      id: 0,
      nombre: 'Buscar local',
      descripcion: 'Buscar un lugar suficientemente grande para la tienda de zapatos',
      project: 0,
      creator: 2,
      datecreated: '8/3/17',
      datelimit: '8/4/17',
      priority: 'Alta',
      assignedTo: 2,
      color: 'rgb(151, 213, 96)'
    }, {
      id: 1,
      nombre: 'Buscar personal',
      descripcion: 'Buscar personal para la tienda de zapatos',
      project: 0,
      creator: 2,
      datecreated: '8/3/17',
      datelimit: '8/4/17',
      priority: 'Media',
      assignedTo: 2,
      color: 'rgb(151, 213, 96)'
    }, {
      id: 2,
      nombre: 'Seleccionar lenguaje',
      descripcion: 'Reunirse y seleccionar el lenguaje que vamos a usar',
      project: 1,
      creator: 0,
      datecreated: '8/3/17',
      datelimit: '8/4/17',
      priority: 'Media',
      assignedTo: 0,
      color: 'rgb(255, 101, 79)'
    }, {
      id: 3,
      nombre: 'Seleccionar plataforma',
      descripcion: 'Reunirse y seleccionar la plataforma que vamos a usar',
      project: 1,
      creator: 0,
      datecreated: '8/3/17',
      datelimit: '8/4/17',
      priority: 'Alta',
      assignedTo: 3,
      color: 'rgb(255, 101, 79)'
    }]

    tasks = [];
    $http({
      method: 'GET',
      url: base_url + 'task',
      headers: {}
    }).then(function successCallback(response) {
      var tasksData = response.data;
      for(var i = 0; i < tasksData.length; i++) {
        var task = tasksData[i];
        console.log(task);
        tasks.push({
          id: task.id,
          nombre: task.name,
          descripcion: task.description,
          project: task.project_id,
          creator: task.created_by_user_id,
          datecreated: task.created_at,
          datelimit: task.due_date,
          priority: task.priority_level.name,
          assignedTo: task.assigned_to_user_id,
          color: task.color
        });
      }
    }, function errorCallback(response) {
      // called asynchronously if an error occurs
      // or server returns response with an error status.
    });


    return {
      all: function () {
        return tasks;
      },
      remove: function (pro) {
        tasks.splice(tasks.indexOf(task), 1);
      },
      get: function (taskId) {
        for (var i = 0; i < projects.length; i++) {
          if (tasks[i].id === parseInt(taskId)) {
            return tasks[i];
          }
        }
        return null;
      },

      addTask: function (nombre, descripcion, creatorId, assignedToId, projectId, color) {
        var newTask = {
          id: tasks.length,
          nombre: nombre,
          descripcion: descripcion,
          project: projectId,
          creator: creatorId,
          datecreated: '8/3/17',
          datelimit: '8/4/17',
          priority: 'Alta',
          assignedTo: assignedToId,
          color: 'rgb(255, 101, 79)'
        }
        tasks.push(newTask);


        var taskRequest = {
          nombre: nombre,
          descripcion: descripcion,
          color: color,
          priority: 'Media',
          assignedTo: assignedToId,
          project: projectId
        };

        $http({
          method: 'POST',
          url: base_url + 'task/add',
          headers: {},
          data: taskRequest
        }).then(function successCallback(response) {
          console.log(response);
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
        });
      }
    };
  });
