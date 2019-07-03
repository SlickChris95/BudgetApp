

//BUDGET CONTROLLER
let budgetController = (function(){
  //function constructor for exp and income
  const Expense = function(id, description,value,color){
    this.id = id;
    this.description = description;
    this.value = value;
    this.color = color;
  };
  const Income = function(id, description,value){
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp:0,
      inc:0,
    },
    budget: 0,
    percentage: -1
  }
  let calculateTotal = type => {
    let sum = 0;
    let x =[];

      x = data.allItems[type].map(exp => exp.value);
      if(x.length > 0){
        sum = x.reduce((a,b) => a + b);
      }else {
        sum = 0;
      }

      data.totals[type] = sum;
  }
 let deleteColor = index => color.splice(index,1);


  /* chart */

  let margin = {top: 20, right: 20, bottom: 20, left: 20},
    width = 500 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom,
    radius = width/2;
  let color = [];

  return {
    //this color is different than the color we are assigning
    chartvar: function(){
      return {
        margin: margin,
        width: width,
        height: height,
        radius: radius,
        color: color
      }
    },
    randomRGB: () => {
      // return ('rgb'+'('+ Math.floor(Math.random() * 256) +','+ Math.floor(Math.random() * 256) +',' + Math.floor(Math.random() * 256) +')');
      return (`rgb(${ Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`);
    },
    updateData: function(){
      let valueData = [];
      data.allItems['exp'].forEach(el =>
        valueData.push(el.value));
      console.log('updateData' + valueData);
      return valueData;
    },
    addItem: function(type,desc,val,color){
      let newItem, id;
      //assigns id to item
      //the last id will always be the largest
      if(data.allItems[type].length > 0){
        id = data.allItems[type][data.allItems[type].length - 1].id + 1;
      }else {
        id = 0;
      }
      if(type === 'exp'){
        newItem = new Expense(id, desc, val,color);
      }else if(type === 'inc'){
        newItem = new Income(id, desc, val);
      }
      //push it into our data structure
      data.allItems[type].push(newItem);
      return newItem;
    },
    calculateBudget: function(){
      // the percentage of our income that we have already spent
      //caluclate the total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');
      // calculate the budget: income - expense
      data.budget = data.totals['inc'] - data.totals['exp'];
      // calculate the percentage of the income that we spent
      if(data.totals.inc > 0){
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      }else {
        data:percentage = -1;
      }
    },
    getBudget: function(){
      return {
        budget: data.budget,
        totalInc:  data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      }
    },
    deleteItem: function(type,id){
      let x,index;
      // makes array of just Ids
       x = data.allItems[type].map(function(exp){
        return exp.id;
      });
      index = x.indexOf(id);
      if(index !== -1){
        //removes the element from the array
        data.allItems[type].splice(index,1);
        deleteColor(index);
      }
    },
    testing: function(){
      console.log(data);
      console.log(color);
    }
  };
})();
//UI CONTROLLER
let UIcontroller = (function(){
//put into object to make it more manageable
let DOMstrings = {
  inputType: '.add__type',
  inputDescription: '.add-name',
  inputValue: '.add-value',
  inputBtn: '.submit-btn',
  incomeContainer: '.income__list',
  expenseContainer: '.expenses__list',
  budgetLabel: '.budget__value',
  incomeLabel: '.budget__income--value',
  expensesLabel: '.budget__expenses--value',
  percentageLabel: '.budget__expenses--percentage',
  container: '.container',
  legend: '.legend'
}
return {
  getInput: function(){
    return {
      type: document.querySelector(DOMstrings.inputType).value,
      description: document.querySelector(DOMstrings.inputDescription).value,
      value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
    }

  },
  getDOMstrings: function(){
    return DOMstrings;
  },
  addListItem: function(obj,type){
    let html,newHTML,element;

    if(type === 'inc'){
      element = DOMstrings.incomeContainer;
      html = '<div class="item clearfix" id="inc-%id%"><div class="item__description"> %description% </div><div class="right clearfix"><div class="item__value">$%value%</div><div class="item__delete"><button class="item__delete--btn"><img class="icon-img" src="imgs/x-mark-4-240.png" /></button></div></div></div>';
    }else if(type === 'exp'){
      element = DOMstrings.expenseContainer;
      html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">$%value%</div><div class="item__delete"><button class="item__delete--btn"><img class="icon-img" src="imgs/x-mark-4-240.png" /></button></div></div></div>';
    }
    // replace the placeholder text with some actual data
    newHTML = html.replace('%id%',obj.id);
    newHTML = newHTML.replace('%description%', obj.description);
    newHTML = newHTML.replace('%value%', obj.value);
    // insert the html into the DOM
    document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);

  },
  addLegendItem: function(obj){
    let html,newHTML,element;
    element = DOMstrings.legend;
    html = '<div class="legend-item" id="legend-%id%"><span class="legend-box" style="background-color:%color%;"></span><p>%description%</p></div>'
    newHTML = html.replace('%id%',obj.id);
    newHTML = newHTML.replace('%description%',obj.description);
    newHTML = newHTML.replace('%color%',obj.color);
    // insert the html into the DOM
    document.querySelector(element).insertAdjacentHTML('beforeend',newHTML);
    // document.querySelector(element).insertAdjacentHTML('afterend','<p> test </p>');


  },
  clearFields: function(){
    let fields, fieldsArr;
    //this will return a nodeList
    fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' +
    DOMstrings.inputValue);
    //this allows us to clear each of the fields
    // fieldsArr = Array.prototype.slice.call(fields)
    fieldsArr = Array.from(fields)

    fieldsArr.forEach(function(current,i,Array){
        current.value = "";
    });
    //brings focus back to the description
    fieldsArr[0].focus();

  },
  displayBudget: function(budget){
    document.querySelector(DOMstrings.budgetLabel).textContent = budget.budget;
    document.querySelector(DOMstrings.expensesLabel).textContent = budget.totalExp;
    document.querySelector(DOMstrings.incomeLabel).textContent = budget.totalInc;

    if(budget.percentage > 0){
      document.querySelector(DOMstrings.percentageLabel).textContent = budget.percentage + '%';
    }else {
      document.querySelector(DOMstrings.percentageLabel).textContent = '---';

    }
  },
  deleteListItem: function(itemID){
    let el = document.getElementById(itemID);
    //we traverse one branch up from tree and then delete
    el.parentNode.removeChild(el);

  },
  deleteLegendItem: function(id){

    let el = document.getElementById("legend-" +id);
    //move up the tree and then delete removeChild
    el.parentNode.removeChild(el);
  }
}
})();

let controller = (function(budgetCtrl,UICtrl){
  let setupEventListeners = function(){
    let DOM = UICtrl.getDOMstrings();
    //when button is pressed
    document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
    //when user presses enter
    document.addEventListener('keypress',function(event){
      if(event.keyCode === 13 || event.which === 13){
        ctrlAddItem();
      }
    });
    //we set up an event listener for container which is
    // the element that income and expenses have in common
    // we did this to have event delegation, so that we
    // don't have to add an addEventListener to each item
    // we allow it to bubble up
    document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
  }

  let updateBudget = function(){
    //1.calculate the budget
    budgetCtrl.calculateBudget();
    //2.return the budget
    let budget = budgetCtrl.getBudget()
    //3.update the budget on the UI
    UIcontroller.displayBudget(budget);

  }



  let ctrlAddItem = function(){
    let input, newItem,colorPassed;
    //1.Get the filled input data
    input = UICtrl.getInput();
    //2. add the item to the budgetController
    if(input.description !== "" && !isNaN(input.value) && input.value > 0){
      if(input.type === 'exp'){
        //will  push the color so we can display graph
        colorPassed = budgetCtrl.randomRGB();
        newItem = budgetCtrl.addItem(input.type,input.description,input.value,colorPassed );
        budgetCtrl.chartvar().color.push(colorPassed);
        updateChart();
        //will update legend
        UICtrl.addLegendItem(newItem);
      }else {
        newItem = budgetCtrl.addItem(input.type,input.description,input.value);
      }
      console.log(newItem);
      //3.add the item to the UI
      UICtrl.addListItem(newItem,input.type);
      //4. clearFields
      UICtrl.clearFields();
      //5.calculate and update budget updateBudget
      updateBudget();
    }
  }
  let ctrlDeleteItem = function(event){
    let itemId, splitID,type,id;
    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
    // console.log(itemId);
    if(itemId){
      // example: inc-1
      //split turns splitID into an array
      splitID = itemId.split('-');
      type = splitID[0];
      id = parseInt(splitID[1]);

      //1. remove element from Array
      budgetCtrl.deleteItem(type,id);
      // 2. remove element from UI
      UICtrl.deleteListItem(itemId);
      // 3. update the chart 'updateData'
      if(type === 'exp'){
        console.log('deleted');
        svg.selectAll("*").remove();
        // budgetCtrl.chartvar().color.push(colorPassed);
        console.log(budgetCtrl.chartvar().color);
        updateChart();
        //delete the color from array
        //delete legendaccording to color
        UICtrl.deleteLegendItem(id);

      }
      // 4. updateBudget
      updateBudget();

    }





  }
  let width = budgetCtrl.chartvar().width;
  let height = budgetCtrl.chartvar().height;
  let radius = budgetCtrl.chartvar().radius;

  /*
  **** chart: connect with budgetCtrl with data
  */
  let svg = d3.select("#chart")//select element with id 'chart'
      .append("svg") //append an svg element to the element we've selected
      .attr("width", width) //set the width of the svg element
      .attr("height", height) //set the height of the svg element
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  let render = function(data){
    console.log(`data ${data}`);
    console.log(`colorsArr ${budgetCtrl.chartvar().color}`);
    let pies = d3.layout.pie()
      .sort(null);
    let arc = d3.svg.arc()
      .innerRadius(radius - 100)
      .outerRadius(radius - 50);
    let path = svg.selectAll('path')
      .data(pies(data));
    // let pathEnter = path.enter().append("path")
    //   .attr('fill',function(d,i)){
    //     return color[i];
    //   }.attr('d',arc);
    let pathEnter = path.enter().append("path")
        .attr("fill", function(d, i) {
            return budgetCtrl.chartvar().color[i];
            // return budgetCtrl.data.allItems.exp.color[i];
        }).attr("d", arc);
        // console.log(budgetCtrl.chartvar().color);
        console.log('changed color')
    let pathUpdate = path.attr('d',arc);
  }

  let updateChart = function(){
    render(budgetCtrl.updateData());
  }

return {
  init: function(){
    console.log('app has started');
    setupEventListeners();
  }
}

})(budgetController,UIcontroller);

controller.init();
