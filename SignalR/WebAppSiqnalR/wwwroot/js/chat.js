"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

connection.on("ReceiveMessage", function (user, message) {
    let li = `<li class="list-group-item mt-3" style="background-color: #d8f8db; border-radius:30px"><h3>${user}</h3><p>${message}</p></li>`
    document.getElementById("messagesList").innerHTML += li;
});

connection.start().then(function () {
    if (localStorage.getItem("user") !== null) {
        ShowChat();
        let group = JSON.parse(localStorage.getItem("user")).groupname;
        connection.invoke("EnterGroup", group);
    }
}).catch(function (err) {
    return console.error(err.toString());
});

let enterUserForm = document.getElementById("enterUserForm");

enterUserForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let userInputVal = document.getElementById("userInput").value.trim();
    let groupInputVal = document.getElementById("groupInput").value.trim();
    console.log(userInputVal+" "+groupInputVal)
    if (userInputVal != "" && groupInputVal != "") {
        ShowChat();

        let user = {
            username: userInputVal,
            groupname: groupInputVal
        }
        localStorage.setItem("user", JSON.stringify(user));
        connection.invoke("EnterGroup", groupInputVal);
    }
})

let leaveGroup = document.getElementById("leaveGroup");
leaveGroup.addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("userRow").classList.remove("d-none");
    document.getElementById("messageRow").classList.add("d-none");

    let group = JSON.parse(localStorage.getItem("user")).groupname;
    connection.invoke("LeaveGroup", group);
    localStorage.removeItem("user");
    document.getElementById("messagesList").innerHTML = "";
})

let messageForm = document.getElementById("messageForm");
messageForm.addEventListener("submit", function (e) {
    e.preventDefault();
    let messageInput = document.getElementById("messageInput").value.trim();
    if (messageInput!=="") {
        let user = JSON.parse(localStorage.getItem("user"));
        connection.invoke("SendMessage", user.username, messageInput, user.groupname);
        document.getElementById("messageInput").value = "";
    }
})

function ShowChat(){
    document.getElementById("userRow").classList.add("d-none");
    document.getElementById("messageRow").classList.remove("d-none");
}