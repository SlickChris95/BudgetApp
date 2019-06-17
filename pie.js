var addName = document.querySelector('.add-name');
var addValue = document.querySelector('.add-value');
var submitBtn = document.querySelector('.submit-btn');



/* inserts our data into the an array
   and updares chart
   */
submitBtn.addEventListener('click',function(){
  var name = addName.value
  var num = parseInt(addValue.value);
  dataset.push({name: name , value: num});
  console.log(dataset);
  color.push(randomRGB());
  update();

});

var dataset = [
  // {name:"a", value: 40},
  // {name:"b", value:20},
  // {name:"c", value:10},
  // {name:"d", value:3}
];

// keeps track of our data values;
// in order to all to the graph
var updateData = function(){
  var valueData = [];
  dataset.forEach(function(el){
    valueData.push(el.value);
  });
  return valueData;
}


var margin = {top: 20, right: 20, bottom: 20, left: 20},
  width = 500 - margin.right - margin.left,
  height = 500 - margin.top - margin.bottom,
  radius = width/2;

// 0 to 255
var random = Math.floor(Math.random() * 256)
var randomRGB = function(){
  return ('rgb'+'('+ Math.floor(Math.random() * 256) +','+ Math.floor(Math.random() * 256) +',' + Math.floor(Math.random() * 256) +')');
}

var color = [randomRGB(),randomRGB(),randomRGB(),randomRGB()];
// we could make a function that produces random color

var svg = d3.select("#chart")//select element with id 'chart'
    .append("svg") //append an svg element to the element we've selected
    .attr("width", width) //set the width of the svg element
    .attr("height", height) //set the height of the svg element
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

function render(data) {
    var pies = d3.layout.pie()
        .sort(null);

    var arc = d3.svg.arc()
        .innerRadius(radius - 100)
        .outerRadius(radius - 50); //size of overall chart

    var path = svg.selectAll("path")
        .data(pies(data));
    var tooltip = d3.select('#chart') // select elem in dom with #Chart
    .append('div')
    .attr('class','tooltip');// add class 'tooltip' to the divs we just selescted

/* with transition */
    var pathEnter = path.enter().append("path")
        .attr("fill", function(d, i) {
            return color[i];
        }).attr("d", arc).transition().delay(function(d,i){
          return i * 500;
        }).duration(500).attrTween('d',function(d){
          var i = d3.interpolate(d.startAngle+0.1, d.endAngle);
		        return function(t) {
			      d.endAngle = i(t);
			      return arc(d)
        }}).delay(1000);


      // var pathEnter = path.enter().append("path")
      //       .attr("fill", function(d, i) {
      //           return color[i];
      //     }).attr("d", arc);

    var pathUpdate = path.attr("d", arc);

}

render(updateData());

// setInterval(function() {
//     update();
// }, 2000);

function update() {

    // valueData = [Math.random() * 50, Math.random() * 50, Math.random() * 50 , Math.random() * 50];
    // dataset.forEach(function(data){
    //   data.value = (Math.floor(Math.random() * 50));
    // });
    render(updateData());
}
