$(document).ready(function() {
  hidden();
  
  var stopAnim = false;

  $('.title-wrapper').fadeIn(1000);
  $('#enter-btn').click(function() {
    $('.title-wrapper').fadeOut(500);
    $('.wrapper').delay(1000).fadeIn(1800);
    stopAnim = true;
    animLoop();
  });

  var $username = $('#user-name-input');
  var $message = $('#user-ms-input');

  var chatRoom = new Firebase('https://ignition-db.firebaseio.com/chat_room');
  var users = chatRoom.child('users');

  $('.send-btn').click(function() {
    var unVal = $($username).val();
    var msVal = $($message).val();
    
    if (unVal === '') {
      $('.alert-wrapper').fadeIn(1000).fadeOut(1100);
    } else {
      users.push({
        username: unVal,
        message: msVal
      });        
     }   
    $($message).val('');
    $(".messages").animate({ scrollTop: $('.messages')[0].scrollHeight}, 1000);
  });
  
  users.on('child_added', function(snapshot) {
    var message = snapshot.val().message;
    var username = snapshot.val().username;
    var room = $('.messages');

    $('<li/>', {class: 'small-12'})
      
      .html(username + ": " + message)
      .fadeIn(500)
      .appendTo(room);
    });


  //users.onDisconnect().remove();

  $('.clear-chat').click(function() {
    deleteTask();
  });

  function hidden() {
    $('.alert-wrapper').hide();
    $('.wrapper').hide();
    $('.title-wrapper').hide();
  }

  function deleteTask() {
    users.remove();
    $('li').fadeOut(2000)
      .remove();
  }
  
  function animLoop() {
  if (stopAnim === true) {
    $('.fBase-ico i').animate({color: '#1BC98E'}, 3000)
    .animate({color: '#fff'}, 3000)
    .animate({color: '#1BC98E'}, 3000)
    .animate({color: '#1CA8DD'}, 3000,
         function() {
           animLoop();
         });
   }
  }
  
  


  var analytics = new Firebase('https://ignition-db.firebaseio.com/analytics');

  var activeVisitors = analytics.child('activeVisitors');
  var pastVisitors = analytics.child('pastVisitors');

  var totalVisitors = analytics.child('totalVisitors');
  totalVisitors.transaction(function (currentData) {
    return currentData + 1;
  });

  var visitor = {
    path: window.location.pathname,
    arrivedAt: Firebase.ServerValue.TIMESTAMP,
    userAgent: navigator.userAgent
  };

  var activeVisitorsRef = activeVisitors.push(visitor, function() {
    activeVisitors.child(visitorId).once('value', function(snapshot) {
      visitor.arrivedAt = snapshot.child('arrivedAt').val();
      visitor.leftAt = Firebase.ServerValue.TIMESTAMP;
      pastVisitors.child(visitorId).onDisconnect().set(visitor);
    });
  });

  var visitorId = activeVisitorsRef.key();

  activeVisitorsRef.onDisconnect().remove();


});