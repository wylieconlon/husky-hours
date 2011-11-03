/* Author: 

*/

{ locations: { ... },
  tags: {
  	0: 'Dining halls',
	1: 'Residence halls',
	2: 'Classrooms',
	...
  }
}

var locations = {
	0: {
		name: 'Stetson West',
		url: 'http://...',
		parent: 3,
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
		],
		tags: [0, 10, 15]
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
}

// jQuery's onload handler
$(function() {
	
	var date = new Date();
	
	var dayOfWeek = date.getDay() - 1 % 7;
	
	for(var name in locations) {
		/*
		// Skips hidden properties of objects added by some libraries
		if(! locations.hasOwnProperty(loc)) {
			continue;
		}
		*/
		
		var loc = locations[name];

		var today = loc.hours[dayOfWeek];
		console.log(today, today.open, today.close);
		
		var row = $("<tr>");
		row.append("<td>"+name+"</td>");
		
		// loops over all days
		for(var j=0; j<loc.hours.length; j++) {
			var hours = loc.hours[j];
			
			var el = $("<td>");
			if(j == dayOfWeek) {
				el.addClass('today');
			}
			
			// loops over all open/close pairs in a day
			if(hours.length > 0) {
				var times = "";
				for(var k=0; k<hours.length; k++) {
					times += hours[k].open+"-"+hours[k].close
					if(k<hours.length-1) {
						times += ", "
					}
				}
				
				el.text(times);
			} else {
				el.text("Closed");
			}
			
			row.append(el);
		}
		
		$("#locations tbody").append(row);
	}	
});
