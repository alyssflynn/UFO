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

///////////////////////////////////////////////////////////
// DROPDOWNS

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
    .append("label")
      .attr("class", "form-item__label")
      .attr("for", key)
      .text("Select a " + key + ":")
    .append("select")
      .attr("class", "form-control")
      .style("color", "#8e979f")
      .attr("id", key)
      .on("change", function(d) {
        // Filter table data
        var filterKey = this.id.toLowerCase();
        var filterVal = this.value.toLowerCase();
        newData = tableData.filter((d) => {
          return d[filterKey]==filterVal;
        });
        // Remove old data
        var rows = d3.select("tbody").selectAll("td");
        rows.remove();
        // Change properties of other dropdowns
        d3.selectAll("select")
          .style("color", "white")
          .classed("selected", false);
        select
          .style("color", "grey")
          .classed("selected", true)
          .property("selected", true);
        // Re-create table with new data
        responsiveTable(newData);
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
////////////////////////////////////////////////////////

var table = d3.select("#ufo-table");

//////////////////////////////////////////////////////
// CREATE TABLE

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
//////////////////////////////////////////////////////////////////
// INPUT

var inputTxt = d3.selectAll('input')
  .on("keyup", function() {
    // Filter data
    var filter = this.value;
    newData = tableData.filter((d) => {
      return d.datetime.includes(filter);
    });
    console.log(this, this.value, newData)
    // Remove old data
    var rows = d3.select("tbody").selectAll("td");
    rows.remove();
    // Re-create table
    responsiveTable(newData);
  });


// Remove this filter button, make a new one
d3.select("#filter-btn").remove().exit()

var filterButton = d3.select("form").append("button")
  .attr("class", "btn btn-default")
  .attr("id", "filter-btn")
  .text("Filter Table")
  .on("click", function() {
    d3.event.preventDefault();
    d3.selectAll("select")
      .style("color", "grey")
      .classed("selected", false);
    console.log("I do not like button")
  });

var resetButton = d3.select("form").append("button")
  .attr("class", "btn btn-default")
  .attr("id", "reset")
  .text("Reset")
  .on("click", function() {
    d3.event.preventDefault();
    d3.selectAll("select")
      .style("color", "grey")
      .classed("selected", false)
      .property("disabled", false)
    responsiveTable(tableData);
  });
  
responsiveTable(tableData);
