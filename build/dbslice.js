import * as FILE from "/src/core/fileClasses.js"
import { dbsliceData } from "/src/core/dbsliceData.js"
import { cfD3Contour2d } from "/src/plot/cfD3Contour2d.js"


// Initialise the crossfilter.
dbsliceData.internal.cfData.initialise()


// Now load in a metadata file.
var metadataPromise = dbsliceData.importing.single(FILE.metadataFile, {
	url: "/data/metadata_comp3stg.csv",
	filename: "/data/metadata_comp3stg.csv"
})


var session = {
	plots: [],
} // session



// INCLUDE THE FILE INTO THE CROSSFILTER!!

// After the metadata is loaded, load 25 contour plot files.
metadataPromise.then(function(file){
	
	dbsliceData.internal.cfData.change(file.content)
	
	// Get the contour files.
	let slice = dbsliceData.metadata.contour2dProperties[0]
	
	// Crate a new plot.
	let contourPlot = new cfD3Contour2d( {sliceId: slice, wrapper: document.getElementById("devContour")} )
	session.plots.push( contourPlot )
	
	// Refresh the view.
	refreshTasksInPlotRows()
	
	console.log(dbsliceData)
	
}) // then

// Merge into dbsliceData??
function refreshTasksInPlotRows(){
	// Here loop over the plots and update any on-demand data that may be required. To separate `dbsliceData' from the plots as much as possible this function asks the plots: Given an array of tasks currently in the filter, which files do you need for the appropriate update? The returned files are then loaded. And upon completion of the load the update is fired. The plot is only expected to request data it doesn't yet have.
	
	// Only `dbsliceData' knows which tasks are in the filter, but it doesn't know the sliceId and the file type needed to load the files. In any case, those decisions should be wrapped completely to the plot for a simpler API. Therefore the plot must declare which additional plots it needs, and the system will load only those additionally.
	
	let filteredTasks = dbsliceData.metadata.crossfilter.taskDim.top(1)
			
	// Every file can demand it's own files.
	let requestedUrls = []
	session.plots.forEach(function(plotobj){
		if(plotobj.format.sliceId){
			
			// Get the request information, store the requested URLS, and make the actual requests.
			let requestInfo = plotobj.request(filteredTasks)
			requestedUrls.concat(requestInfo.files.map(d=>d.url))
			let requests = dbsliceData.importing.batch(requestInfo.classref, requestInfo.files)
			
			
			// Move this back to the plot?? Or keep here as general??
			Promise.allSettled( requests ).then(function( results ){
				
				// When the file is not found or cannot be loaded a file object is passed through in the results array even though it is not logged in the central library. Those files will not have a content, and must be filtered out.
				let valid = results
				  .map(d=>d.value)
				  .filter(d=>d.content)
				plotobj.update( valid )
			}) // then
			
		} // if
	}) // forEach
	
	// Pass in the urls that were currently requested. Other files get removed.
	dbsliceData.library.update(requestedUrls)

} // refreshTasksInPlotRows
