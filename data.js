var csvSave;

// Risk Level Constants
var LOW_RISK = 0;
var MID_RISK = 60;
var HIGH_RISK = 100;

var STRESS_PAIN_LOW_RISK = 0;
var STRESS_PAIN_MID_RISK = 4;
var STRESS_PAIN_HIGH_RISK = 7;

// Risks
var risks = ['riskscorecoloncancer', 'riskscorediabetes', 'riskscoreheartdisease', 'riskscorelungcancer', 'riskscoreosteoporosis', 'riskscoremelanoma', 'riskscorestomachcancer', 'riskscorestroke', 'riskscoreemotionalhealth', 'riskscoreprostatecancer', 'riskscoredentalhealth', 'riskscorebreastcancer','riskscoreovariancancer','riskscoreuterinecancer', 'riskscorestresslevel', 'riskscorepainscore'];
var n = risks.length;


var riskScores = [];

for(riskIndex in risks) {
	currentRisk = risks[riskIndex];
	riskScores[+riskIndex] = {index: riskIndex, risklevel: 0, atrisk: 0, risktype: riskIndex, previousIndex: null};
	riskScores[+riskIndex + n] = {index: riskIndex + n, risklevel: 1, atrisk: 0, risktype: riskIndex, previousIndex: riskScores[+riskIndex]};
	riskScores[+riskIndex + n*2] = {index: riskIndex + n*2, risklevel: 2, atrisk: 0, risktype: riskIndex, previousIndex: riskScores[+riskIndex + n]};
}

var chart = d3.select("#chart1").append("svg").attr("class", "chart").attr("width", 800).attr("height", 420);

d3.csv('data.csv', function(csv){
	csvSave = csv;
	csv.map(function(d) {
		for(riskIndex in risks) {
			currentRisk = risks[riskIndex];
			if(riskIndex == 0) console.log(d);
			if(currentRisk == "riskscorestresslevel" || currentRisk == "riskscorepainscore") {
				if(d[currentRisk] >= STRESS_PAIN_HIGH_RISK || d[currentRisk] == -1) {
			    	riskScores[+riskIndex].atrisk += 1;
			    } else if(d[currentRisk] >= STRESS_PAIN_MID_RISK) {
			    	riskScores[+riskIndex + n].atrisk += 1;
			    } else if(d[currentRisk] >= STRESS_PAIN_LOW_RISK) {
			   		riskScores[+riskIndex + n*2].atrisk += 1;
			    }			
			} else {
				if(d[currentRisk] >= HIGH_RISK || d[currentRisk] == -1) {
			    	riskScores[+riskIndex].atrisk += 1;
			    } else if(d[currentRisk] >= MID_RISK) {
			    	riskScores[+riskIndex + n].atrisk += 1;
			    } else {
			   		riskScores[+riskIndex + n*2].atrisk += 1;
			    }
			}
	    }
	});
		
	var x = function(d, i) { return d.risktype * 50; };
	var y = function(d, i) { 
		var returnY = 300;
		var current = d;
		while(current != null) {
			returnY -= h(current, current.index);
			current = current.previousIndex;
		}
		return returnY
	
	};
	var h = function(d, i) { return d.atrisk;  };
	
	
	
	var rects = chart.selectAll("rect").data(riskScores).enter().append("rect")
	.attr("x", x).attr("y", y)
	.attr("height", h).attr("width", 50)
	.attr("class", function(d, i) { return "type" + d.risktype + " risk" + d.risklevel; })
	.on("mouseover",function(d,i) { 
		d3.selectAll(".type" + d.risktype).classed("selected", true);
	})
	.on("mouseout",function(d,i) { 
		d3.selectAll(".type" + d.risktype).classed("selected", false);
	}) 
	.on("click", function(d,i) { 
		d3.selectAll("rect").transition().duration(500).attr("transform", "translate(0 0)"); 
		d3.selectAll("rect.type" + d.risktype).transition().duration(500).attr("transform", "translate(0 20)"); 
		loadDetailChart(d.risktype); 
	});
	
	chart.selectAll("text").data(risks).enter().append("text")
	.attr("x", function(d, i) {return(25 + i*50)})
	.attr("y", 30)
	.attr("text-anchor", "middle")
	.text(function(d) {return d.replace("riskscore", "");})
	.attr("class", function(d, i) { return "type" + i + " text"; });
})


function loadDetailChart(riskType) {
	d3.select("#chart2").style("display", "block");
	d3.select("#chart2 #detailChartRiskType").text(risks[riskType].replace("riskscore", ""));
}


function transitionAge() {
  d3.selectAll("button").classed("active", false);
  d3.select("#age").classed("active", true);
}

function transitionGender() {
  d3.selectAll("button").classed("active", false);
  d3.select("#gender").classed("active", true);

/*
  stack.selectAll("g.layer rect")
    .transition()
      .duration(500)
      .delay(function(d, i) { return (i % m) * 10; })
      .attr("y", y1)
      .attr("height", function(d) { return y0(d) - y1(d); })
      .each("end", transitionEnd);

  function transitionEnd() {
    d3.select(this)
      .transition()
        .duration(500)
        .attr("x", 0)
        .attr("width", x({x: .9}));
  }*/
}

function transitionNationality() {
  d3.selectAll("button").classed("active", false);
  d3.select("#nationality").classed("active", true);
}

function transitionSmoking() {
  d3.selectAll("button").classed("active", false);
  d3.select("#smoking").classed("active", true);
}

function transitionHats() {
  d3.selectAll("button").classed("active", false);
  d3.select("#hats").classed("active", true);
}