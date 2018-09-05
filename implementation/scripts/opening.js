function nextPage(){
  window.location.href = 'survey.html';
}
window.onload = function(){
  document.getElementById('next').addEventListener('click', function(e){
    e.preventDefault();
    var email = document.getElementById('email').value
    if(email !== ""){
      if(/(.+)@(.+){2,}\.(.+){2,}/.test(email)){
        saveEmail(email,nextPage);
      } else {
        alert("Your email: " + email + ", doesn't seem valid");
        document.getElementById('email').focus();
      }
    } else {
      nextPage();
    }
  })
}
