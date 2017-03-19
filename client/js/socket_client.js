var socket = io();
var username = $('#username').text();
var group = $('#group').text();
var profileimage = $('#profileimage').text();
var messageContainer = $("#message-container ol");
var geoLocation;

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
       geoLocation = {latitude: position.coords.latitude, longitude: position.coords.longitude};
       var params = {location: geoLocation, room: group};
       socket.emit('updategeocordinate', params, function (err) {
          if (err) {
             console.log("Error in emitting updategeocordinates from the client ..." + err)
          }
       });
    }, function () {
      console.log("Unable to fetch location.");
    });
} else {
    console.log("geolocation is not available.");  
}

function scrollToBottom () {
  // Selectors
  var messages = $('#messages');
  var newMessage = messages.children('li:last-child')
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}


socket.on('connect', function () {
  console.log("Inside client connect");
  var params={name: username, room: group, profileimg: profileimage, location: geoLocation};
  socket.emit('join', params, function (err) {
      if (err) {
          console.log("Error in emitting Join from the client ..." + err)
      }
  });
});

socket.on('newMessage', function (message) {
    messageContainer.append('<li style="word-wrap: break-word">'+ message + '</li>');
    scrollToBottom();
});

socket.on('disconnect', function () {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function (users) {
  $('#chatusers').empty();
  var template = $('#users-template').html();
  var loc = "";
  users.forEach(function (user) {
      if (user.location) {
        loc = "https://www.google.com/maps?q=" + user.location.latitude + "," + user.location.longitude;
      } else {
        loc = "https://www.google.com/maps?q=" + "undefined" + "," + "undefined";
      }
      var html = Mustache.render(template, {
          name: user.name,
          profileimage: user.profileimg,
          location: loc
      });
      $('#chatusers').append(html);
  });
});

$('#message-form').on('submit', function (e) {
  e.preventDefault();
  
  var messageTextbox = $('[name=message]');

  socket.emit('createMessage', {
    text: messageTextbox.val(),
    name: username,
    room: group,
    profileimg: profileimage,
    location: geoLocation,
    date: new Date()
  }, function () {
    messageTextbox.val('')
  });
});