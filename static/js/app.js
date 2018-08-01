// from data.js
var tableData = data;

// YOUR CODE HERE!

////////////////////////////////////////////////////
// HELPER FUNCTIONS
var get_key = function(d) { return d && d.key; };
// var get_key = function(d) { return d && d.key; };

var get_row_data = function(r) {
    // var values = {
    //     date: r.datetime,
    //     city: r.city,
    //     state: r.state,
    //     country: r.country,
    //     shape: r.shape,
    //     duration: r.durationMinutes,
    //     comments: r.comments
    // }
    values = [r.datetime, r.city, r.state, r.country, r.shape, r.durationMinutes, r.comments];
    // console.log(row_data)
    return values;
};

var ident = function(d) { return d; };

///////////////////////////////////////////////////
// FILL THE TABLE

// Select the table element
var table = d3.select("#ufo-data");

// Define function to add data
var fill = function(data) {
    var rows = table.select("tbody").selectAll("tr")
        .data(data, get_key)

    // row update
    var cells = rows.selectAll("td")
        .data(get_row_data);
    
    cells.attr("class", "update");

    // Cells enter selection
    cells.enter().append('td')
      .style('opacity', 0.0)
      .attr('class', 'enter')
      .transition()
      .delay(900)
      .duration(500)
      .style('opacity', 1.0);

    cells.text(ident);
}

// var headers = table.select("thead").selectAll("th")
//     .text("hi");

// function getData(data, filter, selection) {
//     var extData = [];
//     for(var i=0; i<data.length; i++) {
//         if (data[i][filter] == selection) { extData.push(data[i]) }
//     }
//     return extData
// }

// // Select table
// var table = d3.select("#ufo-table");

// // Fill table body
// table.select("tbody").selectAll("tr")
//     .data(tableData)
//     .enter().append("tr")
//     .selectAll("td")
//         .data(function(row, i) {
//             return (row, i);
//         })


// d3.selectAll("#filter-btn").on("click", function(d) {
//     selection = this.text;
//     updateTable();
// });

// console.log(headers)
////////////////////////////////////////////////////////////////


var column_names = ["Date",	"City", "State", "Country", "Shape", "Duration", "Comments"];
var clicks = {city: 0, state: 0, country: 0, shape: 0, date: 0, comments: 0};

// draw the table
// d3.select("body").append("div")
//   .attr("id", "container")
// {/* <input class="form-control" id="datetime" type="text" placeholder="1/11/2011"> */}

// Filter by city
d3.select("form").select("ul").append("li")
  .attr("class", "filter list-group-item")
  .append("label")
    .attr("for", "city")
    .text("Enter a City")
  .append("input")
    .attr("class", "form-control")
    .attr("id", "city")
    .attr("type", "text")
    .attr("placeholder", "Alaska");

// Filter by State
d3.select("form").select("ul").append("li")
.attr("class", "filter list-group-item")
.append("label")
    .attr("for", "state")
    .text("Enter a State")
.append("input")
    .attr("class", "form-control")
    .attr("id", "state")
    .attr("type", "text")
    .attr("placeholder", "Anchorage");

// Filter by Country
d3.select("form").select("ul").append("li")
.attr("class", "filter list-group-item")
.append("label")
    .attr("for", "country")
    .text("Enter a Country")
.append("input")
    .attr("class", "form-control")
    .attr("id", "country")
    .attr("type", "text")
    .attr("placeholder", "US");

// Filter by shape
d3.select("form").select("ul").append("li")
.attr("class", "filter list-group-item")
.append("label")
    .attr("for", "shape")
    .text("Enter a shape")
.append("input")
    .attr("class", "form-control")
    .attr("id", "country")
    .attr("type", "text")
    .attr("placeholder", "light");
    
  
var table = d3.select("#ufo-table").select("table");

var headers = table.select("thead").selectAll("th")
    .data(column_names)
  .enter()
    .text(function(d) { return d; });

var trows = table.select("tbody").selectAll("tr")
    .data(tableData)
    .enter().append("td")
        .text(function(d) {
            console.log("hi", d);
            return d;
        });


var rows, row_entries, row_entries_no_anchor, row_entries_with_anchor;
  
var update_table = function(data) { // loading data from server
  
  var table = d3.select("#ufo-table").select("table");

  // draw table body with rows
  //table.append("tbody");

  // data bind
  rows = table.select("tbody").selectAll("tr")
    .data(data, function(d){ return d; });
    // .enter().append("tr");
  
  // enter the rows
  rows.enter().append("tr")
  
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

  // draw row entries with no anchor 
  row_entries_no_anchor = row_entries.filter(function(d) {
    return (/https?:\/\//.test(d) == false)
  })
  row_entries_no_anchor.text(function(d) { return d; })

  // draw row entries with anchor
  row_entries_with_anchor = row_entries.filter(function(d) {
    return (/https?:\/\//.test(d) == true)  
  })
  row_entries_with_anchor
    .append("a")
    .attr("href", function(d) { return d; })
    .attr("target", "_blank")
  .text(function(d) { return d; })
    
    
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

        // draw row entries with no anchor 
        row_entries_no_anchor = row_entries.filter(function(d) {
          return (/https?:\/\//.test(d) == false)
        })
        row_entries_no_anchor.text(function(d) { return d; })

        // draw row entries with anchor
        row_entries_with_anchor = row_entries.filter(function(d) {
          return (/https?:\/\//.test(d) == true)  
        })
        row_entries_with_anchor
          .append("a")
          .attr("href", function(d) { return d; })
          .attr("target", "_blank")
        .text(function(d) { return d; })
        
        // exit
        rows.exit().remove();
      })
    
  /**  sort functionality **/
  headers
    .on("click", function(d) {
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
      if (d == "Created On") {
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


function get_row_data(r) {
    row_data = [r.datetime, r.city, r.state, r.country, r.shape, r.durationMinutes, r.comments];
    row_obj = { 
        date: r.datetime,
        city: r.city,
        state: r.state,
        country: r.country,
        shape: r.shape,
        duration: r.durationMinutes,
        comments: r.comments
    }
    // console.log(row_data);
    return row_data;

};


function add_row(r) {
    // console.log(r)
    var date = r.datetime;
    var city = r.city;
    var state = r.state;
    var country = r.country;
    var shape = r.shape;
    var duration = r.durationMinutes;
    var comments = r.comments;
    row_data = [r.datetime, r.city, r.state, r.country, r.shape, r.durationMinutes, r.comments];
    // console.log(row_data)
    var row = d3.select("#ufo-table").select("tbody").append("tr")
        .attr("class", "table-row");
    row.enter().append("td")
        .attr("class", "table-data")
        .text(row_data);

};

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

function init_table(td) {
    var table = d3.select("#ufo-table").select("tbody");

    var rows = table.selectAll("tr")
        .data(data, get_key);

    td.forEach(function(d) {
        console.log(d, unpack(d))
        // Create row
        var new_row = table.append("tr").attr("class", "table-row");

        // Fill cells in row
        var new_cell = unpack(d).forEach(function(d) {
            new_row.append("td")
            .attr("class", "table-data")
            .text(d);
        });

        // var new_cell = new_row.append("td").attr("class", "table-data")
        //     //.attr("id", "ufo-datetime")
        //     .text(d.datetime);
        // var new_cell = new_row.append("td").attr("class", "table-data")
        //     .text(d.city);
        // var new_cell = new_row.append("td").attr("class", "table-data")
        //     .text(d.state);
        // var new_cell = new_row.append("td").attr("class", "table-data")
        //     .text(d.country);
        // var new_cell = new_row.append("td").attr("class", "table-data")
        //     .text(d.shape);
        // var new_cell = new_row.append("td").attr("class", "table-data")
        //     .text(d.durationMinutes);
        // var new_cell = new_row.append("td").attr("class", "table-data")
        //     .text(d.comments);
    });
};

init_table(tableData);

// sort when header clicked
d3.selectAll(".table-head").on("click", function(d) {
    selection = d3.select(this)._groups["0"]["0"].firstChild.data;
    // this.value;
    // update_table();
    // order_by(selection);
    console.log(selection);
});

// filter when 'filter table' button clicked
d3.select("#filter-btn").on("click", function(d) {
    selection = d3.select("form").selectAll("input");
    // selection = this.text;
    // update_table();
    console.log(selection);
});