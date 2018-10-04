function nextPage(src){
  var ref = (src === "next") ? "1" : "2"
  window.location.href = 'surveyA.html?ref=' + ref;
}

function getRef(){
  urlParams = new URLSearchParams(window.location.search);
  ref = urlParams.get('ref');
  return ref;
}




window.onload = function(){
  if(window.location.href.includes("survey1.html")){
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
  } else {
    var radios = document.querySelectorAll('input[type="radio"]');
    for (var i = 0; i < radios.length; i++) {
      radios[i].addEventListener('change', function(){
        if(document.querySelector("input[name=competency]:checked") && document.querySelector("input[name=useage]:checked")){
          document.getElementById("userRatingNext").disabled = false;
        }
      });
    }
    document.getElementById("userRatingNext").addEventListener('click', function(e){
      e.preventDefault();
      var ref = getRef();
      var comp = document.querySelector("input[name=competency]:checked").value;
      var useage = document.querySelector("input[name=useage]:checked").value;
      window.location.href = 'survey.html?ref=' + ref + '&c=' + comp + "&u=" + useage;
    });
  }

}
