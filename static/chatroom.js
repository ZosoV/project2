document.addEventListener('DOMContentLoaded', () => {

    // Open new request to get previous messages
    const request = new XMLHttpRequest();
    request.open("POST", "/listmessages");

    // Callback function for when request completes
    request.onload = () => {
        const data = JSON.parse(request.responseText);
        localStorage.setItem("chat_id", data["chat_id"])
        let i;
        for ( i=0; i<data["message"].length; i++) {
            const div = document.createElement("div");
            const response = data["message"][i];

            if(data["current_user"] == response["user_name"] ){
                div.innerHTML = `<div class="container">
                                    <img src="../static/profile.png" alt="Avatar">
                                    <strong>${response["user_name"]}</strong> : 
                                    <p>${response["selection"]}</p>
                                    <span class="time-right">${response["time"]}</span>
                                </div>`;
            }else{
                div.innerHTML = `<div class="container darker">
                                    <img src="../static/profile.png" alt="Avatar" class="right">
                                    <strong>${response["user_name"]}</strong> : 
                                    <p>${response["selection"]}</p>
                                    <span class="time-left">>${response["time"]}</span>
                                </div>`;
            }


            document.querySelector('#messages').append(div);

        }
    };
    request.send();



    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    // When connected configure button
    socket.on('connect', () => {

        // Button should emit a 'submit message' event
        document.querySelector('button').onclick = function () {
            const selection = document.querySelector('input').value;
            this.form.reset();
            socket.emit('submit message', {'selection': selection});
        };
    });

    // When a message is sent, add to the unordered list
    socket.on ('cast message', data => {
        if (data["chat_id"] === localStorage.chat_id) {
            const div = document.createElement("div");
            var current_user = document.getElementById("inputGroup-sizing-default").innerHTML
            current_user = current_user.replace(/ /g,"") //Elimina espacios

            console.log(data);
            console.log(current_user);
            if (current_user == data['user_name']){
                div.innerHTML = `<div class="container">
                                    <img src="../static/profile.png" alt="Avatar">
                                    <strong>${data["user_name"]}</strong> : 
                                    <p>${data["selection"]}</p>
                                    <span class="time-right">${data["time"]}</span>
                                </div>`;
            }else{
                div.innerHTML = `<div class="container darker">
                                    <img src="../static/profile.png" alt="Avatar" class="right">
                                    <strong>${data["user_name"]}</strong> : 
                                    <p>${data["selection"]}</p>
                                    <span class="time-left">>${data["time"]}</span>
                                </div>`;
            }


            document.querySelector('#messages').append(div);
        }
    });


});
