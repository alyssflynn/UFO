// from data.js
var tableData = data;

// YOUR CODE HERE!
////////////////////////////////////////////

var filterInt = function(value) {
  nums = [];
  nArr = Array.from(value)
  nArr.forEach(n => {
    if (/^(\-|\+)?([0-9]+|Infinity)$/.test(n)) { nums.push(Number(n)); };
  })
  return nums;
}

var filterInt1 = function(value) {
  if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
    return Number(value);
  return NaN;
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function formatHeader(d) { 
  if (d==='durationMinutes') {
    return toTitleCase(d.slice(0,8));
  }
  return toTitleCase(d); 
};

function formatCellText(d) {
  if (d.column==="city" || d.name==="city") {
    return toTitleCase(d.value);
  } else if (d.column==="state" || d.column==="country" || d.name==="state" || d.name==="country") {
    return d.value.toUpperCase();
  } else if (d.column==="duration" || d.name==="duration") {
    t = filterInt(d.value)
    if (t===NaN) { return d.value; }
    else { return t; }
  } else { return d.value; };
}

function timeCompare(a, b) {
  return a > b ? 1 : a == b ? 0 : -1;
}

function stringCompare(a, b) {
  a = a.toLowerCase();
  b = b.toLowerCase();
  return a > b ? 1 : a == b ? 0 : -1;
}

function filter_data(data, key, value) {
  var filteredData = data.filter( d => {
    return d[key]===value;
  })
  return filteredData;
}

var selectedFilters = {
  datetime: null,
  city: null,
  state: null,
  country: null,
  shape: null,
  durationMinutes: null,
};
var addFilter = (d) => {
  selectedFilters[d.k] = d.v;
  return selectedFilters;
}

///////////////////////////////////////////////////



///////////////////////////////////////////////////////////
// ADD FILTER DROPDOWNS

// Array object with unique values for each dropdown
var dropdown_options = {
  city: [...new Set(data.map(d => toTitleCase(d.city)).sort())],
  state: [...new Set(data.map(d => d.state.toUpperCase()).sort())],
  country: [...new Set(data.map(d => d.country.toUpperCase()).sort())],
  shape: [...new Set(data.map(d => d.shape.toLowerCase()).sort())] 
  };

// Add a dropdown for each array in object
var dropdowns = Object.entries(dropdown_options).forEach(([key, values]) => {
  // console.log("adding dropdowns");
  var select = d3.select("form").select(".form-group").select("ul")
    .append("li")
      .attr("class", "filter list-group-item")
      .style("display", "inline")
    // .append('div')
    //   .attr("class", "form-item")
    .append("label")
      .attr("class", "form-item__label")
      .attr("for", key)
      .text("Select a " + key + ":")
    .append("select")
      .attr("class", "form-control")
      .style("color", "#8e979f")
      // .attr("class", "form-control form-item__element form-item__element--select")
      .attr("id", key)
      // .property(require)
      .on("change", function(d) {
        console.log(this);
        console.log(this.selected);
        select.property("selected", true);
        console.log(this.selected);
        select.property("selected", this.value);
        console.log(this.selected);
        select.property("selected", [this.value, this.id]);
        console.log(this.selected);

        console.log(this.id, this.value);
        select.attr("value", this.value);
        console.log(this.id, this.value);
        // select.property("disabled", true);
        console.log(arguments);
        console.log(arguments[2][0][0].firstChild.data);
      });
  // Fill option list
  var defaultOption = '-';
  var options = select.selectAll('option')
      .data(["-", ...values])
    .enter()
      .append('option')
        .attr("class", "form-control")
        .attr("type", "text")
        .style("fill", "#8e979f")
        .property("value", (d) => { return d; })
        .property("selected", (d) => {return d===defaultOption; })
        .text((d) => { return d; });
});
//////////////////////////////////////////////////////////

// Create dynamic table
function responsiveTable(data) {
    // Clear table
    d3.select("thead").remove().exit();
    d3.select("#ufo-table").select("tbody").selectAll("tr").remove().exit();
    
    // Create table
    var table = d3.select("#ufo-table");

    // Create sortable headers
    var sortAscending = true;
    var titles = Object.keys(data[0]);
    var headers = table.append('thead').append('tr').selectAll('th')
      .data(titles).enter()
      .append('th')
        .text((d) => { return formatHeader(d); })
        .on('click', (d) => {
          headers.attr('class', 'header');
          if (d == "Duration") { 
            rows.sort((a, b) => {
              return a==null || b==null ? 0 : timeCompare(a[d], b[d]);
            });
          } else if (sortAscending) {
            rows.sort((a, b) => { 
              return a==null || b==null ? 0 : stringCompare(a[d], b[d]);
            });
            sortAscending = false;
            this.className = 'aes';
          } else {
            rows.sort((a, b) => { 
              return a==null || b==null ? 0 : stringCompare(b[d], a[d]); 
            });
            sortAscending = true;
            this.className = 'des';
          }
        });

    // Bind data
    var rows = table.select('tbody').selectAll('tr')
      .data(data).enter()
      .append('tr');

    // Fill rows with data
    rows.selectAll('td')
      .data((d) => {
          return titles.map((k) => {
            return { 'value': d[k], 'name': k };
          });
      }).enter()
      .append('td')
        .attr('data-th', (d) => { return d.name; })
        .text((d) => { return formatCellText(d); });
};


function filter_selected() {
  console.log(this.id, this.value);
  if (this.value !== '-') { 
    // Get selection
    var filter_key = this.id.toLowerCase();
    var filter_val = this.value.toLowerCase();

    // Filter data
    newData = data.filter((d) => {
      return d[filter_key]===filter_val;
      // filters = addFilter( { k: filterKey, v: filterVal } );
    });
    console.log(data);

  // Update table
  // var rows = d3.select("#ufo-table").select("tbody").selectAll("tr")
  //   .data(newData).enter()
  //   .append("tr");
  
  // rows.filter((d) => { return d; })
  
  // Reset dropdowns
  // d3.select('form').selectAll('option').selectAll('text').remove().exit();
  // d3.select('form').selectAll('option').remove().exit();
  
  // Clear old data
  // var oldData = d3.select("#ufo-table").select("tbody").selectAll("tr");
  // oldData.remove().exit();
  
  // Update table with new data
  responsiveTable(newData);
  // responsiveTable(newData, update=true);
  }
}
// };

function filter_table(data, key, value) {
  console.log(data);
}

// Initialize table
responsiveTable(tableData, init=true);


var inputElems = d3.selectAll('input')
  .on("submit", function() {
    alert(this.value);
  });

// var filterElems = d3.selectAll('.filter.list-group-item')
//   .on("change", function() {
//     console.log(this.value);
//     // alert(this.value);
//   });

// Remove this filter button, make a new one
d3.select("#filter-btn").remove().exit()

var filterButton = d3.select("form").append("button")
  .attr("class", "btn btn-default")
  .attr("id", "filter-btn")
  .text("Filter Table")
  .on("click", function() {
    d3.event.preventDefault();

    var selected = d3.selectAll("select[type=option]").selected(true)
    console.log(selected);

    console.log(arguments);
    var f = d3.selectAll("input");
    console.log(f);
    // f.property("disabled", true);
    var thing = d3.selectAll("select").property("selected", true);
  });

var resetButton = d3.select("form").append("button")
  .attr("class", "btn btn-default")
  .attr("id", "reset")
  .text("Reset")
  .on("click", function() {
    console.log('.');
  });


// d3.selection.prototype.selected = function(value) {
//   console.log(value);
//   console.log(arguments, arguments.length)
//   return arguments.length < 1
//     ? this.property("selected")
//     : this.property("selected", !!value);
// };

// d3.selectAll("select[type=option]").selected(true)
//   .on("change", (d) => {
//     console.log(this);
//     console.log(d);
//     d3.select(this).property("disabled", true);
//   });


d3.selectAll('select').on("click", function() {
  d3.select(this).style("color", "lightgrey");
});

// console.log(d3.selectAll("select[type=option]").selected(true));

// d3.select('select').classList.append('has-placeholder');
// document.querySelector('select').classList.add('has-placeholder');

// d3.select('select').on("change", (e) => {
//   e.currentTarget.classList.remove('has-placeholder');
// });
// document.querySelector('select').addEventListener('change', (e) => {
  // e.currentTarget.classList.remove('has-placeholder');
// });

// filter when 'filter table' button clicked
// var filterButton = d3.select("#filter-btn").on("click", function(d) {
  // d3.event.preventDefault();
  // console.log(d);
