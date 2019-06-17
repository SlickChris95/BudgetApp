
var btn = document.querySelector('.submit-btn');
var des = document.querySelector('.add-name');
var val = document.querySelector('.add-value')



btn.addEventListener('click',function(){
	console.log('test');
	console.log(`${val.value} and ${des.value}`);
	console.log(typeof val.value)
	console.log(typeof des.value)
	donutData.push({name: des.value, value: val.value})
	console.log(donutData)
});









		////////////////////////////////////////////////////////////
		//////////////////////// Set-up ////////////////////////////
		////////////////////////////////////////////////////////////
		var screenWidth = window.innerWidth;

		var margin = {left: 20, top: 20, right: 20, bottom: 20},
			width = Math.min(screenWidth, 500) - margin.left - margin.right,
			height = Math.min(screenWidth, 500) - margin.top - margin.bottom;

		var svg = d3.select("#chart").append("svg")
					.attr("width", (width + margin.left + margin.right))
					.attr("height", (height + margin.top + margin.bottom))
				   .append("g").attr("class", "wrapper")
					.attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

		//////////////////////////////////////////////////////////////
		///////////////////// Data &  Scales /////////////////////////
		//////////////////////////////////////////////////////////////

		//Some random data
    //expenses would add their data here to display percentage
		var donutData = [
			{name: "Antelope", 	value: 75},
			{name: "Bear", 		value: 9},
			{name: "Cheetah", 	value: 19},
			{name: "Dolphin", 	value: 12},
			{name: "Elephant",	value: 14},
			{name: "Flamingo", 	value: 21},
			{name: "Giraffe", value: 18},
			{name: "Other", 	value: 8}
		];

		//Create a color scale
		var colorScale = d3.scale.linear()
		   .domain([1,3.5,6])
		   .range(["red", "blue", "yellow"]) //changes color of graph
		   .interpolate(d3.interpolateHcl);

		//Create an arc function
		var arc = d3.svg.arc()
			.innerRadius(width*0.75/2)
			.outerRadius(width*0.75/2 + 30);

		//Turn the pie chart 90 degrees counter clockwise, so it starts at the left
		var pie = d3.layout.pie()
			.startAngle(-90 * Math.PI/180)
			.endAngle(-90 * Math.PI/180 + 2*Math.PI)
			.value(function(d) { return d.value; })
			.padAngle(.01)
			.sort(null);

		//////////////////////////////////////////////////////////////
		//////////////////// Create Donut Chart //////////////////////
		//////////////////////////////////////////////////////////////

		//Create the donut slices and also the invisible arcs for the text
		svg.selectAll(".donutArcs")
			.data(pie(donutData))
		  .enter().append("path")
			.attr("class", "donutArcs")
			.attr("d", arc)
			.style("fill", function(d,i) {
				if(i === 7) return "#CCCCCC"; //Other
				else return colorScale(i);
			})
		.each(function(d,i) {
			//Search pattern for everything between the start and the first capital L
			var firstArcSection = /(^.+?)L/;

			//Grab everything up to the first Line statement
			var newArc = firstArcSection.exec( d3.select(this).attr("d") )[1];
			//Replace all the comma's so that IE can handle it
			newArc = newArc.replace(/,/g , " ");

			//If the end angle lies beyond a quarter of a circle (90 degrees or pi/2)
			//flip the end and start position
			if (d.endAngle > 90 * Math.PI/180) {
				var startLoc 	= /M(.*?)A/,		//Everything between the first capital M and first capital A
					middleLoc 	= /A(.*?)0 0 1/,	//Everything between the first capital A and 0 0 1
					endLoc 		= /0 0 1 (.*?)$/;	//Everything between the first 0 0 1 and the end of the string (denoted by $)
				//Flip the direction of the arc by switching the start en end point (and sweep flag)
				//of those elements that are below the horizontal line
				var newStart = endLoc.exec( newArc )[1];
				var newEnd = startLoc.exec( newArc )[1];
				var middleSec = middleLoc.exec( newArc )[1];

				//Build up the new arc notation, set the sweep-flag to 0
				newArc = "M" + newStart + "A" + middleSec + "0 0 0 " + newEnd;
			}//if

			//Create a new invisible arc that the text can flow along
			svg.append("path")
				.attr("class", "hiddenDonutArcs")
				.attr("id", "donutArc"+i)
				.attr("d", newArc)
				.style("fill", "none");
		});

		//Append the label names on the outside
		svg.selectAll(".donutText")
			.data(pie(donutData))
		   .enter().append("text")
			.attr("class", "donutText")
			//Move the labels below the arcs for those slices with an end angle greater than 90 degrees
			.attr("dy", function(d,i) { return (d.endAngle > 90 * Math.PI/180 ? 18 : -11); })
		   .append("textPath")
			.attr("startOffset","50%")
			.style("text-anchor","middle")
			.attr("xlink:href",function(d,i){return "#donutArc"+i;})
			.text(function(d){return d.data.name;});
