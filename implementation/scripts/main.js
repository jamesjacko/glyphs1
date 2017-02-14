var seed;

var settings = [
  {
    name: "height",
    min: 1.0,
    max: 2.5,
    value: 0
  },
  {
    name: "weight",
    min: 0,
    max: 100,
    value: 0
  },
  {
    name: "blood",
    min: 40,
    max: 60,
    value: 0
  }
];

/**
 * As there is no way to seed a random within the JS Math clas it is
 * necessary to provide a seedable random function.
 */
function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}


function draw(ctx){
  getValues();
  seed = document.getElementById("seedValue").value.hashCode();
  ctx.beginPath();
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  var size = 80;
  var offsetx = 20;
  var offsety = 20;
  //ctx.rect(offset, offset, size, size);
  //ctx.stroke();
  var coords = initCoords(size);
  var pivot = {
    x: (size / 2),
    y: (size / 2)
  };
  var angle = degToRad(random() * 180);
  coords.forEach(function(elem, e){
    if(document.getElementById("rotate").checked === true){
      coords[e] = rotatePoint(pivot, elem, angle);
    }
    ctx.beginPath();
    ctx.arc(offsetx + coords[e].x, offsety + coords[e].y, 2, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
  });

  var midPoints = [];

  coords.forEach(function(elem, e){
    var x = offsetx + elem.x;
    var y = offsety + elem.y;
    if(e === 0){
      ctx.beginPath();
      ctx.moveTo(x, y);
    } else if(e === coords.length - 1){
      ctx.lineTo(x, y);
      ctx.stroke();
      var midPoint = {
        x: (coords[e-1].x + coords[e].x) / 2,
        y: (coords[e-1].y + coords[e].y) / 2,
        angle: Math.atan2(coords[e].y - coords[e-1].y, coords[e].x - coords[e-1].x)
      }
      midPoints.push(midPoint);
    } else {
      ctx.lineTo(x, y);
      var midPoint = {
        x: (coords[e-1].x + coords[e].x) / 2,
        y: (coords[e-1].y + coords[e].y) / 2,
        angle: Math.atan2(coords[e].y - coords[e-1].y, coords[e].x - coords[e-1].x),
        peak: {}
      }
      midPoints.push(midPoint);
    }
  });

  for (var i = 0; i < midPoints.length; i++) {
    var norm = (settings[i].value - settings[i].min) / (settings[i].max - settings[i].min);
    var featureHeight = 20;
    var normValue = featureHeight * norm;
    var point = {
      x: Math.sin(midPoints[i].angle) * normValue + midPoints[i].x,
      y: -Math.cos(midPoints[i].angle) * normValue + midPoints[i].y,
      altx: Math.sin(midPoints[i].angle) * -normValue + midPoints[i].x,
      alty: -Math.cos(midPoints[i].angle) * -normValue + midPoints[i].y,
    }
    midPoints[i].peak = point;
    ctx.beginPath();
    ctx.moveTo(offsetx + midPoints[i].x, offsety + midPoints[i].y);
    ctx.lineTo(offsetx + point.x, offsety + point.y);
    ctx.stroke();
  }
  var offset = 1;
  drawTriangles(ctx, offsetx + 100 * offset++, offsety, coords, midPoints);
  drawTriangles(ctx, offsetx + 100 * offset++, offsety, coords, midPoints, true);
  drawCurves(ctx, offsetx + 100 * offset++, offsety, coords, midPoints);
  drawCurves(ctx, offsetx + 100 * offset++, offsety, coords, midPoints, true);
}

function drawTriangles(ctx, offsetx, offsety, coords, midPoints, alternate){
  coords.forEach(function(elem, e){
    if(e !== coords.length - 1){
      ctx.beginPath();
      ctx.moveTo(offsetx + coords[e].x, offsety + coords[e].y);
      if(e % 2 !== 0 && alternate === true)
        ctx.lineTo(offsetx + midPoints[e].peak.altx, offsety + midPoints[e].peak.alty);
      else
        ctx.lineTo(offsetx + midPoints[e].peak.x, offsety + midPoints[e].peak.y);
      ctx.lineTo(offsetx + coords[e + 1].x, offsety + coords[e + 1].y);
      ctx.fill();
    }
  });
}


function drawCurves(ctx, offsetx, offsety, coords, midPoints, alternate){
  coords.forEach(function(elem, e){
    if(e !== coords.length - 1){
      ctx.beginPath();
      ctx.moveTo(offsetx + coords[e].x, offsety + coords[e].y);
      if(e % 2 !== 0 && alternate === true)
        ctx.quadraticCurveTo(offsetx + midPoints[e].peak.altx,
          offsety + midPoints[e].peak.alty,
          offsetx + coords[e + 1].x, offsety + coords[e + 1].y);
      else
        ctx.quadraticCurveTo(offsetx + midPoints[e].peak.x,
          offsety + midPoints[e].peak.y,
          offsetx + coords[e + 1].x, offsety + coords[e + 1].y);
      ctx.fill();
    }
  });
}
/**
 *  Returns normalized coordinates for initial line
 */

function initCoords(size){
  var range = size * 0.9;
  var off = (size * 0.1) / 2;
  var points = [
    {
      x: 0.1 * size,
      y: (random() * range) + off
    },
    {
      x: 0.35 * size,
      y: (random() * range) + off
    },
    {
      x: 0.65 * size,
      y: (random() * range) + off
    },
    {
      x: 0.9 * size,
      y: (random() * range) + off
    }
  ];
  return points;
}
/**
 * Rotate point around a pivot point by a give angle
 */
function rotatePoint(pivot, point, angle){
  var rotatedX = Math.cos(angle) * (point.x - pivot.x) - Math.sin(angle) * (point.y-pivot.y) + pivot.x;
  var rotatedY = Math.sin(angle) * (point.x - pivot.x) + Math.cos(angle) * (point.y - pivot.y) + pivot.y;
  return {x: rotatedX, y: rotatedY};
}
function degToRad(angle){
  return angle * (Math.PI / 180);
}
window.onload = function(){
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext("2d");
  draw(ctx);
  document.getElementById("update").addEventListener("click", function(e){
    e.preventDefault();
    draw(ctx);
  });
};


function getValues(){
  var inputs = document.getElementsByClassName("value");
  for (var i = 0; i < inputs.length; i++) {
    settings[i].value = parseFloat(inputs[i].value);
  }
}

/**
 * Taken from http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
 */
 String.prototype.hashCode = function() {
   var hash = 0, i, chr, len;
   if (this.length === 0) return hash;
   for (i = 0, len = this.length; i < len; i++) {
     chr   = this.charCodeAt(i);
     hash  = ((hash << 5) - hash) + chr;
     hash |= 0; // Convert to 32bit integer
   }
   return hash;
 };
