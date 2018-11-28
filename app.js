var path1 = d3.select("#path1"),
    path1Length = path1.node().getTotalLength();
    path2 = d3.select("#path2"),
    path2Length = path2.node().getTotalLength(),
    ellipse = d3.select('#ellipse1'),
    ellipse2 = d3.select('#ellipse2');

// console.log(totalLength)



var dataFlow = true;
function toggleData () {
	dataFlow = !dataFlow;
	if (dataFlow) {
		transition();
	}
}

function transition(duration, updateGauge) {
    ellipse.attr('cx', null);
    ellipse.attr('cy', null);

    if (updateGauge) {
        updateGauges();
    }
    
    
    ellipse.transition()
        .duration(duration)
	    .ease("linear")
        .attrTween("transform", translateAlong(path1.node(), path1Length))
        .each("end", function() {
			console.log('end');
			if (dataFlow) {
				transition(duration, true);
			}
        });
        
    ellipse2.attr('cx', null);
    ellipse2.attr('cy', null);
    
    ellipse2.transition()
        .duration(duration)
        .ease("linear")
        .attrTween("transform", translateAlong(path2.node(), path2Length))
        .each("end", function() {
            console.log('end');
            if (dataFlow) {
                transition(duration);
            }
        });
}

// Returns an attrTween for translating along the specified path element.
function translateAlong(path, totalLength) {
  return function(d, i, a) {
		//console.log('Returning function', d, i, a)
		
    return function(t) {
			//console.log('Getting point', t)
      var p = path.getPointAtLength(t * totalLength);
      return "translate(" + p.x + "," + p.y + ")";
    };
  };
}

var gauges = [];
			
function createGauge(name, label, min, max)
{
    var config = 
    {
        size: 50,
        label: label,
        min: undefined != min ? min : 0,
        max: undefined != max ? max : 100,
        minorTicks: 5
    }
    
    var range = config.max - config.min;
    config.yellowZones = [{ from: config.min + range*0.75, to: config.min + range*0.9 }];
    config.redZones = [{ from: config.min + range*0.9, to: config.max }];
    
    gauges[name] = new Gauge(name, config);
    gauges[name].render();
}

function createGauges()
{
    createGauge("cpu-gauge-holder", "CPU");
}

function updateGauges()
{
    for (var key in gauges)
    {
        var value = getRandomValue(gauges[key])
        gauges[key].redraw(value);
    }
}

function getRandomValue(gauge)
{
    var overflow = 0; //10;
    return gauge.config.min - overflow + (gauge.config.max - gauge.config.min + overflow*2) *  Math.random();
}

function initialize() {
    var intervalValue = 2500;
    createGauges();

    updateGauges();
    transition(intervalValue);
}
