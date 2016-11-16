var svg;

$(document).ready(function(){	
	// Function reference, referencing the paiting tool currently selected
	// This is set to polyline by the end of the file, but we couldnt set it yet
	var current_tool;
	// Color to paint with
	var color = "black";	
	// Reference to the marker object, that is used to preview objects before finished
	var current_marker = null;
	// Stores if the mouse is down or not
	var mouseisdown = false;
	// Startx and Starty, for drag paiting tools, such as rect
	var startx = 0; // used by varius tools such as rect
	var starty = 0;
	// The history of points, for tools such as polygon and penn	
	var points_history = "";
	// Reference to the svg object we paint on
	svg = document.getElementsByTagName('svg')[0]; //Get svg element
	
	
	
	
	// Avoid annoying bouncing feature on ipad
	// http://stackoverflow.com/questions/16048155/how-to-stop-elastic-scrolling-aka-scroll-bounce-aka-page-overscroll-effect-on
	$(document).bind("touchmove",function(e) {
		e.preventDefault();
	});
	
	$("#center").on("vmousedown",function(event) {
		// Prevent unwanted drag and drop of svg objects
		return false;
	});
  
  /*
   * Mouse+touch handlers, vmouseup, vmousedown, vmousemove
   * Those calculates the x and y i the painting area(#center) and calls the current_tool, with the information
   */
  $("svg").on("vmousedown", function(event) {
	  mouseisdown=true;
	  var offset = $("#center").offset();
	  var x=event.pageX-offset.left;
	  var y = event.pageY-offset.top;
	  current_tool("mousedown",x,y,null);
  });
  $("svg").on("vmouseup",function(event) {
	  mouseisdown=false;
	  var offset = $("#center").offset();
	  var x=event.pageX-offset.left;
	  var y = event.pageY-offset.top;
	  current_tool("mouseup",x,y,null);
  });  
  $("svg").on("vmousemove",function(event){
	  var offset = $("#center").offset();
	  var x = event.pageX-offset.left;
	  var y = event.pageY-offset.top;
	  current_tool("mousemove",x,y,null);
  });
  
  // Event handler for circle tool
  $("#circle").on("vmousedown",function() {
	current_tool("tool_end");
	current_tool=tool_circle;
  });

  // Event handler for flower tool  
  $("#flower").on("vmousedown",function() {
	current_tool("tool_end");
	current_tool=tool_flower;
  });
  
  // Event handler for circle tool
  $("#square").on("vmousedown",function() {
	current_tool("tool_end");
	current_tool=tool_rect;
  });
  
  // Event handler for pen tool
  $("#pen").on("vmousedown",function() {
	current_tool("tool_end");
	current_tool=tool_polyline;
  });

  // Event handler for polygon tool
  $("#polygon").on("vmousedown",function() {
	current_tool("tool_end");
	// Clears the points history
	points_history="";
	current_tool=tool_polygon;
  });
  
  $("#polylinefill").on("vmousedown",function() {
	current_tool("tool_end");
	// Clears the points history
	points_history="";
	current_tool=tool_polylinefill;
  });
  
  // Event handler for new document
  $("#new").on("vmousedown",function() {
	 points_history="";
	 $("svg").empty(); 
  });
  
  // Description of how the eraser tool works
  $("#eraser").on("vmousedown",function() {
	current_tool("tool_end");
	  // This must be done here, to attach the event to all newly created svg objects
	 $(".svgobject").on("vmousemove",function(event){
		 current_tool("mousemove",0,0,$(this));
	});
	$(".svgobject").on("vmousedown",function(event){
		current_tool("mousedown",0,0,$(this));
	});
	current_tool=tool_eraser;
  });

  // Event handler for undo
  $("#undo").on("vmousedown",function() {
	  // Tips from 
	  // http://stackoverflow.com/questions/3674265/is-there-an-easy-way-to-clear-an-svg-elements-contents
	  current_tool("tool_end");
	  
	  if(current_marker != null) {
		  $(current_marker).remove();
		  current_marker = null;
	  }
	  svg.removeChild(svg.lastChild);
  });

  //   Description of the pen tool
  function tool_pen(action,x,y) {
	if(!mouseisdown) {
		  return;
	}
	// http://stackoverflow.com/questions/16488884/add-svg-element-to-existing-svg-using-dom	
	var offset = $(this).offset();
	svg_circle(x,y, 5, color, color);
  }
  
  // Description of the rect tool
  function tool_rect(action,x,y) {
		var x1=0;
		var y1=0;
		var x2=0;
		var y2=0;
		if(startx < x) {
			x1 = startx;
			x2= x;
		} else {
			x1= x;
			x2 = startx;
		}
		
		if(starty < y) {
			y1 = starty;
			y2 = y;
		} else {
			y1= y;
			y2 = starty;
		}
		var twidth=x2-x1;
		var theight=y2-y1;
	switch(action) {
		case "mousedown":
			startx=x;
			starty=y;
		break;
		case "mousemove":
			if(mouseisdown) {
				$(current_marker).remove();
				current_marker=svg_rect(x1,y1,twidth,theight,color,color);
			}
				a=2
			a=2
		break;
		case "mouseup":
			svg_rect(x1,y1,twidth,theight,color,color);
		break;
		
	}
  }
  
  // Description of the circle tool
  function tool_circle(action,x,y) {
		var x1=0;
		var y1=0;
		var x2=0;
		var y2=0;
		if(startx < x) {
			x1 = startx;
			x2= x;
		} else {
			x1= x;
			x2 = startx;
		}
		
		if(starty < y) {
			y1 = starty;
			y2 = y;
		} else {
			y1= y;
			y2 = starty;
		}
		var twidth=x2-x1;
		var theight=y2-y1;	  
	  
		switch(action) {
			case "mousedown":
				startx=x;
				starty=y;
			break;
			case "mousemove":
				if(mouseisdown) {
					$(current_marker).remove();
					current_marker=svg_ellipse((x1+x2)/2,(y1+y2)/2,twidth/2,theight/2,color,color);
				}
				a=2
			break;
			case "mouseup":
				svg_ellipse((x1+x2)/2,(y1+y2)/2,twidth/2,theight/2,color,color);
			break;
			
		}
  }
  
  // Description of the flower tool
  function tool_flower(action,x,y) {
		var x1=0;
		var y1=0;
		var x2=0;
		var y2=0;
		if(startx < x) {
			x1 = startx;
			x2= x;
		} else {
			x1= x;
			x2 = startx;
		}
		
		if(starty < y) {
			y1 = starty;
			y2 = y;
		} else {
			y1= y;
			y2 = starty;
		}
		var twidth=x2-x1;
		var theight=y2-y1;	  
	  
		switch(action) {
			case "mousedown":
				startx=x;
				starty=y;
			break;
			case "mousemove":
				if(mouseisdown) {
					svg_ellipse((x1+x2)/2,(y1+y2)/2,twidth/2,theight/2,color,color);
				}
				a=2
			break;
			case "mouseup":

				svg_ellipse((x1+x2)/2,(y1+y2)/2,twidth/2,theight/2,color,color);
			break;
			
		}
  }
  
  // Description of the polylinefill(Filled freeshape) tool
  function tool_polylinefill(action,x,y) {
	//points_history="200,10 250,190 160,210";
	switch(action) {
		case "tool_end":
			if(points_history!="") {
				svg_polygon(points_history,color,color);
			}
			points_history = "";
		break;
		case "mousemove":
			if(mouseisdown) {
				points_history+=String(x)+","+String(y)+" "
				$(current_marker).remove();
				current_marker = svg_polyline(points_history,color,color);
			}
		break;
		case "mouseup":
			//points_history+=String(x)+","+String(y)+" "
			$(current_marker).remove();
			svg_polyline(points_history,color,color);
			points_history = "";
		break;
	}
  }

  // Description of the polyline tool (Pen tool)
  function tool_polyline(action,x,y) {
	//points_history="200,10 250,190 160,210";
	console.log("polygon line "+action," "+x+"  ,   "+y);
	switch(action) {
		case "tool_end":
			if(points_history!="") {
				svg_polygon(points_history,"none",color);
			}
			points_history = "";
		break;
		case "mousemove":
			if(mouseisdown) {
				points_history+=String(x)+","+String(y)+" "
				$(current_marker).remove();
				console.log(points_history);
				current_marker = svg_polyline(points_history,"none",color);
			}
		break;
		case "mouseup":
			//points_history+=String(x)+","+String(y)+" "
			$(current_marker).remove();
			svg_polyline(points_history,"none",color);
			points_history = "";
		break;
	}
  }
  
  // Description of the polygon tool
  function tool_polygon(action,x,y) {
	switch(action) {
		case "tool_end":
			if(points_history!="") {
				svg_polygon(points_history,color,color);
			}
			points_history = "";
		break;
		case "mousedown":
			points_history+=String(x)+","+String(y)+" "
			$(current_marker).remove();
			current_marker = svg_polygon(points_history,color,color);
		break;
	}
  }

	// Definition of the eraser tool
    function tool_eraser(action,x,y,target) {
		if(target==undefined) {
			// Nothing clicked on
			return;
		}
		if(action=="mousedown") {
				$(target).remove();
		}	
		if(action=="mousemove") {
			if(mouseisdown) {
				$(target).remove();
			}
		}	
	}
 
   // Drawing primitive for drawing svg rects
  function svg_rect(x, y, width, height, fill, stroke) {
	  //<rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:3;stroke:rgb(0,0,0)" />
	var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'rect'); //Create a path in SVG's namespace
	newElement.setAttribute("class","svgobject"); //Set path's data
	newElement.setAttribute("x",x); //Set path's data
	newElement.setAttribute("y",y); //Set path's data	
	newElement.setAttribute("width",width); //Set path's data
	newElement.setAttribute("height",height); //Set path's data
	newElement.setAttribute("fill",fill);
	newElement.setAttribute("stroke",stroke);
	svg.appendChild(newElement);
	return newElement;
  }
  
  // Drawing primitive for drawing svg circles
  function svg_circle(cx, cy, r, stroke, fill) {
	var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'circle'); //Create a path in SVG's namespace
	newElement.setAttribute("class","svgobject"); //Set path's data	
	newElement.setAttribute("cx",cx); //Set path's data
	newElement.setAttribute("cy",cy); //Set path's data
	newElement.setAttribute("r",5); //Set path's data
	newElement.setAttribute("fill",fill);
	newElement.setAttribute("stroke",stroke);
	svg.appendChild(newElement);
	return newElement;
  }
  
  // Drawing primitive for drawing svg ellipse
  function svg_ellipse(cx, cy, rx, ry, stroke, fill) {
	// Example of ellipse: <ellipse cx="200" cy="80" rx="100" ry="50" style="fill:yellow;stroke:purple;stroke-width:2" />
	var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse'); //Create a path in SVG's namespace
	newElement.setAttribute("class","svgobject"); //Set path's data
	newElement.setAttribute("cx",cx); //Set path's data
	newElement.setAttribute("cy",cy); //Set path's data
	newElement.setAttribute("rx",rx); //Set path's data
	newElement.setAttribute("ry",ry); //Set path's data
	newElement.setAttribute("fill",fill);
	newElement.setAttribute("stroke",stroke);
	svg.appendChild(newElement);
	return newElement;
  }
  
  // Drawing primitive for drawing svg polygon
  function svg_polygon(points, fill, stroke) {
	// Example of polygon:  <polygon points="200,10 250,190 160,210" style="fill:lime;stroke:purple;stroke-width:1" />
	var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polygon'); //Create a path in SVG's namespace
	newElement.setAttribute("class","svgobject"); //Set path's data	
	newElement.setAttribute("points",points); //Set path's data
	newElement.setAttribute("fill",fill);
	newElement.setAttribute("stroke",stroke);
	svg.appendChild(newElement);
	return newElement;
  }
  
    // Drawing primitive for drawing svg polyline
	function svg_polyline(points, fill, stroke) {
		// Example of polyline:  <polyline points="20,20 40,25 60,40 80,120 120,140 200,180" style="fill:none;stroke:black;stroke-width:3" />
		var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polyline'); //Create a path in SVG's namespace
		newElement.setAttribute("class","svgobject"); //Set path's data	
		newElement.setAttribute("points",points); //Set path's data
		newElement.setAttribute("fill",fill);
		newElement.setAttribute("stroke",stroke);
		newElement.setAttribute("stroke-width","5");
		svg.appendChild(newElement);
		return newElement;
	}  
  
	// Event handler for different colors
	$('#white').on("vmousedown",function(){
		color = "white";
	});
	$('#black').on("vmousedown",function(){
		color = "black";
	});
	$('#blue').on("vmousedown",function(){
		color = "blue";
	});
	$('#red').on("vmousedown",function(){
		color = "red";
	});
	$('#green').on("vmousedown",function(){
		color = "green";
	});
	$('#orange').on("vmousedown",function(){
		color = "orange";
	});
	$('#purple').on("vmousedown",function(){
		color = "purple";
	});
	$('#yellow').on("vmousedown",function(){
		color = "yellow";
	});
	$('#grey').on("vmousedown",function(){
		color = "grey";
	});
	$('#antiquewhite').on("vmousedown",function(){
		color = "antiquewhite";
	});

	// button for showing about box
	$('#about').click(function(){
		$('#divabout').css("visibility", "visible");
	});
	
	// button for hiding the about box
	$('#closedivabout').click(function(){
		$('#divabout').css("visibility", "hidden");
	});  

	// Set the default tool
    current_tool=tool_circle;
});
