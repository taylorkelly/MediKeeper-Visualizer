// variable for saved csv data for later use.
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

var riskTest = [];

// Initialize risk score dictionaries
	// index - holds its index within the riskScores array
	// risklevel - high (0), medium (1), and low (2)
	// atrisk - count of the number of people at the given risk level (initialized to 0)
	// risktype - index of the risk type (based on risks array)
	// previousIndex - pointer to other risk score dictionary holding the next lower risklevel
var riskScores = [];
for(riskIndex in risks) {
	currentRisk = risks[riskIndex];
	riskScores[+riskIndex] = {index: riskIndex, risklevel: 0, atrisk: 0, risktype: riskIndex, previousIndex: null};
	riskScores[+riskIndex + n] = {index: riskIndex + n, risklevel: 1, atrisk: 0, risktype: riskIndex, previousIndex: riskScores[+riskIndex]};
	riskScores[+riskIndex + n*2] = {index: riskIndex + n*2, risklevel: 2, atrisk: 0, risktype: riskIndex, previousIndex: riskScores[+riskIndex + n]};
	
	riskTest[riskIndex] = [0,0,0];
}


// main overview chart
var chart = d3.select("#chart1").append("svg").attr("class", "chart").attr("width", 834).attr("height", 310);

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
		
	var x = function(d, i) { return 2+d.risktype * 52; };
	var y = function(d, i) { 
		var returnY = 280;
		var current = d;
		while(current != null) {
			returnY -= h(current, current.index);
			current = current.previousIndex;
		}
		return returnY;
	
	};
	var h = function(d, i) { return d.atrisk;  };
	
	/*
	// TODO - transition to better organization using layers
	var bars = chart.selectAll("g").data(riskTest).enter().append("g");
	var sections = bars.selectAll("rect").data(function(d){return d;}).enter().append("rect");
	*/
		
	chart.selectAll("rect").data(riskScores).enter().append("rect")
		.attr("x", x).attr("y", y)
		.attr("height", h).attr("width", 50)
		.attr("class", function(d, i) { return "hoverable type" + d.risktype + " risk" + d.risklevel; })
		//.attr("title", function(d, i) { return d.atrisk + "\n(" + (d.atrisk/2.57).toFixed(0) + "%)"; })
		.attr("title", function(d, i) { return d.atrisk + " employees"; })
		//.attr("title", function(d, i) { return (d.atrisk/2.57).toFixed(0) + "%"; })
		.attr("id", function(d, i) { return "type" + d.risktype + "risk" + d.risklevel; })
		.on("mouseover",function(d,i) { 
			d3.selectAll(".type" + d.risktype).classed("hovered", true);
			d3.select("#type" + d.risktype + "risk" + d.risklevel).classed("super-hovered", true);
			$("#type" + d.risktype + "risk" + d.risklevel).tooltip('show');
			$("#chart1 svg").append(this);
			/*
			var piano = document.getElementById('piano' + d.risktype);
			piano.pause();
			piano.currentTime = 0;
			piano.play();
			*/
		})
		.on("mouseout",function(d,i) { 
			d3.selectAll(".type" + d.risktype).classed("hovered", false);
			d3.select("#type" + d.risktype + "risk" + d.risklevel).classed("super-hovered", false);
		}) 
		.on("click", function(d,i) { 
			d3.selectAll("rect").transition().duration(500).attr("transform", "translate(0 0)"); 
			d3.selectAll("rect.type" + d.risktype).transition().duration(500).attr("transform", "translate(0 20)"); 
			loadDetailChart(d.risktype); 
		});
	
	chart.selectAll("text").data(risks).enter().append("text")
		.attr("x", function(d, i) {return(25 + i*50)})
		.attr("y", 10)
		.attr("text-anchor", "middle")
		.text(function(d) {return d.replace("riskscore", "");})
		.attr("class", function(d, i) { return "type" + i + " text"; });
})


function loadDetailChart(riskType) {
	$("#chart2").fadeIn();
	
	$('#detailChartRiskType').fadeOut(500, function() {
        $(this).text(risks[riskType].replace("riskscore", "")).fadeIn(500);
    });
	$(this).text(risks[riskType].replace("riskscore", "")).fadeIn(500);
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