window.onload = function() {
    const NUM_GLYPHS = 25;
    const GLYPH_TYPES = [3,5,6,7,8,9,10,11,12,13,14,15,17,18,19,20,21,22,23,24,28,30,31,32,33,34,35,36,37,38,39,40,41];
    console.log(GLYPH_TYPES.length)
    selectCount = 0;
    var objs = setupObjects(NUM_GLYPHS);
    var glyph = GLYPH_TYPES[Math.floor(Math.random()*GLYPH_TYPES.length)];
    generateGlyphs("glyphs", objs, glyph);
    generateGlyph("explanation", glyph, getObject(9, {min:10, max:20}, 3));
    generateGlyph("explanation", glyph, getObject(9, {min:80, max:100}, 3));
}


function generateGlyphs(id, objs, glyph){
  document.getElementById(id).innerHTML = "";
  for(var i = 0; i < objs.length; i++){
      generateGlyph("glyphs", glyph, objs[i]);
  }
}

function generateGlyph(id, glyph, obj) {
    var div, canvas;
    div = document.createElement('div');
    div.classList.add('glyph');
    canvas = document.createElement('canvas');
    canvas.width = 80;
    canvas.height = 80;
    canvas.style.background = "#FFF";
    div.appendChild(canvas);
    getGlyph(canvas, glyph, obj);
    canvas.addEventListener('click', function(e){
        if(this.classList.contains('selected')){
            selectCount--;
            this.classList.remove('selected')
        } else if(selectCount < 5){
            selectCount++
            this.classList.add('selected');
        }
    });
    document.getElementById(id).appendChild(div);
}
