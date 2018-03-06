window.onload = function() {
    var numGlyphTypes = 31;
    for (var i = 0; i < GLYPH_COUNT; i++) {
      var cb = document.createElement("input");
      var lbl = document.createElement("label");
      var div = document.createElement("div");
      var txt = document.createTextNode("" + (i + 1));
      div.classList.add("ui");
      div.classList.add("checkbox");
      cb.setAttribute("type", "checkbox");
      cb.setAttribute("id", "glyph" + (i + 1));
      cb.setAttribute("value", i);
      cb.classList.add("glyphType");
      //cb.checked = true;
      lbl.setAttribute("for", "glyph" + (i + 1));
      lbl.appendChild(txt);
      div.appendChild(cb);
      div.appendChild(lbl);
      document.getElementById("checks").appendChild(div);
    }
    var obj = JSON.parse(document.getElementById("JSON").value);
		// for (var i = 0; i < obj.object.values.length; i++) {
		// 	obj.object.values[i].value = Math.round(Math.random() * 100);
		// }
		// for (var i = 0; i < 10; i++) {
		// 	var newObj = {
		// 		name: "blah",
		// 		min: 0,
		// 		max: 100,
		// 		value: Math.round(Math.random() * 50) + 50
		// 	}
		// 	obj.object.values.push(newObj);
		// }
		document.getElementById("JSON").value = JSON.stringify(obj, null, 2);
    depictChecked(obj.views);
    generateGlyphs("glyphs", numGlyphTypes);
    document.getElementById("JSON").addEventListener("keydown", function(e) {
      if(e.keyCode === 13 && e.shiftKey){
        var obj = JSON.parse(document.getElementById("JSON").value);
        depictChecked(obj.views);
        generateGlyphs("glyphs", numGlyphTypes);
        e.preventDefault();
      }
    });
    document.getElementById("update").addEventListener("click", function(){
      generateGlyphs("glyphs", numGlyphTypes);
    });
    document.getElementById("all").addEventListener("click", function(){
      var checks = document.getElementsByClassName("glyphType");
      Array.prototype.forEach.call(checks, function(e){
        e.checked = true;
      });
      generateGlyphs("glyphs", numGlyphTypes);
    });
    document.getElementById("none").addEventListener("click", function(){
      var checks = document.getElementsByClassName("glyphType");
      Array.prototype.forEach.call(checks, function(e){
        e.checked = false;
      });
      generateGlyphs("glyphs", numGlyphTypes);
    });
}

function depictChecked(checked){
  var checks = document.getElementsByClassName("glyphType");
  checked = checked.map(function(x){return parseInt(x) -1;})
  Array.prototype.forEach.call(checks, function(e){
    if(checked.indexOf(parseInt(e.value)) !== -1)
      e.checked = true;
    else
      e.checked = false;
  });
}

function generateGlyphs(id, numGlyphTypes){
  document.getElementById(id).innerHTML = "";
  var checked = [];
  var checks = document.getElementsByClassName("glyphType");
  Array.prototype.forEach.call(checks, function(e){
    if(e.checked)
      checked.push(e.value);
  });
  checked = checked.map(function(x){return parseInt(x) +1;})
  var obj = JSON.parse(document.getElementById("JSON").value);
  obj.views = checked;
  document.getElementById("JSON").value = JSON.stringify(obj, null, 2);
  Array.prototype.forEach.call(obj.views, function(e){
    generateGlyph("glyphs", parseInt(e) - 1, obj.object);
  });
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
    canvas.addEventListener('click', function(){
      document.getElementById("glyph" + (glyph + 1)).checked = false;
      generateGlyphs("glyphs");
    });
    document.getElementById(id).appendChild(div);
}
