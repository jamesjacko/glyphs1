
function init(){
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext("2d");
  draw(ctx);
};

function draw(ctx){
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  var size = 80;
  var offset = 20;
  ctx.rect(offset, offset, size, size);
  ctx.stroke();
  var coords = initCoords(size);
  var pivot = {
    x: (size / 2),
    y: (size / 2)
  }
  coords.forEach(function(elem){
    elem = rotatePoint(pivot, elem, degToRad(105));
    console.log(elem);
    ctx.fillRect(offset + elem.x, offset + elem.y, 2, 2);
  });
}
/**
 *  Returns normalized coordinates for initial line
 */

function initCoords(size){
  var points = [
    {
      x: 0.1 * size,
      y: 0.5 * size
    },
    {
      x: 0.35 * size,
      y: 0.5 * size
    },
    {
      x: 0.65 * size,
      y: 0.5 * size
    },
    {
      x: 0.9 * size,
      y: 0.5 * size
    }
  ];
  return points;
}

function rotatePoint(pivot, point, angle){
  var s = Math.sin(angle);
  var c = Math.cos(angle);
  point.x -= pivot.x;
  point.y -= pivot.y;

  var x = (point.x * c - point.y * s) + pivot.x;
  var y = (point.x * s - point.y * c) + pivot.y;

  point.x = x;
  point.y = y;

  return point;
}
function degToRad(angle){
  return angle * (Math.PI / 180);
}
window.onload = function(){
  init();
};
