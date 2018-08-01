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