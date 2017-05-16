window.onload = function() {
    generateGlyphs("glyphs", 28);
    document.getElementById("update").addEventListener("click", function() {
        generateGlyphs("glyphs", 28);
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
