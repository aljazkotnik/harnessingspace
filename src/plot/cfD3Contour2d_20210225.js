import { dbsliceData } from "/src/core/dbsliceData.js"
// The plots should be able to take care of themselves, therefore they must have access to the data on their own too - thus `dbsliceData' must be imported here.

import { contour2dFile } from "/src/core/fileClasses.js"
// When requesting the appropriate data the plot must also specify the appropriate file class, therefore it must be imported here.


import * as tsnejs from "/src/outside/tsne_module.js"
// t-sne module adapted from: https://github.com/karpathy/tsnejs


// Grouping contours
// Interface for ML

// Maybe even hide the colorbar if required??





// A class that will control the canvas and teh link between the DOM coordinates and data values.
class canvasobj {
  constructor(element){
	this.element = element
	this.view = undefined
  } // constructor
	
	
  pixel2data(){
	  
	// Transform into the data values. B
	let view = this.view.current
	let dom = {
		x: [0, this.element.width ], 
		y: [0, this.element.height]
	}
	
	return canvasobj.domA2domB(pos, dom, view)
	  
	  
  } // pixel2data
	
  data2pixel(){} // pixel2data
	
	
  static dimensionCanvasView(canvas, valPerPx){
	// The canvas is dimensioned by assuming a default image width of 200px. This means that the contour ensemble data x-domain range corresponds to 200px. From that a unit of data per pixel width can be calculated, from which the appropriate domain of the canvas can be calculated. 
	// If a point is given then use it as an anchor. Point needs both the DOM and value coordinates. When zooming this point has to move to the center of the screen.
	
	
	let xinterval = canvas.width*valPerPx
	let yinterval = canvas.height*valPerPx
	
	let view = {
		scales: {
		  x: d3.scaleLinear()
		    .domain( [0, xinterval   ] )
			.range(  [0, canvas.width] ),
		  y: d3.scaleLinear()
		    .domain( [0, yinterval    ] )
			.range(  [0, canvas.height] )
		},
		current: {
		  x: [0, xinterval],
		  y: [0, yinterval],
		  v2p: valPerPx
		}
		
	} // view
	
	
	return view
  } // dimensionCanvasView
  
  static sizeCanvas(canvas){
	// The canvas needs to have it's widht and height set internally, otherwise the result is just stretched.
	canvas.width = canvas.getBoundingClientRect().width
	canvas.height = canvas.getBoundingClientRect().height
	
	canvas.style.width = canvas.getBoundingClientRect().width + "px"
	canvas.style.height = canvas.getBoundingClientRect().height + "px"
  } // sizeCanvas
  
  
  static domA2domB(point, A, B){
	// Convert a single point `point' from a domain defined by `A' to a domain defined by `B'. `A' and `B' both require to have `x' and `y' attributes, which are arrays of length 2.
	
	let x = d3.scaleLinear()
	  .domain( A.x )
	  .range( B.x )
		
	let y = d3.scaleLinear()
	  .domain( A.y )
	  .range( B.y )
		  
	return [ x( point[0] ), y( point[1] )]
  } // dom2view
	
} // canvasobj








// Internal contour data object. 
class contour {
  constructor(task, parentobj){
	
	// Should have task, file, graphic
	this.task = task
	this.file = undefined
	this.graphic = {
		wrapper: undefined,
		position: {}
	} // graphic
	this.parentobj = parentobj
	this.positionvalues = undefined
	
	
	
	// Create teh DOM element corresponding to this contour, and add it to hte wrapper.
	const wrapper = document.createElement( 'div' );
	wrapper.className = 'list-item';
	wrapper.style.position = "absolute";
	wrapper.style.left = "0px";
	wrapper.style.top = this.parentobj.graphic.canvas.offsetTop + "px";

	const sceneElement = document.createElement( 'div' );
	sceneElement.className = 'scene-element';
	wrapper.appendChild( sceneElement );

	/* Maybe append this only on mouseover? As a tooltip?
	const descriptionElement = document.createElement( 'div' );
	descriptionElement.className = "description-element";
	descriptionElement.innerText = 'Test scene';
	wrapper.appendChild( descriptionElement );
	*/
	
	parentobj.graphic.wrapper.appendChild( wrapper );
	this.graphic.wrapper = wrapper
	let d3card = d3.select(wrapper).datum(this)
	
	let dragobj = new dragCard()
	d3card.call(dragobj.obj)
	
	
  } // constructor
	
	
	
  size(){
	// Size the window for the sprite appropriately. Note that since the size depends on a single value in the parentobj all the contours are forced to be the same size all the time. Thereforethe user will have to zoom into a contour if they wish to see it up close, and consequently the resizing controls are not necessary!
	let obj = this
	
	let domain = obj.parentobj.data.domain
	let v2p = obj.parentobj.tools.draw.view.current.v2p
	let spritewidth = obj.parentobj.graphic.spritewidth
	let spriteheight = ( domain.y[1] - domain.y[0] ) / v2p
	
	d3.select(obj.graphic.wrapper)
	  .select("div.scene-element")
	  .style("width", spritewidth + "px")
	  .style("height", Math.round(spriteheight) + "px")		
  } // size

  position(){
	// Get the DOM position of the contour relative to the canvas.
	let obj = this
	
	let canvasBox = obj.parentobj.graphic.canvas.getBoundingClientRect()
	let wrapperBox = obj.graphic.wrapper.getBoundingClientRect()
	
	return [wrapperBox.x - canvasBox.x, wrapperBox.y - canvasBox.y]
  } // position
	
	
	
  // MOVE TO A CANVAS AND VIEW MANAGER??
  setPositionValues(pos){
	// Set the position value for easy retrieval later on.
	let obj = this
	
	// Transform into the data values. B
	let view = obj.parentobj.tools.draw.view.current
	let dom = {
		x: [0, obj.parentobj.graphic.canvas.width], 
		y: [0, obj.parentobj.graphic.canvas.height]
	}
	
	obj.positionvalues = canvasobj.domA2domB(pos, dom, view)
  } // setPositionValues
	
  // Move this one to the canvas functionality? Or at least move the calculation there?
  reposition(point){
	// Position the DOM wrapper to where the values in `point' are on the canvas.
	let parentobj = this.parentobj
	
	// The position values have been stored already, now it's time to find the new dom position, and update the relevant wrapper.
	
	// Transform into the data values. B
	let view = parentobj.tools.draw.view.current
	let dom = {
		x: [0, parentobj.graphic.canvas.width], 
		y: [0, parentobj.graphic.canvas.height]
	}
	
	let pos = canvasobj.domA2domB(point, view, dom)
	
	this.graphic.wrapper.style.left = pos[0] + "px"
	this.graphic.wrapper.style.top = pos[1] + "px"
	
	
	// The value information has to be stored within hte contour somehow. Otherwise it's impossible to first calculate the value
	
  } // reposition
	
	
	
	
  get translation(){
	// Maybe this could be moved to the sprite object?
	
	let obj = this
	  
	// Get the correction for the scene location. This also requires the correction for the domain, as well as adjusting the pixel offset by the val2px conversion.
	
	
	// obj.graphic.parent is div.content -> plotWrapper
	let scene = obj.graphic.wrapper.getElementsByClassName("scene-element")[0]
	let canvas = obj.parentobj.graphic.canvas
		
	let sceneBox = scene.getBoundingClientRect()
	let canvasBox = canvas.getBoundingClientRect()
		
	// Maybe the objects should have their domains readily available?? AAAAH, the domains for all contours should be exactly the same! The parent element will have the right domain!! But that can be added to the translate outside.
	
	// DEFINITELY DOES NOT DEPEND ON VIEW!!
	let view = obj.parentobj.tools.draw.view.current
	let domain = obj.parentobj.data.domain
	let v2p = view.v2p
	
	let dx = ( sceneBox.x - canvasBox.x )*v2p; 
	let dy = ( sceneBox.y - canvasBox.y )*v2p;
		
	/*
	dx,dy - offset between the box and the canvas.
	obj.data.domain. x/y [0/1] - rebase the data to 0,0
	obj.tools.draw.view.current. x/y [0/1] - rebase the canvas to 0,0
	
	+y - moves up
	+x - moves right
	*/
	return [
		 dx - domain.x[0] + view.x[0], 
	    -dy - domain.y[1] + view.y[1],
		0,
		0
	]
	  
  } // spriteTranslate
	
	
  // Functionality to draw on it's specific canvas.
  loginMovement(){
	let obj = this
	obj.parentobj.tools.dragged.push(obj)
  } // loginMovement

  logoutMovement(){
	let obj = this
	obj.parentobj.tools.dragged = obj.parentobj.tools.dragged.filter(d=>d!=obj)
  } // logoutMovement

  addCanvas(){
	var obj = this
	
	// The size of the canvas should be defined by the parent.
	
	let d3canvas = d3.select(obj.graphic.wrapper)
	  .select(".scene-element")
	  .append("canvas")
	  .style("width", "100%")
	  .style("height", "100%")
	let canvas = d3canvas.node()
	  
	canvasobj.sizeCanvas(canvas)
	
	return canvas
  } // addCanvas

  removeCanvas(){
	var obj = this
	
	// Clear the overlay canvas, and draw the contour in the background.
	d3.select(obj.graphic.wrapper)
	  .selectAll("canvas")
	  .remove()
  } // removeCanvas

  drawTempImage(canvas){

	
	let obj = this
	
	
	// Get the required config with the webgl tools required.
	let config = makeWebglDrawConfig(canvas) // ~130ms
	
	// Calculate the appropriate domain and view - the image should appear on the canvas flush in the top left corner.
	let domain = obj.parentobj.data.domain
	config.view = canvasobj.dimensionCanvasView(canvas, obj.parentobj.tools.draw.view.current.v2p)
	let translate = [
		-domain.x[0] + config.view.current.x[0],
		-domain.y[1] + config.view.current.y[1],
		0,
		0
	]
	
	// Plot all surfaces of this file onto hte canvas.
	obj.file.content.forEach(function(surface){
		let triMesh = json2bin( surface )
		
		// draw clears the whole canvas....
		cfD3Contour2d.draw(triMesh, translate, config)
	})
	
	
	/* GET THE IMAGEDATA
	let gl = config.gl
	let height = canvas.height
	let width = canvas.width
	var pixels = new Uint8Array( width*height* 4);
	gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
	console.log(pixels, d3.extent(pixels), height, width); // Uint8Array
	*/
	
  } // drawTempImage

  redrawMasterCanvas(){
	var obj = this
	obj.parentobj.render()
  } // redrawMasterCanvas


  // Tasks to perform on drag.
  onstart(d){
	d.loginMovement() // < 5ms
	let canvas = d.addCanvas() // < 5ms
	d.drawTempImage(canvas) // ~130ms
	d.redrawMasterCanvas() // ~70ms
  } // onstart

  ondrag(d){} // ondrag

  onend(d){
	d.logoutMovement()
	d.removeCanvas()
	d.redrawMasterCanvas()
	d.setPositionValues(d.position())
  } // onend

	
} // contourobj


export class cfD3Contour2d {
  constructor(config){
	// What should enter here? A reference to the basic plot structure. And of course the slice it's supposed to draw.  
		
	// A `sprite' is an image on the canvas.
	this.graphic = {
	  
	  title: "Edit title",
	  sliceId: config.sliceId,
	  wrapper: config.wrapper,
	  canvas: document.getElementById("plotcanvas"),
	  spritewidth: 100,
	  
	} // format
	
	
	// Can eventually be wrapped in the builder.
	canvasobj.sizeCanvas(this.graphic.canvas)
	d3.select(this.graphic.wrapper.getElementsByClassName("content")[0]).datum(this)
	d3.select(this.graphic.canvas).datum(this)
	
	
	// HANDLE THE ZOOM
	d3.select(this.graphic.canvas)
	  .call(d3.zoom().scaleExtent([0.01, Infinity]).on("zoom", zoomCanvas))
		
	// When the plot is updated a new `contourobj' is created for every task in the filter. There is no separation into available and missing, but instead any `contourobjs' for which the files are not retrieved will not have any data, and thus won't be plotted. In essence, the available and missing are not explicitly stated, but can be worked out.
	this.data = {
	  sprites: [],
	  urls: [],
	  domain: [],
	} // data
	
	
	// Setup the config with the elements that are common to all the subimages of contours. The webgl tools are the same for all of them, and so are the view domain and the colormapTexture. Move this to the constructor!!
	
	
	this.tools = {
	  draw: makeWebglDrawConfig(this.graphic.canvas),
	  lasso: {
		points: [],
		tasks: []
	  },
	  dragged: [],
	  tooltip: undefined,
	  trending: undefined
	} // tools
	// Size the canvas

  } // constructor
  
  // draw can be moved outside as well!!
  static draw(mesh, translate, config){
	
	
	
	// Shows the parts of config that are needed.
	let gl = config.gl
	let programInfo = config.programInfo
	let colormapTexture = config.colormapTexture
	
	// Create the buffers.
	const arrays = {
		 a_position: {numComponents: 2, data: mesh.vertices},
		 a_val     : {numComponents: 1, data: mesh.values},
		 indices   : {numComponents: 3, data: mesh.indices}
	};
	const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
	twgl.setBuffersAndAttributes( gl, programInfo, bufferInfo);
	
	let mat4 = glMatrix.mat4
	const projectionMatrix = mat4.create();
	
	// NEED to be declared separately for some reason.
	var xMin = config.view.current.x[0]
	var xMax = config.view.current.x[1]
	var yMin = config.view.current.y[0]
	var yMax = config.view.current.y[1]
	
	mat4.ortho(projectionMatrix, xMin, xMax, yMin, yMax, 0, 1.);
	
	// u_translate has been added to specify the location where the image should be plotted.	
	const uniforms = {
		u_matrix: projectionMatrix, 
		u_translate: translate,
		u_cmap: colormapTexture, 
		u_cmin: mesh.domain.v[0], 
		u_cmax: mesh.domain.v[1]};
	twgl.setUniforms(programInfo, uniforms);
	
	
	// Do the actual drawing
	gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_INT, 0);
	  
	  
  } // draw
  
  render(){
	// Render draws only the contours that are currently not in transit. This allows the background canvas to hold the appropriate background image during interactions.
	// The visualisation consists of 2 layers - the canvas image, and the DOM overlay. The overlay takes care of drawing the card and the border shadow. The cards must be placed correctly over the contour images. The location of the DOM element is readily accessible, and therefore the canvas draws to the location of the card.
	// The cards potentially need to be resized during hte exploration. This must also be done here.
	
	
	
	var obj = this
	
	
	// Resize the DOM cards.
	obj.data.sprites.forEach(function(spriteobj){
		spriteobj.size()
	}) // foreach
	
	
	// Clear canvas.
	obj.tools.draw.gl.clear(obj.tools.draw.gl.clearColor(0, 0, 0, 0))
	
	// Collect all the objects that are not currently being moved.
	let stationary = obj.data.sprites.filter(function(obj_){
		return obj.tools.dragged.indexOf(obj_) < 0
	})
	
	stationary.forEach(function(spriteobj){
		
		// Find the translation to position the image into the dom container.
		let translate = spriteobj.translation
		
		// Plot all surfaces of this file onto hte canvas.
		spriteobj.file.content.forEach(function(surface){
			let triMesh = json2bin( surface )
			
			// draw clears the whole canvas....
			cfD3Contour2d.draw(triMesh, translate, obj.tools.draw)
		})
		
	}) // forEach
	
	
	
	  
  } // render
  

  
  position(){
	// Position the sprites using t-sne
	let obj = this
	
	
	var cp = obj.data.sprites.map(d=>d.file.content[0].data.Cp)
	
	
	// The options MUST be configured correctly for t-sne to produce meaningful results!!
	// perplexity must be smaller than the number of actual cases, maybe a third or so?
	var opt = {}
	opt.epsilon = 10; // epsilon is learning rate (10 = default)
	opt.perplexity = Math.round( cp.length / 5 ); // roughly how many neighbors each point influences (30 = default)
	opt.dim = 2; // dimensionality of the embedding (2 = default)

	var tsne = new tsnejs.tSNE(opt); // create a tSNE instance

	// initialize the raw data.
	tsne.initDataRaw(cp);

	for(var k = 0; k < 5000; k++) {
	  tsne.step(); // every time you call this, solution gets better
	}

	var Y = tsne.getSolution(); // Y is an array of 2-D points that you can plot
	
	
	// This z-score should erally be axis sensitive.
	let xdom = d3.extent(Y, d=>d[0])
	let ydom = d3.extent(Y, d=>d[1])
	
	let w = obj.graphic.canvas.width - 200
	let h = obj.graphic.canvas.height - 100
	
	obj.data.sprites.forEach(function(sprite, i){
		// Give the position in terms of DOM coordinates.
		let pos = [ 
			( Y[i][0] - xdom[0] )/( xdom[1] - xdom[0] )*w,
			( Y[i][1] - ydom[0] )/( ydom[1] - ydom[0] )*h
		]
		sprite.setPositionValues(pos)
		sprite.reposition(sprite.positionvalues)
	})
	
	obj.render()
	
	
	
	  
  } // position
  
  // Requesting and adding data to the plot.
  update(fileobjs){
	// `add' marries the incoming fileobjs to the correponding internal contour objects.
	  
	// Needs to figure out how to handle empty fileobjs!!
	  
	var obj = this
	
	
	// Marry the files to the appropriate objects.
	obj.data.sprites.forEach(function(contourobj){
		// See if the appropriate file is available.
		
		let files = fileobjs.filter(d=>d.url == contourobj.task[obj.graphic.sliceId])
		if(files.length > 0){
			contourobj.file = files[0]
		} // if
	}) // forEach
	
	// Remove any objects without a file? Or render them empty to tell hte user that a particular file was not found??
	
	
	// With the objects and files married, calculate the domain of all variables available.
	obj.data.domain = cfD3Contour2d.domain(obj.data.sprites.map(d=>d.file))
	
	
	// Now calculate the view of the entire canvas.
	let valPerPx = ( obj.data.domain[1] - obj.data.domain[0] ) / obj.graphic.spritewidth
	obj.tools.draw.view = canvasobj.dimensionCanvasView(obj.graphic.canvas, valPerPx)
	
	
	// Now that the domain and view are determined, compute the position value.
	obj.data.sprites.forEach(function(spriteobj){
		spriteobj.setPositionValues(spriteobj.position())
	})
	
	
	// The update is the re-render.
	obj.position()
  } // update
  
  request(tasks){
	// `dbsliceData' asked which files corresponding to the given tasks this plot requires in order to update it's view. 
	
	
	// Within functions the meaning of `this' changes to the local value, as opposed to the class instance.
	var obj = this
	
	// Store a reference to all hte files needed for this plot on hte last update.
	obj.data.urls = tasks.map(task=>task[obj.graphic.sliceId])
	
	
	// Find which of the currently plotted contours has files that will be retained, and which should be removed. The check is done on tasks, as there may be a situation in which the slice of the plot changes, but we still want to keep all the on-screen objects.
	obj.data.sprites = obj.data.sprites.filter(function(contourobj){
		 return tasks.includes(contourobj.task)
	}) // filter
	
	// Create additional contour objects based on the tasks that are not yet represented.
	let plottedTasks = obj.data.sprites.map(d=>d.task)
	tasks.forEach(function(task){
		if(!plottedTasks.includes(task)){
			obj.data.sprites.push( new contour(task, obj) )
		} // if
	}) // forEach
	
	
	// The positioning on-screen should be handled by t-sne immediately!!
	
	
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
	
  // Calculate the common domain of many contour objects.
  static domain(files){
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

} // cfD3Contour2d


// HELPERS

// WEBGL DRAWING. - make a webgl drawing class?
var fragshader = [
	'precision highp float;',
	'uniform sampler2D u_cmap;',
	'uniform float u_cmin, u_cmax;',
	'varying float v_val;',
	'void main() {',
	'  gl_FragColor = texture2D(u_cmap, vec2( (v_val-u_cmin)/(u_cmax-u_cmin) ,0.5));',
	'}'
].join("\n")
	
var vertshader = [
	'attribute vec2 a_position;',
	'attribute float a_val;',
	'uniform vec4 u_translate;',
	'uniform mat4 u_matrix;',
	'varying float v_val;',
	'void main() {',
	'  gl_Position = u_matrix*(vec4(a_position,0,1)+u_translate);',
	'  v_val = a_val;',
	'}'
].join("\n")
		
function makeWebglDrawConfig(canvas){
	
	let t0 = performance.now()
	let webglTools = makeWebglTools(canvas, vertshader, fragshader)
	let t1 = performance.now()
	console.log("makeWebglTools took " + (t1 - t0) + " ms.")
	  
	
	let cmap = colormap("")
	
	return {
	  gl: webglTools.gl,
	  programInfo: webglTools.programInfo,
	  view: undefined,
	  colormapTexture: twgl.createTexture(webglTools.gl, {
		mag: webglTools.gl.LINEAR, 
		min: webglTools.gl.LINEAR, 
		src: cmap, 
		width: cmap.length/4, 
		height:1
	  }),
	}
	  
	  
	  
} // makeWebglDrawConfig
  
function makeWebglTools(canvas, vertshader, fragshader){
	
	// MODIFICATION: preserveDrawingBuffer: true
	// This allows plotting several items on-top of each other.
	let gl = canvas.value = canvas.getContext("webgl", {antialias: true, depth: false}); 
	
	twgl.addExtensionsToContext(gl);
	
	// Program info = move into make?
	let programInfo = twgl.createProgramInfo(gl, [vertshader, fragshader]);
	gl.useProgram(programInfo.program);
	
	return {
		gl: gl,
		programInfo: programInfo
	}
	  
} // makeWebglTools
  
function colormap(name){  
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
		  cmap = d3.range(0,1.05,0.05).map(d => hex2rgb( d3.interpolateViridis(d) ) )
		
	} // switch
	
	return new Uint8Array( [].concat.apply([], cmap) ) ;
	
	
	// Local helper function to transform a hex color code to a rgb triplet.
	function hex2rgb(hex){
		
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
		
	} // hex2rgb

} // colormap

  


// FORMAT CONVERTER - migrate to contour2dFile
function json2bin(surface){
	
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


// Basic dragging of a relative positioned element.
class dragCard {
	constructor(){
		
	  var obj = this
		
	  // Maybe the actual drag should be made outside?? Or should I just make the accessors here?? And wrap them into hte wrapper functions??
	  this.obj = d3.drag()
		.on("start", function(d){
			obj.onstart(d)
			d.onstart(d)
		})
		.on("drag", function(d){
			obj.ondrag(d)
			d.ondrag(d)
		})
		.on("end", function(d){
			obj.onend(d)
			d.onend(d)
		})
		
	} // constructor
	
	
	onstart(d){
		// `d' is the bound object.
		d.graphic.position.mouse = dragCard.getMousePosition(d)
	} // onstart
	
	ondrag(d){
		
		let position = dragCard.calculateNewPosition(d)
					
		// Move the wrapper.
		d3.select( d.graphic.wrapper )
		  .style("left",position.x + "px")
		  .style("top",position.y + "px")
		  
		// Needs a connection to hte top object now...
		
	} // ondrag
	
	onend(d){} // onend
	
	static calculateNewPosition(d){
			
		
		// Get the current wrapper position and the mouse movement on increment.
		let wrapper = dragCard.getWrapperPosition(d)
		let movement = dragCard.calculateMouseMovement(d)
		let width = d.parentobj.graphic.wrapper.offsetWidth
		
		// Don't apply boundaries to movement - if cards are on the side of the canvas when zoomed it prevents them from being dragged.
		// movement = dragCard.applyMovementBoundaries(movement, wrapper, width)
		
		return {
			x: wrapper.x + movement.x,
			y: wrapper.y + movement.y
		}
		
	} // calculateNewPosition
	
	static getMousePosition(d){
			
		let mousePosition = d3.mouse(d.parentobj.graphic.wrapper)
		
		return {
			x: mousePosition[0],
			y: mousePosition[1]
		}
	} // getMousePosition
	
	static getWrapperPosition(d){
		// Calculate the position of the wrapper relative to it's parent
		let el = d.graphic.wrapper
		
		return {
			x: parseInt( el.style.left ),
			y: parseInt( el.style.top ),
			w: el.offsetWidth,
			h: el.offsetHeight
		}
		
	} // getWrapperPosition
	
	static calculateMouseMovement(d){
		
		let mp0 = d.graphic.position.mouse
		let mp1 = dragCard.getMousePosition(d)
		
		let movement = {
			x: mp1.x - mp0.x,
			y: mp1.y - mp0.y
		}
		
		d.graphic.position.mouse = mp1

		return movement
		
	} // calculateMouseMovement
	
	static applyMovementBoundaries(movement, wrapper, width){
		
		// Stop the movement exceeding the container bounds.
		let rightBreach = wrapper.w + wrapper.x + movement.x > width
		let leftBreach = wrapper.x + movement.x < 0
		
		
		if( rightBreach || leftBreach ){
			movement.x = 0
		} // if
		
		// Bottom breach should extend the plot!
		if( wrapper.y + movement.y < 0 ){
			movement.y = 0
		} // if
		
		return movement
		
	} // applyMovementBoundaries
	
	
} // dragCard

function zoomCanvas(obj){
	
	// The default value is 1. Also this will do the panning!! How to do the panning actually?? -> Move teh DOM elements and continually redraw?? This likely won't look well...
		
	// d3/event.transform keeps track of the zoom based on the initial state. Therefore if the scale domain is actually changed, the changes compound later on!! Either reset the event tracker, or keep the domain unchanged, and just update separate view coordinates.
	let view = obj.tools.draw.view
	view.current.x = d3.event.transform.rescaleX( view.scales.x ).domain()
	view.current.y = d3.event.transform.rescaleY( view.scales.y ).domain()
	
	let xdomain = view.current.x
	let xrange = view.scales.x.range()
	let spritexdomain = obj.data.domain.x
	view.current.v2p = (xdomain[1] - xdomain[0]) / (xrange[1] - xrange[0])
	obj.graphic.spritewidth = (spritexdomain[1]-spritexdomain[0])/view.current.v2p;
	
	
	
	// Push the repositioning into render??
	obj.data.sprites.forEach(function(sprite){
		sprite.reposition( sprite.positionvalues )
	})
	
	// Now redraw the canvas.
	obj.render()
	
} // zoomcanvas






// LASSOING - MAKE THIS A SEPARATE MODULE!!

/*



// Lasso
lassoing: function lassoing(ctrl){
	
	var svgOverlay = ctrl.format.wrapper.select("svg.overlay")
	
	var lassoInstance = {
		element: {
			// 'owner': element to attach the lasso to.
			// 'svg'  : where to draw the lasso to
			// 'ref'  : reference for position retrieval
			owner: svgOverlay,
			svg: svgOverlay,
			ref: ctrl.figure
		},
		data: {
			boundary: [],
			getBasisData: function(){ return ctrl.data.plotted; }
		},		
		accessor: {
			// Here the data that is searched after is the position of the card on the screen.
			x: function(d){
				let el = d.graphic.format.wrapper.node()
				return el.offsetLeft + el.offsetWidth/2
			},
			y: function(d){
				let el = d.graphic.format.wrapper.node()
				return el.offsetTop + el.offsetHeight/2
			},
		},
		scales: {
			x: function(x){return x},
			y: function(y){return y}
		},
		preemptive: function(){
			cfD3Contour2d.interactivity.tooltip.tipOff(ctrl)
		},
		response: function(allDataPoints){
			// Highlight the selection
			cfD3Contour2d.helpers.highlight(ctrl, allDataPoints.map(d=>d.task))
			
			// Display the tooltip.
			cfD3Contour2d.interactivity.tooltip.tipOn(ctrl)
		},
	} // lassoInstance
	
	ctrl.tools.lasso = lassoInstance;
	
	lasso.add(lassoInstance)
	
	
}, // lassoing


// Lasso
var lasso = {
	
	/*
	The 'lasso.add' method requires a specific input lasso object, which contains all hte information required.
	
	var lassoObj = {
		element: {
			// 'owner': element to attach the lasso to.
			// 'svg'  : where to draw the lasso to
			// 'ref'  : reference for position retrieval
			owner: svg,
			svg: svg.select("g.markup"),
			ref: svg.select("g.data")
		},
		data: {
			// 'boundary': array holding boundary points
			// 'selection': array holding the selected data
			// 'getBasisData': accessor getting the actual tasks to be selected by the lasso.
			boundary: [],
			selection: [],
			getBasisData: function(){ return data; }
		},		
		accessor: {
			// accessor retrieving the appropriate attributes of underlying data.
			x: function(d){return d.x},
			y: function(d){return d.y},
		},
		scales: {
			// scales to convert the on-screen pixels to the values of the data. Inverse of the scales used to convert values to on-screen position.
			x: val2pxX.invert,
			y: val2pxY.invert
		},
		// Function to execute in response. The selected tasks are the input
		response: highlight,
	}
	*/

	add: function add(lassoObj){
	
		lassoObj.element.owner
		  .call( d3.drag()
			.on("start", function(){
				// Clear previous lasso.
				lassoObj.data.boundary = []
				lasso.draw( lassoObj )
				
				// Perform any pre-emptive action required.
				lassoObj.preemptive()
			})
			.on("drag", function(){
				lasso.addPointToLasso( lassoObj )
				lasso.draw( lassoObj )
			})
			.on("end", function(){
				if(lassoObj.data.boundary.length > 3){
					
					lassoObj.data.selection = lasso.findTasksInLasso(lassoObj)
					
					if(lassoObj.data.selection.length > 0){
						lassoObj.response(lassoObj.data.selection)
					} // if
					
					// After the selection is done remove the lasso.
					lasso.remove( lassoObj )
				} // if
			})
		  )
	
	}, // add
	
	addPointToLasso: function addPointToLasso(lassoObj){
	
		let position = d3.mouse(lassoObj.element.ref.node())
		
		lassoObj.data.boundary.push({
			cx: position[0],
			cy: position[1],
			 x: lassoObj.scales.x(position[0]), 
			 y: lassoObj.scales.y(position[1])
		})
	
	}, // addPointToLasso
	
	findTasksInLasso: function findTasksInLasso(lassoObj){
	
		// Find min and max for the lasso selection. Her the accessors can be hard coded because the points definition is hard coded.
		var dom = {
			x: d3.extent( lassoObj.data.boundary, d=>d.x ),
			y: d3.extent( lassoObj.data.boundary, d=>d.y ),
		}
	
		// Don't get the data through the dom elements - this won't work for canvas lassoing. Instead focus directly on the data in hte plot.
		let allTasks = lassoObj.data.getBasisData()
		
		var selectedTasks = allTasks.filter(function(d_){
			// Check if it is inside the lasso bounding box. Otherwise no need to check anyway.
			
			// Implement an accessor for d.x/y.
			var d = {
				x: lassoObj.accessor.x(d_),
				y: lassoObj.accessor.y(d_),
			}
			
			var isInside = false
			if( 
			  ( (dom.x[0] <= d.x) && (d.x <= dom.x[1]) ) &&
			  ( (dom.y[0] <= d.y) && (d.y <= dom.y[1]) )
			){
				isInside = lasso.isPointInside(d, lassoObj.data.boundary)
			} // if
			
			return isInside
		})
		
		return selectedTasks
	
	}, // findTasksInLasso
	  
	isPointInside: function isPointInside(point, boundary){
		// Check wheteher the 'point' is within the polygon defined by the points array 'boundary'.
		
		var isInside = false
		for(let i=1; i<boundary.length; i++){
			checkIntersect(boundary[i-1], boundary[i], point)
		} // for
		checkIntersect(boundary[boundary.length-1], boundary[0], point)
		
		return isInside
		
		// Need to check the same number of edge segments as vertex points. The last edge should be the last and the first point.
	
		function checkIntersect(p0, p1, point){
			// One point needs to be above, while the other needs to be below -> the above conditions must be different.
			
			if( (p0.y > point.y) !== (p1.y > point.y) ){
				// One is above, and the other below. Now find if the x are positioned so that the ray passes through. Essentially interpolate the x at the y of the point, and see if it is larger.
				let x = (p1.x - p0.x)/(p1.y - p0.y)*(point.y - p0.y) + p0.x
				
				isInside = x > point.x ? !isInside : isInside
				
			} // if
		} // checkIntersect
	
	}, // isPointInside
		
	draw: function draw(lassoObj){
		
		var d = [lassoObj.data.boundary.map(d=>[d.cx, d.cy].join()).join(" ")]
		
		lassoObj.element.svg
		  .selectAll("polygon")
		  .data(d)
		  .join(
			enter => enter.append("polygon")
						  .attr("points", d=>d)
						  .style("fill", "cornflowerblue")
						  .style("stroke", "dodgerblue")
						  .style("stroke-width", 2)
						  .attr("opacity", 0.4),
			update => update
						  .attr("points", d=>d),
			exit => exit.remove()
		  )
		
		 
	}, // draw
	
	remove: function remove(lassoObj){
	
		lassoObj.element.svg
		  .selectAll("polygon")
		  .remove()
	} // remove
	
} // lasso

*/

