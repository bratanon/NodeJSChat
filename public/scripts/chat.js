$(function() {
    var messageWriterPane = $("#writer-pane").outerHeight();
    var clientPaneWidth = $("#client-pane").outerWidth();
    var vpHeight, vpWidth;

    var resizeElements = function() {
        vptHeight = $(window).height();
        vptWidth = $(window).width();

        $("#client-pane").outerHeight(vptHeight + "px");
        $("#conversation-pane").outerHeight(vptHeight - messageWriterPane + "px");
        $("#conversation-pane, #writer-pane").outerWidth(vptWidth - clientPaneWidth + "px");
    };

    resizeElements();

    $(window).resize(function() {
      resizeElements();
    });
});

  // Ready
  $(function() {
      // IO
      var socket = io.connect();

      // Fetch
      var $messagePane = $('#conversation-pane');
      var $messageInput = $('#writer-pane input[type="text"]').removeAttr('disabled').focus();

      // Receive Message
      socket.on('message', function(data) {
          $messageContainer = $('<div></div>').addClass("message");
          $messageSender = $('<div></div>').addClass("sender").text(data.username);
          $messageText = $('<div></div>').addClass("text").text(data.message);

          $messageContainer.append($messageSender).append($messageText);

          $messagePane.append($messageContainer);
      });

      socket.on('whoshere', function(data) {
        $("#client-pane").empty();
        $.each(data.clients, function(i, clientData) {
            var $client = $("<div />").addClass("client");
            $client.append($("<div />").text(clientData.username));
            $("#client-pane").append($client);
        });
      });

      // Send Message
      $messageInput.on('keypress', function(event){
          if ( event.keyCode === 13 ) { // enter
              var message = $messageInput.val().trim();
              socket.emit('message',message);
              $messageInput.val(''); // clear input
          }
      });
  });