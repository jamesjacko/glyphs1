window.onload = function() {
    var numGlyphTypes = 29;
    generateGlyphs("glyphs", numGlyphTypes);
    document.getElementById("JSON").addEventListener("keyup", function(e) {
      if(e.keyCode === 13 && e.shiftKey){
        generateGlyphs("glyphs", numGlyphTypes);
        e.preventDefault();
      }
    })
}

function generateGlyphs(id, numGlyphTypes){
  document.getElementById(id).innerHTML = "";
  var obj = JSON.parse(document.getElementById("JSON").value);
  for (var i = 0; i < numGlyphTypes; i++) {
      generateGlyph("glyphs", i, obj);
  }
}

function generateGlyph(id, glyph, obj) {
    var div, canvas;
    div = document.createElement('div');
    div.classList.add('glyph');
    canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    canvas.style.background = "#FFF";
    div.appendChild(canvas);
    getGlyph(canvas, glyph, obj);
    document.getElementById(id).appendChild(div);
}
