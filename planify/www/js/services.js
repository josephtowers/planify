angular.module('starter.services', [])

.factory('Users', function() {
  // Might use a resource here that returns a JSON array

  var users = [{
      id: 0,
      nombre: 'Jorge Lopez',
      email: 'jlo@planify.com',
      telefono: 8096032135,
      password: 'U2FsdGVkX19QOEUZgoRI3mFVdLZTNALRo/55Zqq1qtA=s'
  },{
      id: 1,
      nombre: 'Abraham Fermin',
      email: 'afermin@planify.com',
      telefono: 8097520041,
      password: 'U2FsdGVkX19gU8mLKhj4dxRmT3w31ppV5KzXO79foLQ='
  },{
      id: 2,
      nombre: 'Melissa Lama',
      email: 'mlama@planify.com',
      telefono: 8096032935,
      password: 'U2FsdGVkX19VKFaq7EQ9yrdfhUaoOOk1//MGyDVVtIw='
  },{
      id: 3,
      nombre: 'Gilberto Duran',
      email: 'gduran@planify.com',
      telefono: 8093650135,
      password: 'U2FsdGVkX19Ifn/fUNonUd/O7Lgmd/0fgVejAR595oc='
  },{
      id: 4,
      nombre: 'Raquel Aybar',
      email: 'raybar@planify.com',
      telefono: 8096827735,
      password: 'U2FsdGVkX1/uY2MzrnoJU/fYTiKnLlIWzyf3dbO+MCc='
  }]

  return {
    all: function() {
      return users;
    },
    remove: function(user) {
      users.splice(users.indexOf(user), 1);
    },
    get: function(userId) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].id === parseInt(userId)) {
          return users[i];
        }
      }
      return null;
    },
      getByEmail: function(email)
      {
          for (var i = 0; i < users.length; i++) {
        if (users[i].email === email) {
          return users[i];
        }
      }
      return null;
      }
  };
})

.factory('Projects', function() {
  // Might use a resource here that returns a JSON array

  var projects = [{
      id: 0,
      nombre: 'Tienda de zapatos',
      descripcion: 'Este proyecto es para crear nuestra primera tienda de zapatos',
      miembros: [1,2],
      miembrosCount: 2,
      imagen: 'img/shoestore.jpg',
      color: 'rgb(151, 213, 96)'
  },{
      id: 1,
      nombre: 'Desarrollo web',
      descripcion: 'Este proyecto es para crear nuestra primera página web',
      miembros: [0,1,3],
      miembrosCount: 3,
      imagen: 'img/webdev.jpg',
      color: 'rgb(255, 101, 79)'
  }]

  return {
    all: function() {
      return projects;
    },
    remove: function(pro) {
      projects.splice(projects.indexOf(pro), 1);
    },
    get: function(proId) {
      for (var i = 0; i < projects.length; i++) {
        if (projects[i].id === parseInt(proId)) {
          return projects[i];
        }
      }
      return null;
    },
      addMember: function(pro, id)
      {
          for (var i = 0; i < projects.length; i++) {
        if (projects[i].id === parseInt(pro)) {
          projects[i].miembros.push(id);
            projects[i].miembrosCount++;
        }
      }
      },
      isPartOf: function(pro, id)
      {
           for (var i = 0; i < projects.length; i++) {
               if (projects[i].id === parseInt(pro)) {
                   for(var j = 0; j < projects[i].miembros.length; j++)
                       {
                           if(projects[i].miembros[j] === parseInt(id))
                               {
                                   return true;
                               }
                       }
               }
      }
          return false;
      },
      
      addProject: function(nombre, descripcion, id, color)
      {
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
});

