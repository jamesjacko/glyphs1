class surveyData{
  this.data = [];
  constructor(num, numLow){
    for (var i = 0; i < num; i++) {
      let object = {
        size: {
          width: 100,
          height: 100,
          padding: 10
        },
        name: "student",
        groups: [
          0, 1, 2
        ],
        values:[
        ]
      }
      for (var j = 0; j < 8; j++) {
        object.values.(push{
          key: j,
          value: numLow-- > 0? (Math.random * 40) / 100: (Math.random * 40 + 60) / 100
        })
      }
    }
  }
}
