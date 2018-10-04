function nextPage(src){
  window.location.href = 'survey.html?ref='+src;
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
	document.getElementById("consent").addEventListener('change', function(e){
		if (event.target.checked) {
			for(var i = 0; i < buttons.length; i++){
	      buttons[i].disabled = false;
	    };
	  } else {
			for(var i = 0; i < buttons.length; i++){
	      buttons[i].disabled = true;
	    };
	  }
	})
}
