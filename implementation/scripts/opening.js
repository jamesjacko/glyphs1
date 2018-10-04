function nextPage(src){
  var ref = (src === "next") ? "1" : "2"
  window.location.href = 'survey.html?ref=' + ref;
}
window.onload = function(){
  var buttons = document.querySelectorAll('#next, #next1');
  for(var i = 0; i < buttons.length; i++){
    buttons[i].addEventListener('click', function(e){
      e.preventDefault();
      console.log(e);
      nextPage(e.srcElement.id);
    });
  }
}
