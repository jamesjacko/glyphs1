var seed;

var settings;

/**
 * As there is no way to seed a random within the JS Math clas it is
 * necessary to provide a seedable random function.
 */
function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}
function getJSONObj(){
  settings = JSON.parse(document.getElementById('JSON').value);
}

function loadDataPoints(){
  getJSONObj();
  document.getElementById('seedValue').value = settings.name;
  var inputs = "";
  settings.values.forEach(function(elem, e){
    inputs += '<label>' + elem.name +
              ': <input type="text" name="value' + e +
              '" value="' + elem.value +
              '" class="value" disabled></label><br />';
  });
  document.getElementById('details').innerHTML = inputs;
  console.log(JSON.stringify(settings));
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
  var coords = initCoords(size, settings.values.length);
  var pivot = {
    x: (size / 2),
    y: (size / 2)
  };
  var angle = degToRad(random() * 180);
  coords.forEach(function(elem, e){
    if(document.getElementById("rotate").checked === true){
      coords[e] = rotatePoint(pivot, elem, angle);
    }
    coords[e].corner = closestCorner(coords[e], size);
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
  // first coord normal assigned seeded by object name
  coords[0].normal = random();
  for (var i = 0; i < midPoints.length; i++) {
    var norm = (settings.values[i].value - settings.values[i].min) / (settings.values[i].max - settings.values[i].min);
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
    // assign normals to remaining points.
    coords[i+1].normal = norm;
  }
  var offset = 1;
  drawTriangles(ctx, offsetx + 100 * offset++, offsety, coords, midPoints);
  drawTriangles(ctx, offsetx + 100 * offset++, offsety, coords, midPoints, true);
  drawCurves(ctx, offsetx + 100 * offset++, offsety, coords, midPoints);
  drawCurves(ctx, offsetx + 100 * offset++, offsety, coords, midPoints, true);
  offset = 1;
  var opacity = 1;
  var colors = [];
  for (var i = 0; i <= settings.values.length; i++) {
    colors.push(getRandomColor(opacity));
  };
  drawRectangles(ctx, offsetx, offsety + 100, coords, size, colors);
  drawPoints(ctx, coords, {x: offsetx, y: offsety + 100});
  drawRectangles(ctx, offsetx + 100 * offset++, offsety + 100, coords, size, colors,
    {intersections: 1});

  drawRectangles(ctx, offsetx + 100 * offset++, offsety + 100, coords, size, colors,
    {intersections: 2});

  offset = 1;

  drawRectangles(ctx, offsetx, offsety + 200, coords, size, colors, {relative: true});
  drawPoints(ctx, coords, {x: offsetx, y: offsety + 200});
  drawRectangles(ctx, offsetx + 100 * offset++, offsety + 200, coords, size, colors,
    {intersections: 1, relative: true});

  drawRectangles(ctx, offsetx + 100 * offset++, offsety + 200, coords, size, colors,
    {intersections: 2, relative: true});
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

function initCoords(size, numCoords){
  var range = size * 0.9;
  var off = (size * 0.1) / 2;
  var points = [
    {
      x: Math.round(0.1 * size),
      y: Math.round((random() * range) + off)
    }];
  var multiplier = 1 / (numCoords);
  console.log(multiplier);
  for (var i = 1; i < numCoords; i++) {
    points.push({
      x: Math.round((((multiplier * i) * 0.8) + 0.1) * size),
      y: Math.round((random() * range) + off)
    })
  }

  points.push({
    x: Math.round(0.9 * size),
    y: Math.round(/*(random() * range) + off*/50)
  });

  return points;
}
/**
 * Rotate point around a pivot point by a give angle
 */
function rotatePoint(pivot, point, angle){
  var rotatedX = Math.cos(angle) * (point.x - pivot.x) - Math.sin(angle) * (point.y-pivot.y) + pivot.x;
  var rotatedY = Math.sin(angle) * (point.x - pivot.x) + Math.cos(angle) * (point.y - pivot.y) + pivot.y;
  return {x: (rotatedX < 0)? 1 : Math.round(rotatedX), y: (rotatedY < 0)? 1 : Math.round(rotatedY)};
}
function degToRad(angle){
  return angle * (Math.PI / 180);
}
window.onload = function(){
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext("2d");
  loadDataPoints();
  draw(ctx);
  document.getElementById("update").addEventListener("click", function(e){
    e.preventDefault();
    getJSONObj();
    loadDataPoints();
    draw(ctx);
  });
};

function drawPoints(ctx, coords, offset){
  coords.forEach(function(elem){
    ctx.beginPath();
    ctx.arc(offset.x + elem.x, offset.y + elem.y, 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.stroke();
  });
}

function closestCorner(coord, size){
  return {
    x: Math.floor(coord.x / (size / 2)), // divide by 2 to center coords
    y: Math.floor(coord.y / (size / 2))
  }
}
var once = 0;
function drawRectangle(ctx, centre, offset, size, color, options){
  // plus 1 to settings to account for name
  if(once++ < settings.values.length + 1){
    ctx.fillStyle = color;
    ctx.font = "bold 9px Arial";
    ctx.fillText("Option" + once, 40 * once, 450);
  }
  var point = closestCorner(centre, size);
  if(options && options.relative){
    var rectPoint = {
      x: (point.x === 0)? 0 : size - ((size - centre.x) * 2),
      y: (point.y === 0)? 0 : size - ((size - centre.y) * 2),
      w: (point.x === 0)? centre.x * 2 * centre.normal : (size - centre.x) * 2 * centre.normal,
      h: (point.y === 0)? centre.y * 2 * centre.normal : (size - centre.y) * 2 * centre.normal,
    };
  } else {
    var rectPoint = {
      x: (point.x === 0)? 0 : size - ((size - centre.x) * 2),
      y: (point.y === 0)? 0 : size - ((size - centre.y) * 2),
      w: (point.x === 0)? centre.x * 2 : (size - centre.x) * 2,
      h: (point.y === 0)? centre.y * 2 : (size - centre.y) * 2,
    };
  }
  ctx.beginPath();
  ctx.rect(rectPoint.x + offset.x, rectPoint.y + offset.y,
    rectPoint.w, rectPoint.h);
  ctx.fillStyle = color;
  ctx.fill();
  return rectPoint;
}
function getRandomColor(opacity){
  return "rgba("+ Math.floor(random() * 255) +
      ","+ Math.floor(random() * 255) +
      ","+ Math.floor(random() * 255) +
      ","+ opacity +")";
}
function drawRectangles(ctx, offsetx, offsety, coords, size, colors, options){
  var count = 0;
  ctx.save()
  ctx.globalCompositeOperation = "screen";
  var rectangles = [];
  coords.forEach(function(elem, e){
    //if(count++ === 0)
    if(options && options.relative)
      rectangles.push(drawRectangle(ctx, elem, {x: offsetx, y:offsety}, size, colors[e], {relative: true}));
    else
      rectangles.push(drawRectangle(ctx, elem, {x: offsetx, y:offsety}, size, colors[e]));
  });

  ctx.globalCompositeOperation = "source-over";
  if(options){
    if(options.intersections === 1){
      removeIntersections(ctx, rectangles, {x: offsetx, y:offsety}, size);
    } else if(options.intersections === 2){
      keepIntersections(ctx, rectangles, {x: offsetx, y:offsety}, size);
    }
  }
  ctx.restore();
}

function removeIntersections(ctx, rectangles, offset, size){
  rectangles.forEach(function(elem, e){
    for (var i = 0; i < rectangles.length; i++) {
      if(i !== e){
        var intersection = {
          x1: Math.max(elem.x, rectangles[i].x),
          y1: Math.max(elem.y, rectangles[i].y),
          x2: Math.min(elem.x + elem.w, rectangles[i].x + rectangles[i].w),
          y2: Math.min(elem.y + elem.h, rectangles[i].y + rectangles[i].h)
        }
        if(intersection.x1 < intersection.x2 && intersection.y1 < intersection.y2){
          ctx.beginPath();
          ctx.rect(intersection.x1 + offset.x, intersection.y1 + offset.y,
            intersection.x2 - intersection.x1,
            intersection.y2 - intersection.y1);
          ctx.fillStyle = 'white';
          ctx.fill();
        }
      }
    }
  });
}
function keepIntersections(ctx, rectangles, offset, size){
  var intersections = [];
  rectangles.forEach(function(elem, e){
    for (var i = 0; i < rectangles.length; i++) {
      if(i !== e){
        var intersection = {
          x1: Math.max(elem.x, rectangles[i].x),
          y1: Math.max(elem.y, rectangles[i].y),
          x2: Math.min(elem.x + elem.w, rectangles[i].x + rectangles[i].w),
          y2: Math.min(elem.y + elem.h, rectangles[i].y + rectangles[i].h)
        }
        if(intersection.x1 < intersection.x2 && intersection.y1 < intersection.y2){
          var notThere = true;
          intersections.forEach(function(elem){
            if (elem.x1 === intersection.x1 && elem.x2 === intersection.x2
                && elem.y1 === intersection.y1 && elem.y2 === intersection.y2){
              notThere = false;
            }
          });
          if(notThere)
            intersections.push(intersection);
        }
      }
    }
  });
  var inside;
  for (var x = 0; x < size; x++) {
    for (var y = 0; y < size; y++) {
      inside = false;

      intersections.forEach(function(elem){
        if((x >= elem.x1 && x <= elem.x2) && (y >= elem.y1 && y <= elem.y2)){
          inside = true;
        }

      });
      if(!inside){
        ctx.beginPath();
        ctx.rect(x + offset.x, y + offset.y, 1, 1);
        ctx.fillStyle = 'white';
        ctx.fill();
      }
    }
  }
}


function getValues(){
  var inputs = document.getElementsByClassName("value");
  for (var i = 0; i < inputs.length; i++) {
    settings.values[i].value = parseFloat(inputs[i].value);
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
