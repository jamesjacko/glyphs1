function nextPage(){
  window.location.href = 'survey.html';
}
window.onload = function(){
  document.getElementById('next').addEventListener('click', function(e){
    e.preventDefault();
    nextPage();
  })
}
