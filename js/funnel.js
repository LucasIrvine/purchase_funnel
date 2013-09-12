 var barArr = ['awareness', 'familiarity', 'consideration', 'preference', 'purchaseIntent'],
  barClass = 'funnelBar',
  width = 600,
  height = 400,
  barX = 0,
  barW = 600,
  clipper = '#funnel',
  funnelColor = d3.rgb(69, 130, 209),
  niOrange = d3.rgb(254, 183, 70),
  maxArray = [],
  arraySum = 0,
  newCountSum = [0],
  countSummer = 0;

//Create board
var svg = d3.select('#purchaseFunnel')
  .append('svg')
  .attr({
     'width' : width,
    'height' : height
  });

//Create clipping path
svg.append('clipPath')
  .attr('id', 'funnel')
  .append('path')
  .attr({
    'fill' : 'none',
       'd' : function(d){
              var x = 50, y = 0;
              return 'M ' + x +' '+ y + '  l 500 0 l -250 400';
            }
});

//Grab JSON
d3.json('data/data_raw.json', function(data){


//Find largest section
    for (var i = data.funnel.length - 1; i >= 0; i--) {
      maxArray.push(data.funnel[i].count);
      arraySum += data.funnel[i].count;
    }
    var largestSection = Math.max.apply(null, maxArray);


//Scale
    var yScale = d3.scale.linear()
      .domain([0, arraySum])
      .range([0, height]);

    for(var r=0; r < data.funnel.length; r++){
        var scaled = countSummer += yScale(data.funnel[r].count);
        newCountSum.push(scaled);
      }

//Label lines
    svg.selectAll('line')
    .data(data.funnel)
    .enter()
      .append('svg:line')
      .attr({
        'stroke-width': 2,
        'stroke' : function(d,i){return funnelColor.darker((i / 1.5));},
        "x1" : function(d,i){ return 40;},
        "y1" : function(d,i){ return Math.round(newCountSum[i] + 18);},
        "x2" : function(d,i){ return 40;},
        "y2" : function(d,i){ return Math.round(newCountSum[i] + 18);}
      })
      .style('opacity', 0)
      .transition()
      .delay(330)
      .duration(450)
      .attr("x2", 300)
      .style('opacity', 1);


// draw funnel with no height values
    svg.selectAll('rect')
      .data(data.funnel)
      .enter()
        .append('svg:rect')
        .attr({
          'id' : function(d,i){
                  return barArr[i];
                 },
          'class' : barClass,
          'x' : barX,
          'y' : '0',
          'height' : '100',
          'width' : barW
        })
        .style({
          'fill' : funnelColor,
          'stroke' : 'white',
          'stroke-width' : '2px',
          'opacity' : 0.3
        })

        .transition()
        .attr({
          'clip-path' : 'url('+clipper+')',
          'y' : function(d,i){
                  return i * 100;
                }
        });

//Transition in height values and find the largest group
    svg.selectAll('.' + barClass)
      .data(data.funnel)
        .on('mouseover', function(){
          origColor = d3.select(this).style("fill");
          d3.select(this).style("fill", niOrange);
        })
        .on('mouseout', function(){
           d3.select(this).style("fill", origColor);
        })
      .transition()
      .duration(300)
      .delay(300)
        .attr({
        'height' : function(d,i){
          return yScale(d.count);
        },
        'y': function(d,i){
          return newCountSum[i];
         }
      })
      .style({
        'fill' : function(d,i){
                  return funnelColor.darker((i / 1.5));
                },
        'stroke' : 'white',
        'stroke-width' : '2px',
        'opacity' : 1
      });

//Percentage labels
    svg.selectAll('text')
    .data(data.funnel)
    .enter()
      .append('svg:text')
      .style({
        'opacity' : 0,
        'fill' : function(d,i){
          return funnelColor.darker((i / 1.5));
        }
      })
      .transition()
      .delay(330)
      .duration(500)
      .attr({
        'x' : function(d,i){
          return 20;
        },
        'y' : function(d,i){
          return Math.round(newCountSum[i]);
        },
        "dx" : 0,
        "dy" : "1.5em",
        "text-anchor" : "middle",
        "class" : "percentLabels"
      })
      .text(function(d,i){ return Math.round(yScale(data.funnel[i].count) / 5) + '%'; })
      .style('opacity', 1);
    

/*
var infoBox = d3.select('#infoBox');
    infoBox.selectAll('div')
    .data(data.funnel)
    .enter()
      .append('div')
      .attr('id', function(d,i){
        return 'infoDiv' + i;
      })
      .html(function(d,i){ 
        return '<h4>'+d.info.title+' -'+Math.round(yScale(data.funnel[i].count) / 5) + '%'+'</h4><p>'+d.info.copy+'</p>'; 
      });



    svg.selectAll('.infoCopy')
      .data(data.funnel)
      .enter()
      .append('svg:text')
      .style('font-size', '0.9em')
      .style('width', '200px')
      .attr({
        'class' : 'infoCopy',
        'x' : function(d,i){return 525;},
        'y' : function(d,i){return 40;},
        "text-anchor" : "left"
      })
      .text(function(d,i){ return d.info.copy; });


*/

        
/*


var startDate = new Date(2012, 7, 8),
  endDate = new Date(2013, 8, 8);

  $("#slider").dateRangeSlider({
    bounds:{
      min: startDate,
      max: endDate
    },

    defaultValues:{
      min: startDate,
      max: endDate
    }
  });

*/



//Highlight the largest group
  function pointIt(el) {
     svg.select(el)
      .transition()
      .delay(1000)
      .style({
        'opacity' : 1
      });
  }




  

});