import { dbsliceData } from "/src/core/dbsliceData.js"
// The plots should be able to take care of themselves, therefore they must have access to the data on their own too - thus `dbsliceData' must be imported here.

import { contour2dFile } from "/src/core/fileClasses.js"
// When requesting the appropriate data the plot must also specify the appropriate file class, therefore it must be imported here.


import * as THREE from '/src/plot/three.module.js';


// Dragging contours
// Rescaling contours
// Grouping contours
// Zooming the view
// Interface for ML

// Maybe even hide the colorbar if required??


// Internal contour data object. 
class contour {
	constructor(task, wrapper){
		
		// Should have task, file, graphic
		this.task = task
		this.file = undefined
		this.graphic = {
			format: {
				wrapper: wrapper,
				element: undefined
			},
			position: {}
		} // graphic
		
		
		
		
		// Create teh DOM element corresponding to this contour, and add it to hte wrapper.
		
		const element = document.createElement( 'div' );
		element.className = 'list-item';
		

		const sceneElement = document.createElement( 'div' );
		element.appendChild( sceneElement );

		const descriptionElement = document.createElement( 'div' );
		descriptionElement.innerText = 'Test scene';
		element.appendChild( descriptionElement );
		
		
		wrapper.appendChild( element );
		this.graphic.format.element = element
		
		
		
	} // constructor
	
} // contourobj


export class cfD3Contour2d {
  constructor(config){
	// What should enter here? A reference to the basic plot structure. And of course the slice it's supposed to draw.  
		
	this.format = {
	  
	  title: "Edit title",
	  sliceId: config.sliceId,
	  wrapper: config.wrapper,
	  canvas: undefined,
	  
	  position: {
		mouse: undefined,
		wrapper: undefined
	  },
	} // format
		
	// When the plot is updated a new `contourobj' is created for every task in the filter. There is no separation into available and missing, but instead any `contourobjs' for which the files are not retrieved will not have any data, and thus won't be plotted. In essence, the available and missing are not explicitly stated, but can be worked out.
	this.data = {
	  objs: [],
	  urls: [],
	  domain: []
	} // data
	
	this.tools = {
	  gl: undefined,
	  programInfo: undefined,
	  shaders: {
		frag : [
			'precision highp float;',
			'uniform sampler2D u_cmap;',
			'uniform float u_cmin, u_cmax;',
			'varying float v_val;',
			'void main() {',
			'  gl_FragColor = texture2D(u_cmap, vec2( (v_val-u_cmin)/(u_cmax-u_cmin) ,0.5));',
			'}'
			].join("\n"),
		vert: [
			'attribute vec2 a_position;',
			'attribute float a_val;',
			'uniform mat4 u_matrix;',
			'varying float v_val;',
			'void main() {',
			'  gl_Position = u_matrix*vec4(a_position,0,1);',
			'  v_val = a_val;',
			'}'
			].join("\n")
	  },
	  scales: {
		px2clr: undefined,
		val2clr: undefined,
		val2px: undefined,
		val2px_: undefined,
		bin2px: undefined
	  },
	  lasso: {
		points: [],
		tasks: []
	  },
	  tooltip: undefined,
	  trending: undefined
	} // tools
	

  } // constructor
  
  
  // What about having 2 canvases? One background one overlay? And the background can render once, and then only the overlay is drawn. And on drag end the background is drawn again? That would reduce the amount of drawing.
  
  make(){
	// How much of this can be moved to the constructor??
	this.format.canvas = document.getElementById("plotcanvas")
	let canvas = this.format.canvas
	
	// Any time the canvas is resized a new context is needed!!
	this.sizecanvas()
	
	// MODIFICATION: preserveDrawingBuffer: true
	// This allows plotting several items on-top of each other.
	const gl = canvas.value = canvas.getContext("webgl", {antialias: true, depth: false, preserveDrawingBuffer: true}); 
	
	twgl.addExtensionsToContext(gl);
	
	// Program info = move into make?
	const programInfo = twgl.createProgramInfo(gl, [this.tools.shaders.vert, this.tools.shaders.frag]);
	gl.useProgram(programInfo.program);
	
	this.tools.gl = gl
	this.tools.programInfo = programInfo
	  
	  
  } // make
  
  
  // Update the plot.
  render(){
	  
	var obj = this
	
	console.log("render", obj)
	
	// Loop over all the objects and draw them. This is a current workaround, but later on it will have to be settled.
	
	var view = obj.dimension(obj.data.domain)
	
	
	// USE CANVAS MOVETO to move the context somewhere else!! Ah, the whole canvas will be redrawn everytime anyway, moveTo just allows me to skip the addition of coordinates.
	// Follow the same logic as in the THREE example - Add DOM elements over the canvas, attach listener events to them, and when they move redraw the underlying canvas. When drawing on canvas we can then first find the origin of the DOM element, moveTo that point, and draw on the canvas there.
	obj.data.objs.forEach(function(contourobj){
		
		// Plot all surfaces of this file onto hte canvas.
		contourobj.file.content.forEach(function(surface){
			let triMesh = obj.json2bin( surface )
			
			// draw clears the whole canvas....
			obj.draw(triMesh, view)
		})
		
	}) // forEach
	
	  
  } // render
  
  
  draw(triMesh, view){
	  
	var obj = this
	  
    // These are defined outside
	
		
	let gl = obj.tools.gl
	let programInfo = obj.tools.programInfo
	
	// Redo the domain of the data to scale teh plot correctly. The actual domains on the plots can be different, but 'dimensionView' ensures that the prescribed common domain is drawn on all of them.
	// let view = obj.dimension(triMesh.domain)
	

	
	// Render
	const arrays = {
		 a_position: {numComponents: 2, data: triMesh.vertices},
		 a_val     : {numComponents: 1, data: triMesh.values},
		 indices   : {numComponents: 3, data: triMesh.indices}
	};
	  
	const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
	twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
	
	// Get a colormap.
	const cmap = obj.colormap("sptral")
	const cmapTex = twgl.createTexture(gl, {
		mag: gl.LINEAR, 
		min:gl.LINEAR, 
		src: cmap, 
		width: cmap.length/4, 
		height:1
	});
	
	
	// How to adjust the projection??
	let mat4 = glMatrix.mat4
	const projectionMatrix = mat4.create();
	mat4.ortho(projectionMatrix, view.xMin, view.xMax, view.yMin, view.yMax, 0, 1.);
	  
	const uniforms = {
		u_matrix: projectionMatrix, 
		u_cmap: cmapTex, 
		u_cmin: triMesh.domain.v[0], 
		u_cmax: triMesh.domain.v[1]};
	twgl.setUniforms(programInfo, uniforms);
	
	
	// Do the actual drawing
	gl.drawElements(gl.TRIANGLES, triMesh.indices.length, gl.UNSIGNED_INT, 0);
	  
	  
  } // draw
  
  
  colormap(name){
	var obj = this
	  
	let cmap

	switch(name){
		case "spectral":
		  cmap = [[158, 1, 66, 255], 
				  [185, 31, 72, 255], 
				  [209, 60, 75, 255], 
				  [228, 86, 73, 255], 
				  [240, 112, 74, 255], 
				  [248, 142, 83, 255], 
				  [252, 172, 99, 255], 
				  [253, 198, 118, 255], 
				  [254, 221, 141, 255], 
				  [254, 238, 163, 255], 
				  [251, 248, 176, 255], 
				  [241, 249, 171, 255], 
				  [224, 243, 160, 255], 
				  [200, 233, 159, 255], 
				  [169, 220, 162, 255], 
				  [137, 207, 165, 255], 
				  [105, 189, 169, 255], 
				  [78, 164, 176, 255], 
				  [66, 136, 181, 255], 
				  [74, 108, 174, 255], 
				  [94, 79, 162, 255]]
		  break;
	
		default:
		  cmap = d3.range(0,1.05,0.05).map(d => obj.hex2rgb( d3.interpolateViridis(d) ) )
		
	} // switch
	
	return new Uint8Array( [].concat.apply([], cmap) ) ;

  } // colormap


  hex2rgb(hex) {
	  // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
	
	  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
	  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
		return r + r + g + g + b + b;
	  });

	  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	  
	  // Format result appropriately.
	  return result ? [
	  	parseInt(result[1], 16),
	  	parseInt(result[2], 16),
	  	parseInt(result[3], 16),
		255
	  ] : null;
  }
  
  
  dimension(domain){
	  
	
	
	// The canvas uses it's center as the coordinate origin (0,0), and the corners are NW (-1,1), NE (1,1), SW (-1,-1), SE (1,-1). To plot on the canvas the data either has to be mapped into this domain by the user, or the minimum x and y values need to be prescribed to allow canvas to rescale the data itself.
	
	// How to introduce the canvas size into this as well. Right now the graphic is stretched when the canvas is resized.
	var obj = this
	
	let width = obj.format.canvas.width
	let height = obj.format.canvas.height

	let margin = 0
	let innerWidth = width - 2*margin
	let innerHeight = height - 2*margin

	// Dimension the view based on thesize of the canvas, the domain of the data, and the desired margins.
	let xMid = (domain.x[1] + domain.x[0])/2
	let yMid = (domain.y[1] + domain.y[0])/2
	
	
	// Draw the graphic with an AR of 1 regardless of the canvas size. First calculate the px/val unit for both axes.
	let xValPerPx = ( domain.x[1] - domain.x[0] ) / innerWidth
	let yValPerPx = ( domain.y[1] - domain.y[0] ) / innerHeight
	
	// These two must be exactly the same for AR = 1 to be enforced.
	let valPerPx = xValPerPx > yValPerPx ? xValPerPx : yValPerPx
	
	return {xMin: xMid - valPerPx*width/2, 
			xMax: xMid + valPerPx*width/2, 
			yMin: yMid - valPerPx*height/2, 
			yMax: yMid + valPerPx*height/2}

  } // dimension
  
  
  sizecanvas(){
	  
	var obj = this
	let canvas = obj.format.canvas
	// The canvas needs to have it's widht and height set internally, otherwise the result is just stretched.
	  
	canvas.width = canvas.getBoundingClientRect().width
	canvas.height = canvas.getBoundingClientRect().height
	
	canvas.style.width = canvas.getBoundingClientRect().width + "px"
	canvas.style.height = canvas.getBoundingClientRect().height + "px"
	  
  } // sizecanvas
  
	
  // Add the files to the plot.
  update(fileobjs){
	// `add' marries the incoming fileobjs to the correponding internal contour objects.
	  
	// Needs to figure out how to handle empty fileobjs!!
	  
	var obj = this
	
	
	obj.data.objs.forEach(function(contourobj){
		// See if the appropriate file is available.
		
		let files = fileobjs.filter(d=>d.url == contourobj.task[obj.format.sliceId])
		if(files.length > 0){
			contourobj.file = files[0]
		} // if
	})
	
	
	// With the objects and files married, calculate the domain of all variables available.
	obj.data.domain = obj.domain(obj.data.objs.map(d=>d.file))
	
	
	// The update is the re-render.
	obj.render()
  } // update
  
  
  
  // Request missing files.
  request(tasks){
	// `dbsliceData' asked which files corresponding to the given tasks this plot requires in order to update it's view. 
	
	
	// Within functions the meaning of `this' changes to the local value, as opposed to the class instance.
	var obj = this
	
	// Store a reference to all hte files needed for this plot on hte last update.
	obj.data.urls = tasks.map(task=>task[obj.format.sliceId])
	
	
	// Find which of the currently plotted contours has files that will be retained, and which should be removed. The check is done on tasks, as there may be a situation in which the slice of the plot changes, but we still want to keep all the on-screen objects.
	obj.data.objs = obj.data.objs.filter(function(contourobj){
		 return tasks.includes(contourobj.task)
	}) // filter
	
	// Create additional contour objects based on the tasks that are not yet represented.
	let plottedTasks = obj.data.objs.map(d=>d.task)
	tasks.forEach(function(task){
		if(!plottedTasks.includes(task)){
			obj.data.objs.push( new contour(task, obj.format.wrapper) )
		} // if
	}) // forEach
	
	
	// If I'm marrying the files to the objects later on I don't need to check for availability.
	
	// Now collect all the urls that are required.
	let required = obj.data.urls.map(function(url){
		return {
			url: url,
			filename: url
		}
	})
	
	
			
	// Make, collect, and return the load promises.
	return {
		classref: contour2dFile,
		files: required
	}

  } // request
	
  domain(files){
	// It is simpler to allow the user to pick any variable, and just not draw anything if data for that surface is not available.
	
	
	// So here just find the domains of x, y, and Cp for all hte files and surfaces.
	let domain = files.reduce(function(acc, file){
		
		file.content.forEach(function(surface){
			acc.x = d3.extent([...acc.x, ...surface.data.x])
			acc.y = d3.extent([...acc.y, ...surface.data.y])
			
			surface.variables.forEach(function(variable){
				let v = acc[variable]
				if(v){
					v = d3.extent([...v, ...surface.data[variable]])
				} else {
					acc[variable] = d3.extent(surface.data[variable])
				} // if
			})
			
		}) // forEach
		
		return acc
	}, {
		x: [],
		y: []
	})
	
	return domain
	
  } // domain



  // Converters should later be included within the contour2dFile
  json2bin(surface){
	
	let x = surface.data.x
	let y = surface.data.y
	let values = surface.data.Cp
	let nx = surface.data.size[0]
	let ny = surface.data.size[1]
	
	
	
	let vertices = []
	for(let i=0; i<x.length; i++){
		vertices.push(x[i])
		vertices.push(y[i])
	} // for
	
	// It's a structured mesh in this case, but in principle it could be unstructured. The vertices are declared in rows.

	
	// The indices array points to the value in thevertices array for a particular point. In that case does the shader take the appropriate pair from the vertices array, or a single node? If it takes a single value, then why arent the x and y specified together??
	function grid2vec(row, col){ return row*nx + col }
	
	let indices = []
	let ne, nw, sw, se
	// Create indices into the `vertices' array
	for(let row=0; row<ny-1; row++){
		for(let col=0; col<nx-1; col++){
			// For every row and column combination there are 4 vertices, which make two triangles - the `upper' and `lower' triangles. 
			
			// Corners on a grid. Just the sequential number of the vertex.
			nw = grid2vec( row    , col     )
			ne = grid2vec( row    , col + 1 )
			sw = grid2vec( row + 1, col     )
			se = grid2vec( row + 1, col + 1 )
			
			// `upper'
			indices.push(sw, nw, ne)

			// `lower'
			indices.push(sw, se, ne)
		
		} // for
	} // for
	
	

	return {
			vertices: new Float32Array(vertices),
			  values: new Float32Array(values),
			 indices: new Uint32Array(indices),
			 domain: {x: d3.extent(x),
					  y: d3.extent(y),
					  v: d3.extent(values)}
		}

  } // json2bin

} // cfD3Contour2d










