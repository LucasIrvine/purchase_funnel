 var barArr = ['awareness', 'familiarity', 'consideration', 'preference', 'purchaseIntent'],
  barClass = 'funnelBar',
  width = 1000,
  height = 500,
  barX = 0,
  barW = 700,
  clipper = '#funnel';

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
              return 'M ' + x +' '+ y + '  l 600 0 l -300 500';
            }
});

//Grab JSON
d3.json('data_raw.json', function(response){
  funnel(response);
});

var funnelColor = d3.rgb(69, 130, 209),
  maxArray = [],
  arraySum = 0;

var funnel = function(data){

  // find largest section
  for (var i = data.funnel.length - 1; i >= 0; i--) {
    maxArray.push(data.funnel[i].height);
    arraySum += data.funnel[i].height;
  }

  
  //Scale
  var yScale = d3.scale.linear()
    .domain([0, arraySum])
    .range([0, height]);
  

  var largestSection = Math.max.apply(null, maxArray);

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
    .transition()
    .duration(300)
    .delay(300)
    .attr({
      'height' : function(d,i){
        if(d.height === largestSection){
          var highest = '#' + this.id;
          pointIt(highest);
          return d.height;
        } else {
          return d.height;
        }
      },
      'y': function(d,i){
         return d.top;
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

    showLabels(data.funnel);
};

var showLabels = function(json){
  svg.selectAll('text')
  .data(json)
  .enter()
    .append('svg:text')
    .style({
      'opacity' : 0,
      'fill' : function(d,i){
        return funnelColor.darker((i / 1.5));
      }
    })
    .transition()
    .delay(600)
    .duration(300)
    .attr({
      'x' : function(d,i){
        return i * 60;
      },
      'y' : function(d,i){
        return (d.top + 15);
      },
      "dx" : 0,
      "dy" : "1.5em",
      "text-anchor" : "left",
      "class" : "percentLabels"
    })
    .text(function(d,i){ return (d.height / 5) + '%'; })
    .style('opacity', 1)
  
    labelLines(json);
};

var labelLines = function(json){
  svg.selectAll('line')
  .data(json)
  .enter()
    .append('svg:line')
    .attr({
      'stroke-width': 2,
      'stroke' : function(d,i){return funnelColor.darker((i / 1.5));},
      "x1" : function(d,i){ return (i * 60) + 40;},
      "y1" : function(d,i){ return (d.top + 35);},
      "x2" : function(d,i){ return (i * 60) + 40;},
      "y2" : function(d,i){ return (d.top + 35);}
    })
    .style('opacity', 0)
    .transition()
    .delay(600)
    .duration(600)
    .attr("x2", 350)
    .style('opacity', 1);

    blockSummary(json);
};

var blockSummary = function(json){
  svg.selectAll('.infoHeading')
    .data(json)
    .enter()
    .append('svg:text')
    .attr({
      'class' : 'infoHeading',
      'x' : function(d,i){return 650 - (i * 58);},
      'y' : function(d,i){return d.top + 20;},
      "text-anchor" : "left"
    })
    .style('font-size', '1.1em')
    .text(function(d,i){ return d.info.title + ' - ' + d.height / 5 + '%'; });

     svg.selectAll('.infoCopy')
      .data(json)
      .enter()
      .append('svg:text')
      .style('font-size', '0.9em')
      .attr('class', 'infoCopy')
      .attr('x', function(d,i){
        return 650 - (i * 58);
      })
      .attr('y', function(d,i){
        return d.top + 40;
      })
      .attr("text-anchor", "left")
      .text(function(d,i){ return d.info.copy; });


  
};

//Highlight the largest group
function pointIt(el) {
   svg.select(el)
    .transition()
    .delay(1000)
    .style({
      'opacity' : 1
    });
}

