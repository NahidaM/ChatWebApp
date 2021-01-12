"use strict";

//var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();
//console.log(connection)
////Disable send button until connection is established
//document.getElementById("sendButton").disabled = true;

//connection.on("ReceiveMessage", function (user, message) {
//    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
//    var encodedMsg = user + " says " + msg;
//    var li = document.createElement("li");
//    li.textContent = encodedMsg;
//    document.getElementById("messagesList").appendChild(li);
//});

//connection.start().then(function () {
//    document.getElementById("sendButton").disabled = false;
//}).catch(function (err) {
//    return console.error(err.toString());
//});

//document.getElementById("sendButton").addEventListener("click", function (event) {
//    var user = document.getElementById("userInput").value;
//    var message = document.getElementById("messageInput").value;
//    connection.invoke("SendMessage", user, message).catch(function (err) {
//        return console.error(err.toString());
//    });
//    event.preventDefault();
//});


//Task

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

connection.on("ReceiveMessage", function (user, message) {
    let li = `<li class="list-group-item mt-3"><h3>${user}</h3><p>${message}</p></li>`;
    document.getElementById("chatList").innerHTML += li;
});

connection.start().then(function () {
    if (localStorage.getItem("user") !== null) {
        ShowChat();
        let group = JSON.parse(localStorage.getItem("user")).group;
        connection.invoke("EnterGroup", group);
    } else {
        document.getElementById("enterRow").classList.remove("d-none");
    }
}).catch(function (err) {
    return console.error(err.toString());
});

let enterUserForm = document.getElementById("enterUserForm");
let leaveBtn = document.getElementById("leaveBtn");

enterUserForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let username = document.getElementById("username").value.trim();
    let selectedGroup = document.getElementById("selectedGroup").value;
    if (username != "" && selectedGroup != "") {
        ShowChat();

        let user = {
            username: username,
            group: selectedGroup
        }
        localStorage.setItem("user", JSON.stringify(user));
        connection.invoke("EnterGroup", selectedGroup);
    }
})

leaveBtn.addEventListener("click", function () {
    document.getElementById("enterRow").classList.remove("d-none");
    document.getElementById("chatRow").classList.add("d-none");

    let group = JSON.parse(localStorage.getItem("user")).group;
    connection.invoke("LeaveGroup", group);

    localStorage.removeItem("user");
    document.getElementById("chatList").innerHTML = "";
})

document.getElementById("chatForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let message = document.getElementById("messageText").value;
    let user = JSON.parse(localStorage.getItem("user"));
    connection.invoke("SendMessage", user.group, user.username, message);

    document.getElementById("messageText").value = "";
})

function ShowChat() {
    document.getElementById("enterRow").classList.add("d-none");
    document.getElementById("chatRow").classList.remove("d-none");
}
