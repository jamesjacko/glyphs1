const NUM_GLYPHS = 21;
const NUM_ORDERED_GLYPHS = 5;
const GLYPH_TYPES = [5,6,7,8,9,10,11,12,13,14,17,18,19,20,21,22,23,24,30,31,32,33,34,35,36,37,38,39,40];
var selectCount = 0;
var responses = {type1: [], type2: []};
var selections = [];
var glyph = "";
var currentType2 = [];
var timer = null;
var timerCount = 0;
var part = 0;
var oldDate = Date.now();


window.onload = function() {
    gridVersion();
    setupContinueClick();
    startTimer();
};

function clearDivs(part){
    resetTimer();
    document.getElementById("glyphs").innerHTML = "";
    document.getElementById("explanation").innerHTML = "";
    document.getElementById("continue1").classList.remove('show');
    document.getElementById("continue2").classList.remove('show');
    if(part === 0){
        document.getElementById("glyphs").classList.remove("part2");
    } else if (part === 1){
        document.getElementById("glyphs").classList.add("part2");
    }
}

function gridVersion(){
    part = 0;
    clearDivs(0);
    var objs = setupObjects(NUM_GLYPHS);
    glyph = GLYPH_TYPES[Math.floor(Math.random()*GLYPH_TYPES.length)];
    generateGlyphs("glyphs", objs, glyph);
    generateGlyph("explanation", glyph, getObject(9, {min:10, max:20}, 3));
    generateGlyph("explanation", glyph, getObject(9, {min:80, max:100}, 3));
}

function orderVersion(){
    part = 1;
    clearDivs(1);
    var objs = setupOrderedObjects(NUM_ORDERED_GLYPHS);
    generateGlyphs('glyphs', objs, glyph, 1);
}


function generateGlyphs(id, objs, glyph, presType){
  document.getElementById(id).innerHTML = "";
  for(var i = 0; i < objs.length; i++){
      generateGlyph("glyphs", glyph, objs[i], i, presType);
  }
}

function generateGlyph(id, glyph, obj, i, presType) {
    var div, canvas;
    div = document.createElement('div');
    div.classList.add('glyph');
    canvas = document.createElement('canvas');
    canvas.width = 80;
    canvas.height = 80;
    canvas.style.background = "#FFF";
    canvas.setAttribute("id", "glyph" + i);
    canvas.setAttribute('data-correct', obj.correct);
    canvas.setAttribute('data-order', obj.order);
    div.appendChild(canvas);
    getGlyph(canvas, glyph, obj);
    setupCanvasClick(canvas, presType);
    document.getElementById(id).appendChild(div);
}

function setupCanvasClick(canvas, presType){
    if(presType === 1){
        canvas.addEventListener('click', function () {
            this.classList.add('selected');
            this.setAttribute('data-selorder', "" + selectCount);
            this.parentElement.classList.add('done');
            this.parentElement.setAttribute('data-selorder', "" + (selectCount++ + 1));
            currentType2.push(this.dataset.selorder === this.dataset.order);
            if(selectCount === 5){
                document.getElementById("continue2").classList.add('show');
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
            } else if(selectCount < 5){
                selectCount++;
                this.classList.add('selected');
                selections.push({id: this.id, correct: this.getAttribute('data-correct')});
            }
            var elem = document.getElementById("continue1");
            if(selectCount === 5){
                elem.classList.add('show');
            }else {
                elem.classList.remove('show');
            }
        });
    }
}

function startTimer(){
    var progress = document.getElementById('progressbar');
    progress.classList.add('full');
    timer = setInterval(function(){
        if(timerCount > 149){
            resetTimer();
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
           responses.type1.push({
               glyphType: glyph,
               selections: selections,
               decisionTime: Date.now() - oldDate
           });
           selections = [];
           selectCount = 0;
           orderVersion();
       }
    });
    document.getElementById('continue2').addEventListener('click', function(e){
        e.preventDefault();
        if(selectCount === 5){
            responses.type2.push({
                glyphType: glyph,
                answers: currentType2,
                decisionTime: Date.now() - oldDate
            });
            currentType2 = [];
            selectCount = 0;
            gridVersion();
        }
    })
}