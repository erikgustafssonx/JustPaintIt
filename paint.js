$(document).ready(function(){
	var current_marker = null;
	var mouseisdown = false;
	var startx = 0; // used by varius tools such as rect
	var starty = 0;
	var polygon_history = "";
	var svg = document.getElementsByTagName('svg')[0]; //Get svg element
	
	/*
	  <circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />
	*/
	
	$("#test").click(function() {
		svg_rect(100,10,100,100,"red","red");
	});
	
	// Avoid anoying bouncing feature on ipad
	// http://stackoverflow.com/questions/16048155/how-to-stop-elastic-scrolling-aka-scroll-bounce-aka-page-overscroll-effect-on
	$(document).bind("touchmove",function(e) {
		e.preventDefault();
	});
  
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
  
  $("#circle").on("vmousedown",function() {
	current_tool("tool_end");
	current_tool=tool_circle;
  });
  
  $("#flower").on("vmousedown",function() {
	current_tool("tool_end");
	current_tool=tool_flower;
  });
  
  $("#square").on("vmousedown",function() {
	current_tool("tool_end");
	current_tool=tool_rect;
  });
  
  $("#pen").on("vmousedown",function() {
	current_tool("tool_end");
	current_tool=tool_polyline;
  });
  
  $("#polygon").on("vmousedown",function() {
	current_tool("tool_end");
	polygon_history="";
	current_tool=tool_polygon;
  });
  
  $("#polylinefill").on("vmousedown",function() {
	current_tool("tool_end");
	polygon_history="";
	current_tool=tool_polylinefill;
  });
  
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
  
  $("#new").on("vmousedown",function() {
	 $("svg").empty(); 
  });
  
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
  
  function tool_pen(action,x,y) {
	if(!mouseisdown) {
		  return;
	}
	  // http://stackoverflow.com/questions/16488884/add-svg-element-to-existing-svg-using-dom	
	var offset = $(this).offset();
	svg_circle(x,y, 5, color, color);
	  //alert("hej");
  }
  
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
  
  function tool_polylinefill(action,x,y) {
	//polygon_history="200,10 250,190 160,210";
	switch(action) {
		case "tool_end":
			if(polygon_history!="") {
				svg_polygon(polygon_history,color,color);
			}
			polygon_history = "";
		break;
		case "mousemove":
			if(mouseisdown) {
				polygon_history+=String(x)+","+String(y)+" "
				$(current_marker).remove();
				current_marker = svg_polyline(polygon_history,color,color);
			}
		break;
		case "mouseup":
			//polygon_history+=String(x)+","+String(y)+" "
			$(current_marker).remove();
			svg_polyline(polygon_history,color,color);
			polygon_history = "";
		break;
	}
  }
  
  function tool_polyline(action,x,y) {
	//polygon_history="200,10 250,190 160,210";
	console.log("polygon line "+action," "+x+"  ,   "+y);
	switch(action) {
		case "tool_end":
			if(polygon_history!="") {
				svg_polygon(polygon_history,"none",color);
			}
			polygon_history = "";
		break;
		case "mousemove":
			if(mouseisdown) {
				polygon_history+=String(x)+","+String(y)+" "
				$(current_marker).remove();
				console.log(polygon_history);
				current_marker = svg_polyline(polygon_history,"none",color);
			}
		break;
		case "mouseup":
			//polygon_history+=String(x)+","+String(y)+" "
			$(current_marker).remove();
			svg_polyline(polygon_history,"none",color);
			polygon_history = "";
		break;
	}
  }
  
  function tool_polygon(action,x,y) {
	//polygon_history="200,10 250,190 160,210";
	switch(action) {
		case "tool_end":
			if(polygon_history!="") {
				svg_polygon(polygon_history,color,color);
			}
			polygon_history = "";
		break;
		case "mousedown":
			polygon_history+=String(x)+","+String(y)+" "
			$(current_marker).remove();
			current_marker = svg_polygon(polygon_history,color,color);
		break;
	}
  }
  
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
  
  function svg_ellipse(cx, cy, rx, ry, stroke, fill) {
	// <ellipse cx="200" cy="80" rx="100" ry="50" style="fill:yellow;stroke:purple;stroke-width:2" />
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
  
  function svg_polygon(points, fill, stroke) {
	// <polygon points="200,10 250,190 160,210" style="fill:lime;stroke:purple;stroke-width:1" />
	var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polygon'); //Create a path in SVG's namespace
	newElement.setAttribute("class","svgobject"); //Set path's data	
	newElement.setAttribute("points",points); //Set path's data
	newElement.setAttribute("fill",fill);
	newElement.setAttribute("stroke",stroke);
	svg.appendChild(newElement);
	return newElement;
  }
  
  function svg_polyline(points, fill, stroke) {
	// <polyline points="20,20 40,25 60,40 80,120 120,140 200,180" style="fill:none;stroke:black;stroke-width:3" />
	var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'polyline'); //Create a path in SVG's namespace
	newElement.setAttribute("class","svgobject"); //Set path's data	
	newElement.setAttribute("points",points); //Set path's data
	newElement.setAttribute("fill",fill);
	newElement.setAttribute("stroke",stroke);
	newElement.setAttribute("stroke-width","5");
	svg.appendChild(newElement);
	return newElement;
  }
  
  
  
  var current_tool=tool_circle;
});
