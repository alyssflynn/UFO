// from data.js
var tableData = data;

// YOUR CODE HERE!

//////////////////////////////////////////////////
// HELPER FUNCTIONS

var unpack = function(d) {
  datetime = d.datetime
  city = d.city.toUpperCase()
  state = d.state.toUpperCase()
  country = d.country.toUpperCase()
  shape = d.shape
  duration = d.durationMinutes //get_minutes(d.durationMinutes)
  comments = d.comments
  values = [datetime, city, state, country, shape, duration, comments];
  return values;
};

///////////////////////////////////////////
// Functions for converting durationMinutes

var filterInt = function(value) {
  if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
    return Number(value);
  return NaN;
}

var get_minutes = function(duration) {
  // var d = filterInt(duration)
  // return d;
  var d = duration.toString()
      .replace("a ", "")
      .replace("approx", "")
      .replace("about ", "")
      .replace( /\.+/g, "")
      .replace( /:.+/g, " m")
      .replace( /min.+/g, "m" )
      .replace( /sec.+/g, "s" )
      .split(" ");
  
  var units = d.slice(1,2).toString()
      .replace("min", "m")
      .replace("sec", "s")
      .replace("hours", "h")
      .replace("hour", "h")
      // if (d.slice(1,2) == s

  if (d.slice(0,1).parseInt == typeof Number) {
      var n = Number(d.slice(0,1))
  }
  else { var n = d.slice(0,1) }
  
  return n + " " + units;

  var d = duration.toString()
      .replace( / a /g, "" )
      .replace( / about /g, "" )
      .replace( / around /g, "" )
      .replace( / an /g, "" )
      .split(" ");

  var time = d.slice(0,1).toString()

  var units = d.slice(1).toString()
      .replace( /\./g, "" ) // replace decimal points with nothing
      .replace( /min.+/g, "m" ) // replace misspelled words with mins
      .replace( /sec.+/g, "s" ) // replace misspelled words with mins
      ;
      // .split(" ");
      
  var min = d.includes("m");
  var sec = d.includes("s");

  return time + " " + units + " <--| " + d + " | " + typeof d + " | min: " + min + " sec: " + sec;
}
////////////////////////////////////////////

var get_key = function(d) { return d && d.key; };
// var get_key = function(d) { return d && d.key; };

var get_row_data = function(r) {
  datetime = d.datetime
  city = d.city.toUpperCase()
  state = d.state.toUpperCase()
  country = d.country.toUpperCase()
  shape = d.shape
  duration = d.durationMinutes //get_minutes(d.durationMinutes)
  comments = d.comments
  values = [datetime, city, state, country, shape, duration, comments];
  return values;
};

var ident = function(d) { return d; };


var filteredTable = function(key, value) {
  tableData.filter( data => {
    return data.key === value;
  });
}
///////////////////////////////////////////////////
// FILL THE TABLE
var table = d3.select("#ufo-table").select("tbody");

// Filter table dropdowns
var options = {
  datetime: [],
  city: [],
  state: [],
  country: [],
  shape: [],
  durationMinutes: []
};
tableData.forEach((d) => {
  var row = table.append("tr").attr("class", "table-row");
  Object.entries(d).forEach(([key, value]) => {
    var cell = row.append("td").attr("class", "table-data");
    cell.text(value);
    if (key in options) {
      // console.log(key, value);
      options[key].push(value);
    }
  });
});
// Filters for each header
console.log(options)
var options_set = Object.entries(options).forEach(
  ([key, value]) => {
    if (key!=='datetime') {
      var select = d3.select("form").select("ul")
      .append("li").attr("class", "filter list-group-item")
      .append("label").attr("for", key)
      .text("Choose a " + key + ":")
      .append("select").attr("class", "select")
      .attr("id", key)
      .on("change", onchange);
      
      var unique_values = [...new Set(value)];
      console.log(unique_values);
      
      var options = select.selectAll('option')
      .data(unique_values).enter()
      .append('option')
      .text((d) => { return d; });
      
      function onchange() {
        selectKey = d3.select("select").property("key")
        selectValue = d3.select("select").property("value")
        d3.select("form").select("ul")
          .append("p")
          .text(selectValue);
        table.selectAll("tr").selectAll("td")
          .data(tableData.filter( data => {
            return data.selectKey === selectValue;
          }))
          .enter()
            .text( d => {return d; } )
        data = filteredTable(selectKey, selectValue);
        console.log(data)
        update_table(data);
      }
    }
  }
)

var column_names = ["Date",	"City", "State", "Country", "Shape", "Duration", "Comments"];
// var headers = ["Date",	"City", "State", "Country", "Shape", "Duration", "Comments"];
var clicks = {city: 0, state: 0, country: 0, shape: 0, date: 0, comments: 0};

var update_table = function(data) { // loading data from server
  var table = d3.select("#ufo-table").select("tbody");

  // data bind
  var rows = table.select("tbody").selectAll("tr")
    .data( d => { return d; } );

  // enter the rows
  rows.enter().append("tr")

  // enter td's in each row
  var row_entries = rows.selectAll("td")
    .data(function(d) { 
      var arr = [];
      for (var k in d) {
        if (d.hasOwnProperty(k)) {
        arr.push(d[k]);
        }
      }
      return [arr[3],arr[1],arr[2],arr[0]];
    })
  .enter()
    .append("td")   
    
  /**  search functionality **/
    d3.select("#search")
      .on("keyup", function() { // filter according to key pressed 
        var searched_data = data,
            text = this.value.trim();
        
        var searchResults = searched_data.map(function(r) {
          var regex = new RegExp("^" + text + ".*", "i");
          if (regex.test(r.date)) { // if there are any results
            return regex.exec(r.date)[0]; // return them to searchResults
          } 
        })
	    
	    // filter blank entries from searchResults
        searchResults = searchResults.filter(function(r){ 
          return r != undefined;
        })
        
        // filter dataset with searchResults
        searched_data = searchResults.map(function(r) {
           return data.filter(function(p) {
            return p.date.indexOf(r) != -1;
          })
        })

        // flatten array 
		searched_data = [].concat.apply([], searched_data)
        
        // data bind with new data
		rows = table.select("tbody").selectAll("tr")
		  .data(searched_data, function(d){ return d.id; })
		
        // enter the rows
        rows.enter()
         .append("tr");
         
        // enter td's in each row
        row_entries = rows.selectAll("td")
            .data(function(d) { 
              var arr = [];
              for (var k in d) {
                if (d.hasOwnProperty(k)) {
		          arr.push(d[k]);
                }
              }
              return [arr[3],arr[1],arr[2],arr[0]];
            })
          .enter()
            .append("td") 

        // exit
        rows.exit().remove();
      })
    
  headers = d3.selectAll(".table-head");
  /**  sort functionality **/
  headers
    .on("click", function(d) {
      console.log(d)
      if (d == "City") {
        clicks.city++;
        // even number of clicks
        if (clicks.city % 2 == 0) {
          // sort ascending: alphabetically
          rows.sort(function(a,b) { 
            if (a.city.toUpperCase() < b.city.toUpperCase()) { 
              return -1; 
            } else if (a.city.toUpperCase() > b.city.toUpperCase()) { 
              return 1; 
            } else {
              return 0;
            }
          });
        // odd number of clicks  
        } else if (clicks.city % 2 != 0) { 
          // sort descending: alphabetically
          rows.sort(function(a,b) { 
            if (a.city.toUpperCase() < b.city.toUpperCase()) { 
              return 1; 
            } else if (a.city.toUpperCase() > b.city.toUpperCase()) { 
              return -1; 
            } else {
              return 0;
            }
          });
        }
      } 
      if (d == "State") {
        clicks.state++;
        // even number of clicks
        if (clicks.state % 2 == 0) {
          // sort ascending: alphabetically
          rows.sort(function(a,b) { 
            if (a.state.toUpperCase() < b.state.toUpperCase()) { 
              return -1; 
            } else if (a.state.toUpperCase() > b.state.toUpperCase()) { 
              return 1; 
            } else {
              return 0;
            }
          });
        // odd number of clicks  
        } else if (clicks.state % 2 != 0) { 
          // sort descending: alphabetically
          rows.sort(function(a,b) { 
            if (a.state.toUpperCase() < b.state.toUpperCase()) { 
              return 1; 
            } else if (a.state.toUpperCase() > b.state.toUpperCase()) { 
              return -1; 
            } else {
              return 0;
            }
          });
        }
      }
      if (d == "Country") {
        clicks.country++;
        // even number of clicks
        if (clicks.country % 2 == 0) {
          // sort ascending: alphabetically
          rows.sort(function(a,b) { 
            if (a.country.toUpperCase() < b.country.toUpperCase()) { 
              return -1; 
            } else if (a.country.toUpperCase() > b.country.toUpperCase()) { 
              return 1; 
            } else {
              return 0;
            }
          });
        // odd number of clicks  
        } else if (clicks.country % 2 != 0) { 
          // sort descending: alphabetically
          rows.sort(function(a,b) { 
            if (a.country.toUpperCase() < b.country.toUpperCase()) { 
              return 1; 
            } else if (a.country.toUpperCase() > b.country.toUpperCase()) { 
              return -1; 
            } else {
              return 0;
            }
          });
        }
      }
      if (d == "Shape") {
        clicks.shape++;
        // even number of clicks
        if (clicks.shape % 2 == 0) {
          // sort ascending: alphabetically
          rows.sort(function(a,b) { 
            if (a.shape.toUpperCase() < b.shape.toUpperCase()) { 
              return -1; 
            } else if (a.shape.toUpperCase() > b.shape.toUpperCase()) { 
              return 1; 
            } else {
              return 0;
            }
          });
        // odd number of clicks  
        } else if (clicks.shape % 2 != 0) { 
          // sort descending: alphabetically
          rows.sort(function(a,b) { 
            if (a.shape.toUpperCase() < b.shape.toUpperCase()) { 
              return 1; 
            } else if (a.shape.toUpperCase() > b.shape.toUpperCase()) { 
              return -1; 
            } else {
              return 0;
            }
          });
        }
      }
      if (d == "Duration") {
	    clicks.duration++;
        // even number of clicks
        if (clicks.duration % 2 == 0) {
          // sort ascending: numerically
          rows.sort(function(a,b) { 
            if (+a.duration < +b.duration) { 
              return -1; 
            } else if (+a.duration > +b.duration) { 
              return 1; 
            } else {
              return 0;
            }
          });
        // odd number of clicks  
        } else if (clicks.duration % 2 != 0) { 
          // sort descending: numerically
          rows.sort(function(a,b) { 
            if (+a.duration < +b.duration) { 
              return 1; 
            } else if (+a.duration > +b.duration) { 
              return -1; 
            } else {
              return 0;
            }
          });
        }
      } 
      if (d == "Date") {
        clicks.date++;
        if (clicks.date % 2 == 0) {
          // sort ascending: by date
          rows.sort(function(a,b) { 
            // grep date and time, split them apart, make Date objects for comparing  
	        var date = /[\d]{4}-[\d]{2}-[\d]{2}/.exec(a.date);
	        date = date[0].split("-"); 
	        var time = /[\d]{2}:[\d]{2}:[\d]{2}/.exec(a.date);
	        time = time[0].split(":");
	        var a_date_obj = new Date(+date[0],(+date[1]-1),+date[2],+time[0],+time[1],+time[2]);
          
            date = /[\d]{4}-[\d]{2}-[\d]{2}/.exec(b.date);
	        date = date[0].split("-"); 
	        time = /[\d]{2}:[\d]{2}:[\d]{2}/.exec(b.date);
	        time = time[0].split(":");
	        var b_date_obj = new Date(+date[0],(+date[1]-1),+date[2],+time[0],+time[1],+time[2]);
			          
            if (a_date_obj < b_date_obj) { 
              return -1; 
            } else if (a_date_obj > b_date_obj) { 
              return 1; 
            } else {
              return 0;
            }
          });
        // odd number of clicks  
        } else if (clicks.date % 2 != 0) { 
          // sort descending: by date
          rows.sort(function(a,b) { 
            // grep date and time, split them apart, make Date objects for comparing  
	        var date = /[\d]{4}-[\d]{2}-[\d]{2}/.exec(a.date);
	        date = date[0].split("-"); 
	        var time = /[\d]{2}:[\d]{2}:[\d]{2}/.exec(a.date);
	        time = time[0].split(":");
	        var a_date_obj = new Date(+date[0],(+date[1]-1),+date[2],+time[0],+time[1],+time[2]);
          
            date = /[\d]{4}-[\d]{2}-[\d]{2}/.exec(b.date);
	        date = date[0].split("-"); 
	        time = /[\d]{2}:[\d]{2}:[\d]{2}/.exec(b.date);
	        time = time[0].split(":");
	        var b_date_obj = new Date(+date[0],(+date[1]-1),+date[2],+time[0],+time[1],+time[2]);
			          
            if (a_date_obj < b_date_obj) { 
              return 1; 
            } else if (a_date_obj > b_date_obj) { 
              return -1; 
            } else {
              return 0;
            }
          });
        }
      }
      if (d == "Comments") {
        clicks.comments++;
	    // even number of clicks
        if (clicks.comments % 2 == 0) {
          // sort ascending: alphabetically
          rows.sort(function(a,b) { 
            if (a.comments.toUpperCase() < b.comments.toUpperCase()) { 
              return -1; 
            } else if (a.comments.toUpperCase() > b.comments.toUpperCase()) { 
              return 1; 
            } else {
              return 0;
            }
          });
        // odd number of clicks  
        } else if (clicks.comments % 2 != 0) { 
          // sort descending: alphabetically
          rows.sort(function(a,b) { 
            if (a.comments.toUpperCase() < b.comments.toUpperCase()) { 
              return 1; 
            } else if (a.comments.toUpperCase() > b.comments.toUpperCase()) { 
              return -1; 
            } else {
              return 0;
            }
          });
        }	
      }      
    }) // end of click listeners
};

// d3.select(self.frameElement).style("height", "780px").style("width", "1150px");	


// init_table(tableData);

// sort when header clicked
d3.selectAll(".table-head").on("click", function(d) {
    selection = d3.select(this)._groups["0"]["0"].firstChild.data;
    // this.value;
    // update_table();
    // order_by(selection);
    console.log(selection);
    update_table(d);
});

// filter when 'filter table' button clicked
d3.select("#filter-btn").on("click", function(d) {
    selection = d3.select("form").selectAll("input");
    // selection = this.text;
    // update_table();
    console.log(selection);
});

function filter_table(by) {
  d3.select('#filter-btn').on('click')
}