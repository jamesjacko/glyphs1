// Initialize Firebase
var config = {
    apiKey: "AIzaSyAGsT8WN6gBYdZtH5DSsARPvS3kglFnRqY",
    authDomain: "glyphs-6bd12.firebaseapp.com",
    databaseURL: "https://glyphs-6bd12.firebaseio.com",
    projectId: "glyphs-6bd12",
    storageBucket: "glyphs-6bd12.appspot.com",
    messagingSenderId: "658454614320"
};
firebase.initializeApp(config);

function saveEmail(email, callback){
  console.log(email);
  var ref = firebase.database().ref("/emails");
  ref.push(email, function(error){
    if(error){

    }else{
      callback();
    }
  });
}

function sendResponse(response, type, callback){
  var ref = firebase.database().ref("/resp" + type);
  ref.push(response, function(error){
    if(error){

    }else{
      callback();
    }
  });
}

function getId(callback){
	var ref = firebase.database().ref("/id");
	var id;
	ref.transaction(function(val) {
	  return (val || 0) + 1;
	});
	ref.once('value', function(snapshot){
		id = snapshot.val();
		//ref.update(snapshot.val() + 1);
	}).then(function(){
		callback(id);
	})
}

function getGylphType(callback){
    var ref = firebase.database().ref("/types");
    var glyph;
    ref = ref.orderByValue();
    ref.limitToFirst(1).once('value', function(snapshot) {
        var count = 0;
        var smallest = 0;
        snapshot.forEach(function(ss){
            smallest = ss.val();
        });
        var smallRef = ref.equalTo(smallest);
        smallRef.once('value', function (newSS) {
            var i = 0;
            var rand = Math.floor(Math.random() * newSS.numChildren());
            newSS.forEach(function (snapshot) {
                if (i === rand) {
                    var randRef = snapshot.ref;
                    randRef = randRef.parent.ref;
                    newObj = {};
                    newObj[snapshot.key] = snapshot.val() + 1;
                    randRef.update(newObj);
                    glyph = snapshot.key;
                }
                i++;
            });
        }).then(function () {
            callback(glyph);
        });
    });
}
