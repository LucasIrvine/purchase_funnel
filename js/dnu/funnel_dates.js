

//Grab JSON
d3.json('data/data_dates.json', function(data){


//Date wrangling
var dateArray = [],
totalCounts = [];

var format = d3.time.format("%Y-%m-%d");
//format.parse("2011-01-01");


//Find the earliest and latest dates in data
for(var b=0; b < data.funnel.length; b++){
  

  dateArray.push(data.funnel[b]);
}

console.log(data.funnel[b]);



  

});