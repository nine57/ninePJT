$(document).ready(function () {
  var messageContent = $(".message-content");
  var messageText = messageContent.data("message");
  var messageLevel = messageContent.data("level");
  if (messageText != undefined) {
    Swal.fire({
      text: messageText,
      icon: messageLevel,
      confirmButtonText: "확인",
    });
  }
});

function checkCapsLock(event) {
  if (event.getModifierState("CapsLock")) {
    document.getElementById("messageCapsLock").innerText = "Caps Lock 활성화";
  } else {
    document.getElementById("messageCapsLock").innerText = "";
  }
}
