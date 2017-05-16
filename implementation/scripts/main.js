window.onload = function(){
  var numGlyphTypes = 28;
  var obj = {
      name: "Student",
      values: [{
          name: "ICP1002",
          min: 1,
          max: 100,
          value: 50
      },
      {
          name: "ICP1015",
          min: 1,
          max: 100,
          value: 50
      },
      {
          name: "ICP1016",
          min: 1,
          max: 100,
          value: 50
      },
      {
          name: "ICP1022",
          min: 1,
          max: 100,
          value: 50
      }]
  }
  var div, canvas;
  div = document.createElement('div');
  for (var i = 0; i < numGlyphTypes; i++) {
      div.classList.add('img_surv_option');
      canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      canvas.style.background = "#FFF";
      div.appendChild(canvas);
      getGlyph(canvas, i, obj);
  }
  document.getElementById("glyphs").appendChild(div);

}
