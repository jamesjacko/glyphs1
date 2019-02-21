
function drawRectangle(ctx, angle){
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  if(typeof angle !== "undefined" || angle !== 0){
    ctx.rotate(degToRad(angle));
  }
  ctx.fillRect(0, 0, 10, 50);
  ctx.restore();
}





function parseGrammar(ctx, grammar){
  var re = /([0-9]*[A-Z]{1})/gi;
  gram = grammar.match(re);
  console.log(gram.length);
  gram.forEach(function(el){
    console.log(el);
  });


  // for (var i = 0; i < grammar.length; i++) {
  //   var angle = 0;
  //   switch (grammar[i]) {
  //     case "B":
  //       angle = 45;
  //       break;
  //     case "C":
  //       angle = 90;
  //       break;
  //     case "D":
  //       angle = 135;
  //     default:
  //
  //   }
  //   drawRectangle(ctx, angle);
  // }
}
function degToRad(angle){
  return angle * (Math.PI / 180);
}
window.onload = function(){
  init();
}
