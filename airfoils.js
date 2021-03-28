// This is just the airfoils example.
	import { dbsliceData } from "./src/core/dbsliceData.js"
	import * as FILE from "./src/core/fileClasses.js"
	import {cfD3Contour2d} from "./src/plot/cfD3Contour2d.js"
	import * as INTERFACES from "./src/core/interfaces.js"


	// PROJECTION IS DEFINED BY THE CANVAS SIZE!!


	var nacaDesignations = ['0006', '0008', '0010', '0015', '0018', '0021', '0024', '1408', '1410', '1412', '23012', '23015', '23018', '23021', '23024', '2408', '2410', '2411', '2412', '2415', '2418', '2421', '2424', '4412', '4415', '4418', '4421', '4424', '6412'] // nacaDesignations  

	var tasks = nacaDesignations.map(function(name){

		let five_series = name.length == 5

		return {
			taskId: name,
			slice: "/data/xfoil2d/vels_repanelled_naca_" + name + ".json",
			series: name.length + "-series",
			max_cmb: five_series ? 1.761 : Number(name.substr(0,1)),
			max_cmb_pos: Number(name.substr(1,1)),
			max_t: Number(name.substr(name.length-2,2))
		}
	})





	var plot = new cfD3Contour2d({
		sliceId: "slice",
		wrapper: document.getElementById("airfoils")
	})





	// Ask dbsliceData to load the file.

	// Import the files
	let requested = plot.request(tasks)
	let promises = dbsliceData.importing.batch(requested.classref, requested.files)



	// Launch a task upon loading completion.
	Promise.allSettled( promises ).then(function(promiseobjs){
		
		// Pipe the results back into the contour.
		let fileobjs = promiseobjs
		  .filter(function(promiseobj){
			return promiseobj.value.content != undefined 
		  })
		  .map(d=>d.value)
		
		plot.update(fileobjs)
		
	}) // then


	// All of below can be moved to cfD3Contour2d or appropriate app file.


	// Add functionality to the buttons.
	d3.select( document.getElementById("tsne") ).on("click", function(){
	
		plot.tools.tsnesettings.show()
	
		// plot.restart()
	}) // on


	d3.select( document.getElementById("kmeans") ).on("click", function(){
		plot.cluster()
	}) // on

		
	d3.select( document.getElementById("correlation-show") ).on("click", function(){
	
		plot.tools.toolbar.hide()
	
		// Get the correlations, and update them on the screen.
		d3.select("#correlation-container").style("display", "")
		let scores = plot.correlations()
		
		// The drawing should actually be done here so that the variable dragging can have access to the plot.
		INTERFACES.correlations.build(scores)
		
		
		let drag = d3.drag()
		  .on("start", function(d){
			  d.startposition = d3.mouse(this.parentElement)
		  })
		  .on("end", function(d){
			  // Find the position of the mouse relative to the position of the button.
			  
			  let startposition = d.startposition
			  let endposition = d3.mouse(this.parentElement)
			  
			  let dx = Math.abs( endposition[0] - startposition[0] )
			  let dy = Math.abs( endposition[1] - startposition[1] )
			  
			  if(dy > 50){
				plot.arrangebymetadata(0, d.name)
				let scores = plot.correlations()
				INTERFACES.correlations.update(scores)
			  } // if
			  
			  if(dx > 50){
			    plot.arrangebymetadata(1, d.name)
				let scores = plot.correlations()
				INTERFACES.correlations.update(scores)
			  } // if
		  }) // on
		
		d3.select("#correlation-container")
		  .selectAll("button.btn-small").call(drag)
		
		
		d3.select("#correlation-container")
		  .select("g.tagged")
		  .selectAll("button.btn-small")
		  .on("mouseenter", function(score){
		    let relevant = plot.ungroupedsprites().filter(function(sprite){
				return sprite.task[score.name]
			})
			plot.highlight(relevant, "yellow")
		  })
		  .on("mouseout", function(score){
			plot.unhighlight()
			plot.highlight(plot.tools.selected, "gainsboro")
		  })
		
		
	}) // on
	
	d3.select( document.getElementById("correlation-hide") ).on("click", function(){
		// Hige the correlations.
		d3.select("#correlation-container").style("display", "none")

		// Bring back the toolbar if anything is selected in the lasso.
		if(plot.tools.selected.length > 0){
			plot.tools.toolbar.show()
		} // if
		
	}) // on
		