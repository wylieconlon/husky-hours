/* Author: 

*/

// sample locations
/*var locations = {
	'Stetson West': {
		hours: [
			[ {
				open: "11:00",
				close: "20:00"
			} ],
			[ {
				open: "11:00",
				close: "20:00"
			} ],
			[ {
				open: "11:00",
				close: "20:00"
			} ],
			[ {
				open: "11:00",
				close: "20:00"
			} ],
			[ {
				open: "11:00",
				close: "20:00"
			} ],
			[],
			[ {
				open: "14:00",
				close: "20:00"
			} ]
		]
	},
	'Stetson East': {
		hours: [
			[ {
				open: "07:00",
				close: "23:00"
			} ],
			[ {
				open: "07:00",
				close: "23:00"
			} ],
			[ {
				open: "07:00",
				close: "23:00"
			} ],
			[ {
				open: "07:00",
				close: "23:00"
			} ],
			[ {
				open: "07:00",
				close: "22:00"
			} ],
			[ {
				open: "08:00",
				close: "22:00"
			} ],
			[ {
				open: "08:00",
				close: "22:00"
			} ]
		]
	},
	'International Village': {
		hours: [
			[ {
				open: "07:00",
				close: "22:00"
			} ],
			[ {
				open: "07:00",
				close: "22:00"
			} ],
			[ {
				open: "07:00",
				close: "22:00"
			} ],
			[ {
				open: "07:00",
				close: "22:00"
			} ],
			[ {
				open: "07:00",
				close: "21:00"
			} ],
			[ {
				open: "08:00",
				close: "21:00"
			} ],
			[ {
				open: "08:00",
				close: "21:00"
			} ]
		]
	},
	'Fakey fakerson': {
		hours: [
			[ {
				open: "07:00",
				close: "10:00"
			},
			{
				open: "11:00",
				close: "20:00"
			} ],
			[ {
				open: "07:00",
				close: "22:00"
			} ],
			[ {
				open: "07:00",
				close: "22:00"
			} ],
			[ {
				open: "07:00",
				close: "22:00"
			} ],
			[ {
				open: "07:00",
				close: "21:00"
			} ],
			[ {
				open: "08:00",
				close: "21:00"
			} ],
			[ {
				open: "08:00",
				close: "21:00"
			} ]
		]
	}
};*/
var locations,
 	tags;

// jQuery's onload handler
$(function() {
	
	$.getJSON("http://crew-hours.ccs.neu.edu/gethours.php", renderData);
	
	function dayOfWeek() {
		var date = new Date();
		var day = date.getDay();
		return (day == 0) ? 6 : (day-1) % 7;
	}
	
	function hourToString(input) {
		var emptyTimes = /:00/g;
		var hour, minute = "", ampm;
		
		// HH:00:00 -> HH
		input = input.replace(emptyTimes, "");
		
		hour = parseInt(input.substr(0, 2));
		
		if(input.length > 2) {
			minute = input.substr(2);
		}
		
		ampm = (hour<12) ? "am" : "pm";
		
		if(hour == 0) {
			hour = 12;
		} else if(hour > 12) {
			hour -= 12;
		}
		
		return hour + minute + ampm;
	}
	
	function hoursToString(open, close) {
		// takes two pairs of HH:MM:SS formatted times
		// 
		// returns a human-readable time, like "7am-11pm"
		//
		// close may be null, which represents a 24/7 location
		
		if(close) {
			return hourToString(open) + "&#8211;" + hourToString(close);
		} else {
			return "All day";
		}
	}
		
	function renderData(data) {
		locations = data.locations;
		tags = data.tags;
		
		for(var i in locations) {
			/*
			// Skips hidden properties of objects added by some libraries
			
			if(! locations.hasOwnProperty(loc)) {
				continue;
			}
			*/
			
			var loc = locations[i],
				today = loc.hours[dayOfWeek()],
				row = $("<tr>");
			
			row.append("<td>"+loc.name+"</td>");
			
			// loops over all days
			for(var j=0; j<loc.hours.length; j++) {
				var hours = loc.hours[j];
				
				var el = $("<td>");
				
				if(j == dayOfWeek()) {
					el.addClass('today');
				}
				
				// loops over all open/close pairs in a day
				if(hours.length > 0) {
					var times = "";

					for(var k=0; k<hours.length; k++) {
						times += hoursToString(hours[k].open, hours[k].close);
						
						if(k < hours.length-1) {
							times += ", ";
						}
					}
	
					el.html(times);
				} else {
					el.text("Closed");
				}
				
				row.append(el);
			}
			
			$("#locations tbody").append(row);
		}
	}
});