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
      for (var i = 0; i < history.length; i++) {
        if (users[i].id === parseInt(userId)) {
          return users[i];
        }
      }
      return null;
    }
  };
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Marcos Ventura',
    lastText: '809-598-0012',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Andrés González',
    lastText: '829-564-1225',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: '849-766-6811',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: '829-899-5003',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: '809-954-2451',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});

