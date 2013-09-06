 var barArr = ['awareness', 'familiarity', 'consideration', 'preference', 'purchaseIntent'],
  barClass = 'funnelBar',
  width = 600,
  height = 500,
  barX = 0,
  barW = 600,
  clipper = '#funnel';

  var svg = d3.select('#purchaseFunnel')
    .append('svg')
    .attr('width', width)
    .attr('height', height);

  svg.append('clipPath')
    .attr('id', 'funnel')
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', 'red')
    .attr('d', function(d){
      var x = 0, y = 0;
      return 'M ' + x +' '+ y + '  l 600 0 l -300 500';
    });

  svg.append('rect')
    .attr('id', barArr[0])
    .attr('class', barClass)
    .attr('x', barX)
    .attr('y', 0)
    .attr('height', 100)
    .attr('width', barW)
    .style('fill', function(){return '#ccc';})
    .attr('clip-path', 'url('+clipper+')');

  svg.append('rect')
    .attr('id', barArr[1])
    .attr('x', barX)
    .attr('y', 100)
    .attr('height', 100)
    .attr('width', barW)
    .style('fill', function(){return '#999';})
    .attr('clip-path', 'url('+clipper+')');

  svg.append('rect')
    .attr('id', barArr[2])
    .attr('class', barClass)
    .attr('x', barX)
    .attr('y', 200)
    .attr('height', 100)
    .attr('width', barW)
    .style('fill', function(){return '#666';})
    .attr('clip-path', 'url('+clipper+')');

  svg.append('rect')
    .attr('id', barArr[3])
    .attr('class', barClass)
    .attr('x', barX)
    .attr('y', 300)
    .attr('height', 100)
    .attr('width', barW)
    .style('fill', function(){return '#333';})
    .attr('clip-path', 'url('+clipper+')');

  svg.append('rect')
    .attr('id', barArr[4])
    .attr('class', barClass)
    .attr('x', barX)
    .attr('y', 400)
    .attr('height', 100)
    .attr('width', barW)
    .style('fill', function(){return '#000';})
    .attr('clip-path', 'url('+clipper+')');