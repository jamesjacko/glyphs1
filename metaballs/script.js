window.onload = function(){
  var canvas = document.getElementById("canvas");
  var canvasWidth = canvas.width;
  var canvasHeight = canvas.height;
  var ctx = canvas.getContext("2d");


  document.getElementById("run").addEventListener('click', function(){
    var circle = Array();
    if(typeof inter !== "undefined")
      clearInterval(inter);
    var r;
    for (var i = 0; i < document.getElementById("balls").value; i++) {
      r = Math.round(Math.random() * 60);
      console.log(r);
      circle[i] =
        {
          x: Math.round(Math.random() * (canvasWidth - r * 2)) + r,
          y: Math.round(Math.random() * (canvasHeight - r * 2)) + r,
          r: r,
          vx: (Math.round(Math.random() * 20) + 2) * (Math.random() < 0.5)? -1 : 1,
          vy: (Math.round(Math.random() * 20) + 2) * (Math.random() < 0.5)? -1 : 1
        }

    }

    inter = setInterval(function(){

      // move ball
      for (var i = 0; i < circle.length; i++) {
        circle[i].x += circle[i].vx;
        circle[i].y += circle[i].vy;
        if (circle[i].x  + circle[i].r > canvasWidth || circle[i].x - circle[i].r <= 0) {
            circle[i].vx *= -1;
        }
        if (circle[i].y  + circle[i].r > canvasHeight || circle[i].y - circle[i].r <= 0) {
            circle[i].vy *= -1;
        }
      }



      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var threshold = document.getElementById("threshold").value;
      ctx.fillStyle = 'red';
      for (var x = 0; x < canvasWidth; x++) {
        for (var y = 0; y < canvasHeight; y++) {
          var val = 0;
          for (var i = 0; i < circle.length; i++) {
            val += metaBall(circle[i], {x: x, y: y});
          }
          if(val > threshold){
            drawCircle(ctx, {x: x, y: y, r: 1});
          }
        }
      }
    }, 10);
  })


  //drawCircle(ctx, circle1);
  //drawCircle(ctx, circle2);
}

function metaBall(center, point){
  var x = Math.pow(point.x - center.x, 2);
  var y = Math.pow(point.y - center.y, 2);
  return center.r / (Math.sqrt(x + y));
}

function drawCircle(ctx, circle){
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI, false);

  ctx.fill();
}
