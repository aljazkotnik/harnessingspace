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
	constructor(task){
		
		// Should have task, file, graphic
		this.task = task
		this.file = undefined
		this.graphic = {
			format: {},
			position: {}
		} // graphic
		
		
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
	  size: {
		width: 300,
		height: 90,  
	  },
	  
	  position: {
		mouse: undefined,
		wrapper: undefined
	  },
	} // format
		
	// When the plot is updated a new `contourobj' is created for every task in the filter. There is no separation into available and missing, but instead any `contourobjs' for which the files are not retrieved will not have any data, and thus won't be plotted. In essence, the available and missing are not explicitly stated, but can be worked out.
	this.data = {
	  objs: [],
	  urls: [],
	  intersect: []
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
  
  
  make(){
	// How much of this can be moved to the constructor??
	  
    // This makes the canvas to draw on.
	let pf = this.format.size
	
	let canvas = document.createElement("canvas")
	document.getElementById("target").appendChild(canvas)
	
	canvas.width = pf.width  * devicePixelRatio 
	canvas.height = pf.height * devicePixelRatio
	canvas.style = "width: " + pf.width + "px; height: " + pf.height + "px";
	
	
	const gl = canvas.value = canvas.getContext("webgl", {antialias: true, depth: false}); 
	
	twgl.addExtensionsToContext(gl);
	
	// Program info = move into make?
	const programInfo = twgl.createProgramInfo(gl, [this.tools.shaders.vert, this.tools.shaders.frag]);
	gl.useProgram(programInfo.program);
	
	this.format.canvas = canvas
	this.tools.gl = gl
	this.tools.programInfo = programInfo
	  
	  
  } // make
  
  
  // Update the plot.
  render(){
	  
	var obj = this
	
	console.log("render", obj)
	
	// Loop over all the objects and draw them. This is a current workaround, but later on it will have to be settled.
	
	var view = obj.dimension(obj.data.intersect)
	
	obj.data.objs.forEach(function(contourobj){
		
		// Plot this onto the canvas.
		let triMesh = obj.json2bin( contourobj.file.content.surface )
		
		obj.draw(triMesh, view)
		
	}) // forEach
	
	  
  } // render
  
  
  draw(triMesh, view){
	  
	var obj = this
	  
    // These are defined outside
	let mat4 = glMatrix.mat4
		
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
	  
	  
	// How to adjust the projection??
	const projectionMatrix = mat4.create();
	mat4.ortho(projectionMatrix, view.xMin, view.xMax, view.yMin, view.yMax, 0, 1.);
	
	
	// Get a colormap.
	const cmap = obj.colormap("sptral")
	const cmapTex = twgl.createTexture(gl, {
		mag: gl.LINEAR, 
		min:gl.LINEAR, 
		src: cmap, 
		width: cmap.length/4, 
		height:1
	});
	  
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
	
  // Add the files to the plot.
  update(fileobjs){
	// `add' marries the incoming fileobjs to the correponding internal contour objects.
	  
	var obj = this
	
	
	obj.data.objs.forEach(function(contourobj){
		// See if the appropriate file is available.
		
		let files = fileobjs.filter(d=>d.url == contourobj.task[obj.format.sliceId])
		if(files.length > 0){
			contourobj.file = files[0]
		} // if
	})
	
	
	// With the objects and files married, calculate the intersect of all options available, and any data quantities that depend on all objects, such as the domain extents. Intersect takes a file array as the input.
	
	
	obj.data.intersect = obj.intersect(obj.data.objs.map(d=>d.file))
	
	
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
			obj.data.objs.push( new contour(task) )
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
	
  intersect(files){
	// Simultaneously calculate both the option intersect, as well as the domain of the variable.
	// The intersect should be across all the surfaces. So far only the options for plotting have been identified. Or would it maybe be simpler to allow the user to pick anything they want as the value, and just not draw anything if there's nothing available?? Maybe that is better actually.
	
	let file_ = files[0]
	let kernel = {
		variables: file_.content.variables.map(function(varname){
			return {
				name: varname,
				domain: d3.extent(file_.content.surface[varname]),
				n: file_.content.surface[varname].length
			}
		}),
		geometry: {
			x: d3.extent(file_.content.surface.x),
			y: d3.extent(file_.content.surface.y)
		}
	} // map
	
	
	
	// Find which variables appear in all the dataobj files. These are the variables that can be compared.
	let intersect_ = files.reduce(function(acc, fileobj){
		
		let surface = fileobj.content.surface
		
		acc.variables = acc.variables.filter(function(varobj){
			// Update the domain, and return `true' if the variable exists in this file as well.
			
			let flag = false
			if(fileobj.content.variables.includes(varobj.name)){
				flag = true
				
				// Update the needed info.
				varobj.domain = d3.extent([...surface[varobj.name], ...varobj.domain])
				varobj.n = d3.min([surface[varobj.name].length, varobj.n])		
				
			} // if
			
			return flag
		}) // filter
		
		
		acc.geometry.x = d3.extent([... surface.x, ...acc.geometry.x])
		acc.geometry.y = d3.extent([... surface.y, ...acc.geometry.y])
		
		return acc
	}, kernel)
	
	
	
	
	// Convert to object
	let intersect = intersect_.variables.reduce(function(acc, varobj){
		acc[varobj.name] = {
			domain: varobj.domain,
			n: varobj.n
		}
		return acc
	}, {})
	
	
	
	intersect.x = intersect_.geometry.x
	intersect.y = intersect_.geometry.y
	
	
	
	
	
	return intersect
	
  } // intersect



  // Converters that can later be included within the contour2dFile
  json2bin(surface){
	
	let x = surface.x
	let y = surface.y
	
	
	// Create values, indices, vertices.
	let values = surface.v
	
	let vertices = []
	for(let i=0; i<x.length; i++){
		vertices.push(x[i])
		vertices.push(y[i])
	} // for
	
	// It's a structured mesh in this case, but in principle it could be unstructured. The vertices are declared in rows.
	let nx = surface.size[0]
	let ny = surface.size[1]
	
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










