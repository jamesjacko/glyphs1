const NUM_GLYPHS = 21;
const NUM_ORDERED_GLYPHS = 5;
const GLYPH_TYPES = [5,6,7,8,9,10,11,12,13,14,17,18,19,20,21,22,23,24,30,31,32,33,34,35,36,37,38,39,40];
console.log(getQ());
const TOTAL_QUESTIONS = (getQ()!== null)? getQ() : 22;
const REF = getRef();
var question_count = 0;
var num_correct;
var selectCount = 0;
var responses = {type1: [], type2: []};
var selections = [];
var glyphsShown = [];
var glyph = "";
var currentType2 = [];
var timer = null;
var timerCount = 0;
var part = 0;
var oldDate = Date.now();
var objs = null;
var explanations = [
    'The two images below depict a low graded (left) and high graded (right) student respectively.<br>Please select the low graded students from the grid below and continue when done.',
    'Please rank the following students in order, from lowest to highest. We are after your first impression so you will not be able to deselct your answers.'
];


window.onload = function() {
    gridVersion();
    setupContinueClick();
};

function getProps(){
    urlParams = new URLSearchParams(window.location.search);
    return {c: urlParams.get('c'), u: urlParams.get('u')};
}

function getRef(){
  urlParams = new URLSearchParams(window.location.search);
  var ref = urlParams.get('ref');
  return ref;
}

function getQ(){
  urlParams = new URLSearchParams(window.location.search);
  var q = urlParams.get('q');
  return q;
}
function clearDivs(part){
    if(part === 0){
      ++question_count;
			//if(question_count > TOTAL_QUESTIONS) window.location.href = "surveyThanks.html";
    }
		if(question_count > TOTAL_QUESTIONS){
			showFinalQuestions();
			return;
		} else {
	    document.getElementById("glyphs").innerHTML = "";
	    document.getElementById("explanation").innerHTML = "";
	    document.getElementById("continue1").classList.remove('show');
	    document.getElementById("continue2").classList.remove('show');
	    document.getElementById('current_number').innerHTML = question_count;
	    document.getElementById('total_number').innerHTML = TOTAL_QUESTIONS;
	    if(part === 0){
	        document.getElementById("wrapper").classList.remove("part2");
	        document.getElementById("continue1").classList.add('show');
	    } else if (part === 1){
	        document.getElementById("wrapper").classList.add("part2");
	    }
	    document.getElementById('description').innerHTML = explanations[part];
			oldDate = Date.now();
		}
}

function showFinalQuestions(){
		if(getQ() === "1"){
			glyphsShown = [5,6,7,8,9,10,11,12,13,14,17,18,19,20,21,22,23,24,30,31,32,33,34,35,36,37,38,39,40];
		}
    selections = [];
		currentType2 = [];
    selectCount = 0;
		num_correct = 5;
		document.getElementById("question_number").style.display = "none";
		document.getElementById("description").style.display = "none";
		document.getElementById("glyphs").innerHTML = "";
		document.getElementById("explanation").innerHTML = "";
		document.getElementById("continue1").classList.remove('show');
		document.getElementById("continue2").classList.remove('show');
		document.getElementById("continue2").classList.add('show');
		document.getElementById('closingQuestions').style.display = "block";
    var obj = getObject(9, {min:40, max:60}, 3);
    for (var i = 0; i < glyphsShown.length; i++) {
      generateGlyph("glyphsFinal", glyphsShown[i], obj, glyphsShown[i], 3);
    }
		var button = document.createElement('button');
		var buttonText = document.createTextNode("Clear Selection");
		button.appendChild(buttonText);
		button.addEventListener('click', function(e){
			e.preventDefault();
			selections = [];
			var canvases = document.getElementsByTagName('canvas');
			for (var i = 0; i < canvases.length; i++) {
				canvases[i].parentElement.removeAttribute('data-selorder');
				canvases[i].removeAttribute('data-selorder');
				canvases[i].parentElement.classList.remove('done');
				canvases[i].classList.remove('selected');
				currentType2 = [];
				selectCount = 0;
			}
		});
		document.getElementById('glyphsFinal').appendChild(button);
}

function runGlyphs(glyphType){
    glyph = parseInt(glyphType);
    generateGlyphs("glyphs", objs, glyph);
    generateGlyph("explanation", glyph, getObject(9, {min:10, max:20}, 3), null, null, true);
    generateGlyph("explanation", glyph, getObject(9, {min:80, max:100}, 3), null, null, true);
}

function gridVersion(){
  selections = [];
	currentType2 = [];
  selectCount = 0;
    part = 0;
    num_correct = Math.floor(Math.random() * 5) + 2;
    clearDivs(0);

		if(question_count <= TOTAL_QUESTIONS){
			objs = setupObjects(NUM_GLYPHS, num_correct);
	    glyph = getGylphType(runGlyphs);
		}

}

function orderVersion(){
    selections = [];
    selectCount = 0;
    part = 1;
    clearDivs(1);
    num_correct = NUM_ORDERED_GLYPHS;
    var objs = setupOrderedObjects(NUM_ORDERED_GLYPHS);
    generateGlyphs('glyphs', objs, glyph, 1);
}


function generateGlyphs(id, objs, glyph, presType){
  document.getElementById(id).innerHTML = "";
  for(var i = 0; i < objs.length; i++){
      generateGlyph("glyphs", glyph, objs[i], i, presType);
  }
}

function generateGlyph(id, glyph, obj, i, presType, noClick) {
    var div, canvas;
    div = document.createElement('div');
    div.classList.add('glyph');
    canvas = document.createElement('canvas');
    var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0) > 600 ? 80 : 50;
    canvas.width = w;
    canvas.height = w;
    canvas.style.background = "#FFF";
    canvas.setAttribute("id", "glyph" + i);
    canvas.setAttribute('data-correct', obj.correct);
    canvas.setAttribute('data-order', obj.order);
    canvas.setAttribute('data-click', noClick);
    div.appendChild(canvas);
    getGlyph(canvas, glyph, obj);
    if(typeof noClick === "undefined"){
      setupCanvasClick(canvas, presType);
    }
    document.getElementById(id).appendChild(div);
}

function setupCanvasClick(canvas, presType){
    if(presType === 1){
        canvas.addEventListener('click', function () {
            this.classList.add('selected');
            this.setAttribute('data-selorder', "" + selectCount);
            this.parentElement.classList.add('done');
            this.parentElement.setAttribute('data-selorder', "" + (selectCount++ + 1));
            currentType2.push({correct: this.dataset.selorder === this.dataset.order, type: glyph});
            if(selectCount === num_correct){
                document.getElementById("continue2").classList.add('show');
            }
        });
    } else if(presType === 3){
			canvas.addEventListener('click', function () {
				if(selectCount < num_correct){
					this.classList.add('selected');
					this.setAttribute('data-selorder', "" + selectCount);
					this.parentElement.classList.add('done');
					this.parentElement.setAttribute('data-selorder', "" + (selectCount++ + 1));
					currentType2.push({correct: this.dataset.selorder === this.dataset.order, type: this.id});
					if(selectCount === num_correct){
							document.getElementById("continue2").classList.add('show');
					}
				}
			});
		} else {
        canvas.addEventListener('click', function(){
            if(this.classList.contains('selected')){
                selectCount--;
                this.classList.remove('selected');
                var index = -1;
                for(var i = 0; i < selections.length; i++){
                    if(selections[i].id === this.id)
                        index = i;
                }
                selections.splice(index, 1);
            } else if(selectCount < num_correct){
                selectCount++;
                this.classList.add('selected');
                selections.push({id: this.id, correct: this.getAttribute('data-correct')});
            }
            var elem = document.getElementById("continue1");
            // if(selectCount === num_correct){
            //     elem.classList.add('show');
            // }else {
            //     elem.classList.remove('show');
            // }
        });
    }
}

function startTimer(){
    var progress = document.getElementById('progressbar');
    progress.classList.add('full');
    clearInterval(timer);
    timer = setInterval(function(){
        if(timerCount > 149){
            if(part === 0){
                orderVersion();
            } else if (part === 1){
                gridVersion();
            }
        }
        timerCount++;
    }, 100);
}

function resetTimer(){
    var progress = document.getElementById('progressbar');
    progress.classList.remove('full');
    setTimeout(function(){
        progress.classList.add('full');
        timerCount = 0;
        oldDate = Date.now();
    }, 1);

}

function setupContinueClick(){
    document.getElementById('continue1').addEventListener('click', function(e){
       e.preventDefault();
       if(selections.length > 0){
           sendResponse({
               doneBefore: REF === 1 ? true : false,
               props: getProps(),
               glyphType: glyph,
               selections: selections,
               decisionTime: Date.now() - oldDate,
               missed: num_correct - selections.length,
							 respId: localStorage.getItem("id")
           }, 1, orderVersion);
           glyphsShown.push(glyph);
       }
    });
    document.getElementById('continue2').addEventListener('click', function(e){
        e.preventDefault();
        if(selectCount === 5){
          sendResponse({
            doneBefore: REF === 1 ? true : false,
            props: getProps(),
            glyphType: glyph,
            answers: currentType2,
            decisionTime: Date.now() - oldDate,
						respId: localStorage.getItem("id")
          }, 2, gridVersion);
        }

    })
}
