function getObject(itemLength, range, groups){
    var obj = {
        name: "student",
        groups: [
            0, 1, 2
        ],
        values: []
    };
    for(var i = 0; i < itemLength; i++){
        var value = {
            name: "l" + i,
            min: 0,
            max: 100,
            value: Math.round(Math.random() * (range.max - range.min) + range.min),
            group: i % groups,
            correct: range.max === 40
        };
        obj.values.push(value);

    }
    return obj;
}

function getRanges(numObjects, targetNumber){
    var ranges = [];
    for(var i = 0; i < numObjects; i++){
        ranges .push({
            min: i < targetNumber? 1: 41,
            max: i < targetNumber? 40: 100
        });
    }
    return shuffleArray(ranges);
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getObjects(num, corrNum){
    var objs = [];
    var ranges = getRanges(num, corrNum);
    for(var i = 0; i < num; i++){
        objs.push(getObject(9, ranges[i], 3));
    }
    return objs;
}

function setupObjects(objectCount){
    var correctObjectCount = 5;
    return getObjects(objectCount, correctObjectCount);;
}