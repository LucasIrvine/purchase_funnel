 
var pFunnel = {
  barArr : ['awareness','familiarity','consideration','preference','purchaseIntent'],
  barClass : 'funnelBar',
  width : 1000,
  height : 400,
  barX : 0,
  barW : 600,
  clipper : '#funnel',
  color : d3.rgb(69, 130, 209),
  maxArray : [],
  arraySum : 0,
  newCountSum : [0],
  countSummer : 0,
  svg : d3.select('#purchaseFunnel')
      .append('svg')
      .attr({
         'width' : this.width,
        'height' : this.height
      }),

  drawBoard : function(){
    //Create clipping path
    this.svg.append('clipPath')
      .attr('id', 'funnel')
      .append('path')
      .attr({
        'fill' : 'none',
           'd' : function(d){
                  var x = 50, y = 0;
                  return 'M ' + x +' '+ y + '  l 500 0 l -250 400';
                }
    });

    this.initiate();
  },



  initiate : function(){

      d3.json('data/data_raw.json', function(data){

      for (var i = data.funnel.length - 1; i >= 0; i--) {
          pFunnel.maxArray.push(data.funnel[i].count);
          pFunnel.arraySum += data.funnel[i].count;
        }
        
        pFunnel.largestSection = Math.max.apply(null, pFunnel.maxArray);

        var yScale = d3.scale.linear()
          .domain([0, pFunnel.arraySum])
          .range([0, pFunnel.height]);

        for(var r=0; r < data.funnel.length; r++){
            var scaled = pFunnel.countSummer += yScale(data.funnel[r].count);
            pFunnel.newCountSum.push(scaled);
          }

    
        pFunnel.svg.selectAll('rect')
          .data(data.funnel)
          .enter()
            .append('svg:rect')
            .attr({
              'id' : function(d,i){
                      return pFunnel.barArr[i];
                     },
              'class' : pFunnel.barClass,
              'x' : pFunnel.barX,
              'y' : '0',
              'height' : '100',
              'width' : pFunnel.barW
            })
            .style({
              'fill' : pFunnel.color,
              'stroke' : 'white',
              'stroke-width' : '2px',
              'opacity' : 0.3
            })
            .transition()
            .attr({
              'clip-path' : 'url('+pFunnel.clipper+')',
              'y' : function(d,i){
                      return i * 100;
                    }
            });

    
        pFunnel.svg.selectAll('.' + pFunnel.barClass)
          .data(data.funnel)
          .transition()
          .duration(300)
          .delay(300)
            .attr({
            'height' : function(d,i){
              return yScale(d.count);
            },
            'y': function(d,i){
              return pFunnel.newCountSum[i];
             }
          })
          .style({
            'fill' : function(d,i){
                      return pFunnel.color.darker((i / 1.5));
                    },
            'stroke' : 'white',
            'stroke-width' : '2px',
            'opacity' : 1
          });

    
        pFunnel.svg.selectAll('text')
        .data(data.funnel)
        .enter()
          .append('svg:text')
          .style({
            'opacity' : 0,
            'fill' : function(d,i){
              return pFunnel.color.darker((i / 1.5));
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
              return Math.round(pFunnel.newCountSum[i]);
            },
            "dx" : 0,
            "dy" : "1.5em",
            "text-anchor" : "middle",
            "class" : "percentLabels"
          })
          .text(function(d,i){ return Math.round(yScale(data.funnel[i].count) / 5) + '%'; })
          .style('opacity', 1);
        
    
        pFunnel.svg.selectAll('line')
        .data(data.funnel)
        .enter()
          .append('svg:line')
          .attr({
            'stroke-width': 2,
            'stroke' : function(d,i){return pFunnel.color.darker((i / 1.5));},
            "x1" : function(d,i){ return 40;},
            "y1" : function(d,i){ return Math.round(pFunnel.newCountSum[i] + 18);},
            "x2" : function(d,i){ return 40;},
            "y2" : function(d,i){ return Math.round(pFunnel.newCountSum[i] + 18);}
          })
          .style('opacity', 0)
          .transition()
          .delay(330)
          .duration(450)
          .attr("x2", 300)
          .style('opacity', 1);

    });
  }
};



pFunnel.initiate();
