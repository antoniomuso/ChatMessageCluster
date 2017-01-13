function appendMessage(mess) {
    $("#messages").append($("<li>").text(mess));
}
function appendLog(log) {
    $("#messages").append($("<li>").html("<b>" + log + "</b>"));
}
function getUsername() {
    return $("#username").val();
}
function addUser(username, socketID) {
    $("#Users").append('<li id="' + socketID + '">' + username + '</li>');
}
function removeUser(socketID) {
    $('#' + socketID).remove();
}
function getNameOfID(id) {
    return $('#' + id).text();
}
function update(socketID, username) {
    if (getNameOfID(socketID) !== username) {
        removeUser(socketID);
        addUser(username, socketID);
    }
}

var socket = io({ transports: ["websocket"] });



/*$('#formTo').submit(function () {
    socket.emit('chat message', $('#m').val(), getUsername());
    update(socket.id, getUsername());
    appendMessage("You: " + $('#m').val());
    $('#m').val('');
    return false;
});*/

socket.on('log', function (mex) {
    console.log(mex);
});
/*
socket.on("get users connected", function (userID) {
    for (id in userID) {
        addUser(userID[id], id);
    }
});

socket.on("new user connected", function (name, id) {
    appendLog(name + " has connected");
    addUser(name, id);
});*/
/*
socket.on("chat message", function (mes, username, socketID) {
    appendMessage(username + ": " + mes);
    update(socketID, username);
});
socket.on("user disconnected", function (id) {
    appendLog(getNameOfID(id) + " has disconnected");
    removeUser(id);
}); */




(function () {
    var Message;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        } (this);
        return this;
    };
    $(function () {
        var getMessageText, sendMessage;
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        sendMessage = function (text, position) {
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');
            message = new Message({
                text: text,
                message_side: position
            });
            message.draw();
            return $messages.animate({ scrollTop: $messages.prop('scrollHeight') }, 300);
        };
        var spam = false;        
        $('.send_message').click(function (e) {
            if (!spam)
            {
                spam = true;
                setTimeout(function(){ spam = false }, 500);
                var s = getMessageText();
                console.log(s);
                socket.emit('chat message', s, "Ghost");
                return sendMessage("You: " + s,"left");
            }
        });
        $('.message_input').keyup(function (e) {
            if (e.which === 13 && !spam) {
                spam = true;
                setTimeout(function(){ spam = false }, 500);
                var s = getMessageText();
                console.log(s);
                socket.emit('chat message', s, "Ghost");
                return sendMessage("You: " + s, "left");
            }
        });
        
        // socket IO input
        socket.on("chat message", function (mes, username, socketID) {
            sendMessage(username + ": " + mes, "right");
        });
        socket.on("user disconnected", function (id) {
            sendMessage("Ghost" + " has disconnected", "right");
        });
        socket.on("new user connected", function (name, id) {
            sendMessage(name + " has connected", "right");
        });
        // error from server gesture
        socket.on("error message", function(err)
        {
            if (err.type === "spam")
                sendMessage(err.message,"left");
        });


    });
}.call(this));