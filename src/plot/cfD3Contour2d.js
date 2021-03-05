import { dbsliceData } from "/src/core/dbsliceData.js"
// The plots should be able to take care of themselves, therefore they must have access to the data on their own too - thus `dbsliceData' must be imported here.

import { contour2dFile } from "/src/core/fileClasses.js"
// When requesting the appropriate data the plot must also specify the appropriate file class, therefore it must be imported here.


import * as tsnejs from "/src/outside/tsne_module.js"
// `t-sne' module adapted from: https://github.com/karpathy/tsnejs


import * as clustering from "/src/core/kmeans.js"
// Custom implementation of the k-means algorithm.



/* CLUSTERING INTERFACE

A decision has to be made for the k-means grouping algorithm interface. The k-means algorithm requires 3 inputs: number of groups, initial centroids for the groups, and the distance metric. The distance metric has to be hard-coded, for large sprite data the centroids cannot be given through direct interactivity, but the number of groups can be set interactively. For smooth interactivity the centroids must be deduced from the number of groups. Options are:
	1.) Piles. The user creates piles as seen in piling.js. The piles that are on-screen are the initial groups. The piles already have some members, which can be used to calculate the centroids. The output is groups with all the on-screen sprites assigned to groups, and the results should be visualised. There are several visualisation options available.
		i. Groups and sprites are both kept. Border color denotes which groups each sprite belongs to. However, what happens if during the clustering all the initial members of a group are assigned out of this group? The groups will require at least one member, as it will need to show some sprite. The lasso toll can be used to combine them all together.
		ii. Only groups are kept. All the sprites are encompassed by the groups. A potential disadvantage is that the sprites are automatically piled, and the mean and standard deviation plots would have to be used to assess if the groups make sense. Another disadvantage is that the interface will look a lot like piling.js. 
		iii. Only sprites are kept. The groups are dissolved, and the sprites have their borders colored. A disadvantage is that the groups disappear. However, an advantage is that the user is prompted to inspect the actual data before piling the data. An additional advantage is that the piles play a lesser role. Completely ungroup the groups within the groups?
	2.) Points. Instead of making the piles, the user can click on the screen to initialise the group, and increase the number of groups by 1. A dictinct disadvantage is that a specific group marker must be introduced to show the user where they have positioned the group. Additionally, after the marker is placed, the centroids can only be deduced based on the on-screen position of the marker, and the sprites. The only reasonable option to show the results is to highlight the borders of the individual sprites.

Groups are not colored in as tehy can contain members of different clusters. When the major groups are ungrouped they will just appear without a border.

*/





// A class that will control the canvas and teh link between the DOM coordinates and data values.
class canvasobj {
  static spritewidth = 100
	
  constructor(canvas, v2p){
	this.canvas = canvas
	this.spritewidth = canvasobj.spritewidth
	
	this.scales = {
	  x: d3.scaleLinear()
		.domain( [0, canvas.width*v2p ] )
		.range(  [0, canvas.width     ] ),
	  y: d3.scaleLinear()
		.domain( [0, canvas.height*v2p ] )
		.range(  [0, canvas.height     ] )
	} // scales
	
	this.current = {
	  x: [0, canvas.width*v2p ],
	  y: [0, canvas.height*v2p],
	  v2p: v2p
	} // current
		
  } // constructor
  
  transform(){
	
	// d3/event.transform keeps track of the zoom based on the initial state. Therefore if the scale domain is actually changed, the changes compound later on!! Either reset the event tracker, or keep the domain unchanged, and just update separate view coordinates.
	let view = this.current
	view.x = d3.event.transform.rescaleX( this.scales.x ).domain()
	view.y = d3.event.transform.rescaleY( this.scales.y ).domain()
	
	let v2p_new = (view.x[1] - view.x[0]) / this.canvas.width
	let k = v2p_new / view.v2p
	view.v2p = v2p_new
	
	this.spritewidth = this.spritewidth / k;
	
  } // transform
	
  pixel2data(pixelpoint){
	// Transform into the data values. B
	let view = this.current
	let dom = {
		x: [0, this.canvas.width ], 
		y: [0, this.canvas.height]
	}
	
	return canvasobj.domA2domB(pixelpoint, dom, view)
  } // pixel2data
	
  data2pixel(datapoint){
	// Transform into the data values. B
	let view = this.current
	let dom = {
		x: [0, this.canvas.width], 
		y: [0, this.canvas.height]
	}
	  
	return canvasobj.domA2domB(datapoint, view, dom)
  } // pixel2data
	
	

  
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
class sprite {
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
	let wrapper = document.createElement( 'div' );
	wrapper.className = 'list-item';
	wrapper.style.position = "absolute";
	wrapper.style.left = "0px";
	wrapper.style.top = this.parentobj.graphic.canvas.offsetTop + "px";

	let sceneElement = document.createElement( 'div' );
	sceneElement.className = 'scene-element';
	wrapper.appendChild( sceneElement );

	/* Maybe append the name text only on mouseover?
	const descriptionElement = document.createElement( 'div' );
	descriptionElement.className = "description-element";
	descriptionElement.innerText = 'Test scene';
	wrapper.appendChild( descriptionElement );
	*/
	
	parentobj.graphic.container.appendChild( wrapper );
	this.graphic.wrapper = wrapper
	let d3card = d3.select(wrapper).datum(this)
	
	let dragobj = new dragCard()
	d3card.call(dragobj.obj)
	
	
  } // constructor
	
	
	
  size(){
	// Size the window for the sprite appropriately. Note that since the size depends on a single value in the parentobj all the contours are forced to be the same size all the time. Thereforethe user will have to zoom into a contour if they wish to see it up close, and consequently the resizing controls are not necessary!
	let obj = this
	
	let domain = obj.parentobj.data.domain
	let v2p = obj.parentobj.graphic.view.current.v2p
	let spritewidth = obj.parentobj.graphic.view.spritewidth
	let spriteheight = ( domain.y[1] - domain.y[0] ) / v2p
	
	d3.select(obj.graphic.wrapper)
	  .select("div.scene-element")
	  .style("width", spritewidth + "px")
	  .style("height", Math.round(spriteheight) + "px")		
  } // size

  set position(point){
	// Position the DOM wrapper to the coordinates in point.
	this.graphic.wrapper.style.left = point[0] + "px"
	this.graphic.wrapper.style.top = point[1] + "px"
	  
	this.setPositionValues(point)
  } // position
  
  get position(){
	// Get the DOM position of the contour relative to the canvas.
	let obj = this
	let wrapper = obj.graphic.wrapper
	return [parseInt(wrapper.style.left), parseInt(wrapper.style.top)]
  } // position
  
  get midpoint(){
	let obj = this
	let wrapper = obj.graphic.wrapper
	return [
		parseInt(wrapper.style.left) + wrapper.offsetWidth/2,
		parseInt(wrapper.style.top) + wrapper.offsetHeight/2
	]
  } // midpoint
	
	
  // Maybe something about resolving internal position conflict? Consistency. Or just make a getter and setter for positionvalue.
  setPositionValues(pos){
	// Set the position value for easy retrieval later on.
	this.positionvalues = this.parentobj.graphic.view.pixel2data(pos)
  } // setPositionValues
	
  // Rename reposition and maybe combine it with something??
  reposition(point){
	// Position the DOM wrapper to where the values in `point' are on the canvas.
	let pos = this.parentobj.graphic.view.data2pixel(point)
	this.position = pos
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
	let view = obj.parentobj.graphic.view.current
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
	let view = new canvasobj( canvas, obj.parentobj.graphic.view.current.v2p )
	
	let translate = [
		-domain.x[0] + view.current.x[0],
		-domain.y[1] + view.current.y[1],
		0,
		0
	]
	
	// Plot all surfaces of this file onto hte canvas.
	obj.file.content.forEach(function(surface){
		let triMesh = json2bin( surface )
		
		// draw clears the whole canvas....
		draw(triMesh, translate, config, view)
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

  // Checking groups, and k-means
  checkMembershipOpportunities(){
	let obj = this  
	let groups = obj.parentobj.data.sprites.filter(function(spriteobj){
		return (spriteobj instanceof spritegroup) && (spriteobj != obj)
	}).filter(function(spritegroup){
		let wrapper = obj.graphic.wrapper
		return (Math.abs( spritegroup.midpoint[0] - obj.midpoint[0] ) < wrapper.offsetWidth / 2)
	 	    && (Math.abs( spritegroup.midpoint[1] - obj.midpoint[1] ) < wrapper.offsetHeight / 2)
	})

	if(groups.length > 0){
		// Find which group fits best.
		obj.joinClosestGroup(groups)
	} // if
	  
	  
  } // checkMembershipOpportunities
  
  joinClosestGroup(groups){
	let obj = this
	
	let closest = groups.reduce(function(acc, group){
		let dist = (group.midpoint[0]-obj.midpoint[0])**2 + (group.midpoint[1]-obj.midpoint[1])**2
		
		// But now it's always added. It should only be added if it's over a group. At least half over the group
		if(acc.group){ 
			if(dist < acc.dist){
				acc.group = group
				acc.dist = dist
			} // if
		} else {
			acc.group = group
			acc.dist = dist
		} // if
		return acc
	}, {group: undefined, dist: undefined})
	
	closest.group.addmembers([obj])
	
  } // closestGroup

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
	d.setPositionValues( d.position )
	d.checkMembershipOpportunities()
	d.redrawMasterCanvas()
  } // onend

	
  // Hide and show.
  show(){
	this.graphic.wrapper.style.display = "block"
  } // show
  
  hide(){
	this.graphic.wrapper.style.display = "none"
  } // hide
	
} // sprite


// `spritegroup' is the class that controls the group behaviour. It uses much of the same behavior as `sprite', and is similar in appearance. The difference is that a `sprite' represents a single task, while the `spritegroup' connects many.
class spritegroup extends sprite {
  constructor(sprites, parentobj){
	super(sprites.map(d=>d.task), parentobj)
	this.sprites = []
	let obj = this
	
	
	// Add the sprites to internal storage, reposition all the appropriate DOM wrappers, log the member sprites as `in-transit', and hide their DOM wrappers.
	obj.addmembers(sprites)
	
	// Add the file of some sprite to the groupobj. This will be the contour that appears in hte group DOM window on hte master cnavas.
	obj.file = sprites[0].file
	
	
	// Make additional DOM backbone.
	obj.make()
	
	
	// Update teh preview elements.
	obj.update()
	
  } // constructor

  make(){
	let obj = this
	// Make the DOM backbone.
	
	let d3card = d3.select( obj.graphic.wrapper )
	d3card.attr("class", "group-item")
	
	let d3groupUtils = d3card
	  .append("div")
	    .attr("class", "group-previews")
	let d3groupControls = d3card
	  .append("div")
	    .attr("class", "group-controls")
	
	let ungroupButton = d3groupControls
	  .append("a")
	    .attr("class", "btn-circle")
		.style("float", "right")
	  .append("i")
	    .attr("class", "fa fa-" + "close")
		.style("cursor", "pointer")
	
	ungroupButton.on("click", function(){
		obj.ungroup()
	})
	
	// Need to implement an ungroup fuctionality? Long click and then a close button??
	d3groupControls.style("display", "none")
	
	// Add functionality to activate it.
	// What about on mouseover and if ctrl is pressed??
	d3card.on("mouseover", function(){
		if(event.ctrlKey){
			// If the display is already on do nothing, otherwise turn it on.
			if( d3groupControls.style("display")=="none" ){
				d3groupControls.style("display", "")
			} // if
		} else {
			if( d3groupControls.style("display")!="none" ){
				d3groupControls.style("display", "none")
			} // if
		} // if
	})
	
	d3card.on("mouseout", function(){
		d3groupControls.style("display", "none")
	})
	
  } // function

  update(){
	let obj = this
	
	// When new members join the group update the preview elements.
	
	d3.select(obj.graphic.wrapper)
	  .select("div.group-previews")
	  .selectAll("div.preview-element")
	  .data( obj.sprites, d=>d.task.taskId )
	  .join(
	    enter => enter.append("div")
		  .attr("class", "preview-element")
		  .on("mouseenter", function(sprite){
			  obj.file = sprite.file;
			  obj.parentobj.render();
		  }),
		update => update,
		exit => exit.remove()
	  ) // join
  } // update

  addmembers(sprites){
	let obj = this
	
	obj.sprites = obj.sprites.concat(sprites) 
	
	
	// Pile the constituent sprites.
	let anchor = obj.pile()
	obj.setPositionValues(anchor)
	
	// Log the constituent sprites as in transit so they don't need to be drawn. Also, hide their DOMs - they won't be needed as long as they are in a group.
	sprites.forEach(function(sprite){
		sprite.loginMovement()
		sprite.hide()
	})
	
	// Update the preview divs.
	obj.update()

  } // addmembers

  ungroup(){
	// Log the sprites out of movement, and show their DOM windows again.
	let obj = this
	
	// A group can also contain other groups. The contained groups should still contain all their sprites. Collect the groups here, and don't release any of their sprites.
	let groups = obj.sprites.filter(function(sprite){return sprite instanceof spritegroup})
	
	
	// When ungrouping offset the constituent members a bit, so that it is apparent there are several sprites there.
	let ungrouped = obj.sprites.filter(function(sprite){
		return !groups.some(function(group){return group.sprites.includes(sprite)})
	}) // filter
	
	let arc = 2*Math.PI/ungrouped.length
	ungrouped.forEach(function(sprite, i){
		let offset = [10*Math.cos(arc*i), 10*Math.sin(arc*i)]
		sprite.position = obj.position.map(function(p,j){return p + offset[j]})
		sprite.logoutMovement()
		sprite.show()
	})
	
	
	// Remove the dom wrapper, and remove itself from the parent.
	obj.graphic.wrapper.remove()
	obj.parentobj.data.sprites = obj.parentobj.data.sprites.filter(function(sprite){
		return sprite != obj
	})
	
	obj.parentobj.render()
	
  } // ungroup
  
  size(){
	super.size()
	
	let d3card = d3.select(this.graphic.wrapper)
	d3card
	  .select("div.group-previews")
	  .style("max-width", d3card.select("div.scene-element").node().offsetWidth + "px" )
	
	  
  } // size

  pile(){
	// Calculate the anchor of the selection, and position all the sprites there.
	let obj = this
	
	let anchor = obj.sprites.reduce(function(acc, sprite){
		let m = sprite.position
		acc[0] += m[0]/obj.sprites.length
		acc[1] += m[1]/obj.sprites.length
		return acc
	}, [0,0])
	
	
	obj.sprites.forEach(function(sprite){
		sprite.position = anchor
		sprite.setPositionValues(anchor)
	})
	
	// Return the selection anchor to allow the group DOM to be positioned there.
	return anchor
  } // pile
	
  onend(d){
	super.onend(d)
	
	// Also adjust internal position of all member sprites.
	d.sprites.forEach(function(sprite){
		sprite.position = d.position
	})
  } // onend
	
} // spritegroup




// The main plot.
export class cfD3Contour2d {
  constructor(config){
	// What should enter here? A reference to the basic plot structure. And of course the slice it's supposed to draw.  
		
	// A `sprite' is an image on the canvas.
	this.graphic = {
	  
	  sliceId: config.sliceId,
	  wrapper: config.wrapper,
	  container: d3.select(config.wrapper).select("div.content").node(),
	  canvas: document.getElementById("plotcanvas"),
	  overlay: document.getElementById("overlay"),
	  view: undefined
	  
	} // format
	
	
	// Can eventually be wrapped in the builder.
	canvasobj.sizeCanvas(this.graphic.canvas)
	d3.select(this.graphic.wrapper.getElementsByClassName("content")[0]).datum(this)
	d3.select(this.graphic.canvas).datum(this)
	
	
	
		
	// When the plot is updated a new `contourobj' is created for every task in the filter. There is no separation into available and missing, but instead any `contourobjs' for which the files are not retrieved will not have any data, and thus won't be plotted. In essence, the available and missing are not explicitly stated, but can be worked out.
	this.data = {
	  sprites: [],
	  urls: [],
	  domain: [],
	} // data
	
	
	// Setup the config with the elements that are common to all the subimages of contours. The webgl tools are the same for all of them, and so are the view domain and the colormapTexture. Move this to the constructor!!
	
	let obj = this
	this.tools = {
	  dragged: [], // logs which sprites are being moved
	  selected: [], // log the lassoed sprites
	  draw: makeWebglDrawConfig(this.graphic.canvas),
	  lasso: new lasso( this.graphic.overlay, this ),
	  toolbar: new toolbar( this ),
	  trending: undefined
	} // tools
	
	
	
	// HANDLE THE ZOOM
	d3.select(this.graphic.canvas)
	  .call(d3.zoom().scaleExtent([0.01, Infinity]).on("zoom", function zoomCanvas(obj){
		obj.graphic.view.transform()
		obj.render()
	}))
	
	
	

  } // constructor

  // Redraw the master canvas.
  render(){
	// Render draws only the contours that are currently not in transit. This allows the background canvas to hold the appropriate background image during interactions.
	// The visualisation consists of 2 layers - the canvas image, and the DOM overlay. The overlay takes care of drawing the card and the border shadow. The cards must be placed correctly over the contour images. The location of the DOM element is readily accessible, and therefore the canvas draws to the location of the card.
	// The cards potentially need to be resized during hte exploration. This must also be done here.
	
	
	
	var obj = this
	
	
	// Resize the DOM cards.
	obj.data.sprites.forEach(function(spriteobj){
		spriteobj.reposition( spriteobj.positionvalues )
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
			let mesh = json2bin( surface )
			
			// draw clears the whole canvas....
			draw(mesh, translate, obj.tools.draw, obj.graphic.view)
		})
		
	}) // forEach
	
	
	
	  
  } // render

  
  // t-sne to position cards.
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
	} // for

	var Y = tsne.getSolution(); // Y is an array of 2-D points that you can plot
	
	
	// This z-score should erally be axis sensitive.
	let xdom = d3.extent(Y, d=>d[0])
	let ydom = d3.extent(Y, d=>d[1])
	
	let canvas = obj.graphic.view.canvas
	obj.data.sprites.forEach(function(sprite, i){
		// Give the position in terms of DOM coordinates.
		let pos = [ 
			( Y[i][0] - xdom[0] )/( xdom[1] - xdom[0] )*(canvas.width - 200) + canvas.offsetLeft,
			( Y[i][1] - ydom[0] )/( ydom[1] - ydom[0] )*(canvas.height - 100) + canvas.offsetTop
		]
		sprite.setPositionValues( pos )
		sprite.reposition(sprite.positionvalues)
	})
	
	obj.render()
	
	
	
	  
  } // position
  
  // t-sne position reinitialisation.
  restart(){
	let obj = this
	  
	// First remove all the groups.
	obj.data.sprites = obj.data.sprites.filter(function(sprite){
		let isgroup = sprite instanceof spritegroup
		if(isgroup){sprite.ungroup()} // if
		return !isgroup
	}) // filter
	  
	// Now show all the sprite DOMs.
	obj.data.sprites.forEach(function(sprite){
		sprite.show()
		sprite.logoutMovement()
	}) // forEach
	  
	obj.position()
	  
  } // restart

  // k-means categorication.
  cluster(){
	let obj = this
	  
	/* 
	This plot can be seen as the interface for the k-means algorithm. Three inputs need to be provided to the k-means algorithm: 
		1.) Number of clusters
		2.) Initial centroids
		3.) Distance metric
	
	The groups provide a natural way to capture the first two inputs. It is assumed that the user has built representative groups. The number of groups can be used as the number of clusters. Any sprites that are not a part of group can be added to the closest group. Then the centroids are the means of the sprites of a group.
	*/
	
	
	// Remove all the kmeans styling.
	obj.data.sprites.forEach(function(sprite){
		sprite.graphic.wrapper.style.border = "none"
	}) // forEach
	
	// Wrap the sprites and spritegroups into surrogate objects to be used during clustering.
	let points = obj.data.sprites
	  .filter(function(sprite){
		return !(sprite instanceof spritegroup)
	}).map(function(sprite){
		return {
			refobj: sprite,
			pos: sprite.midpoint,
			cp: sprite.file.content[0].data.Cp
		}
	}) // map
	
	
	// How to make sure that the groups within groups are not used as the kernels?
	console.log("keep in mind the groups within the groups!!")
	let groups = obj.data.sprites
	  .filter(function(sprite){
		return sprite instanceof spritegroup
	}) // filter
	let topgroups = groups.filter(function(group){
		// Top groups are those that do not appear in other groups.
		return !groups.some(function(group_){
			return group_.sprites.includes(group)
		}) // some
	}).map(function(sprite, i){
		return new clustering.kgroup(sprite, sprite.midpoint)
	}) // map
	
	
	
	// Also check here if there are enough groups to perform clustering.
	if(topgroups.length > 1){	
		
		let kmeans = new clustering.kmeans( points )
		
		topgroups.forEach(function(group){
			kmeans.addgroup(group)
		}) // forEach
		
		kmeans.cluster()
		
		// Indicate the grouping results. A good compromise (discussed above) is to just keep the sprites, and color code their borders. The groups should be removed. It's relatively easy to create a new group using the lasso tool anyway.
		kmeans.groups.forEach(function(group){
			group.refobj.ungroup()
		}) // forEach
		
		
		
		// Store the kmeans object.
		obj.tools.kmeans = kmeans;
		
		// Unhighlighting removes the lasso highlight, and applies underlying highlights, such as the k-means clustering highlight.
		obj.unhighlight()
		
		
		// Also, when clustering has been performed update the control button group. It will now need to feature a button that clears the clustering.
		
	} // if
	
	obj.render()
	
  } // cluster
  
  // Lasso tools.
  onlassostart(){
	let obj = this
	
	// Remove all toolbar.
	obj.tools.toolbar.hide()
	
	//
  } // onlassostart
  
  onlassoend(){
	// Find all the sprites that were selected by the lasso.
	let obj = this
	
	// Find the circled tasks.
	let selected = obj.data.sprites.filter(function(spriteobj){
		return obj.tools.lasso.iswithin(spriteobj.midpoint)
	})
	
	
	// Highlight the corresponding DOM elements.
	selected.forEach(function(spriteobj){
		spriteobj.graphic.wrapper.style.border = "solid 4px gainsboro"
	})
	
	// Save the current selection.
	obj.tools.selected = selected
	
	// Make a toolbar.
	obj.tools.toolbar.show()
	
  } // onlassoend
  
  // Grouping functionality
  ongroup(){
	// Create a new `spritegroup', and log it into the `cfD3Contour2d' instance. It should be logged alongside the regular sprites.
	let obj = this
	
	// The obj has access to the lassoed elements under `obj.tools.selected'. If 
	obj.data.sprites.push( new spritegroup(obj.tools.selected, obj) )
	  
	// Rerender the master canvas.
	obj.render()
	
	// Hide the toolbar.
	obj.tools.toolbar.hide()
	
	// Remove the border highlight.
	obj.unhighlight()
	  
  } // ongroup
  
  unhighlight(){
	let obj = this
	
	// First remove the border highlight.
	obj.data.sprites.forEach(function(spriteobj){
		spriteobj.graphic.wrapper.style.border = "none"
	})
	
	
	// See if a clustering highlight may be is still required/
	if(obj.tools.kmeans){
		let bordercolor = d3.scaleOrdinal(d3.schemeCategory10)
		obj.tools.kmeans.points.forEach(function(point){
			point.refobj.graphic.wrapper.style.border = "solid 4px " + bordercolor(point.groupid)
		}) // forEach
	} // if
	  
	
  } // unhighlight
  
  
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
	let valPerPx = ( obj.data.domain.x[1] - obj.data.domain.x[0] ) / canvasobj.spritewidth
	obj.graphic.view = new canvasobj( obj.graphic.canvas, valPerPx )
	
	
	
	
	// Now that the domain and view are determined, compute the position value.
	obj.data.sprites.forEach(function(spriteobj){
		spriteobj.setPositionValues( spriteobj.position )
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
			obj.data.sprites.push( new sprite(task, obj) )
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
	
  // Move into the file class object??
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

// WEBGL DRAWING. - make a webgl drawing class -> webgldrawmesh?
// Info on webgl
// http://math.hws.edu/graphicsbook/c7/s1.html#webgl3d.1.2	
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
	  
	
	let cmap = colormap("spectral")
	
	return {
	  gl: webglTools.gl,
	  programInfo: webglTools.programInfo,
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
		  cmap = d3.range(0,1.05,0.05).map(d => hex2rgb( d3.interpolateSpectral(d) ) )
		
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

function draw(mesh, translate, config, view){
	
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
	var xMin = view.current.x[0]
	var xMax = view.current.x[1]
	var yMin = view.current.y[0]
	var yMax = view.current.y[1]
	
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
    


// BELONG TO OTHER MODULES


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
			if(d.onstart){d.onstart(d)}
		})
		.on("drag", function(d){
			obj.ondrag(d)
			if(d.ondrag){d.ondrag(d)}
		})
		.on("end", function(d){
			obj.onend(d)
			if(d.onend){d.onend(d)}
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






// Lasso
class lasso {
	
  /*
	`lasso' creates a new lasso instance, based on the `overlay' svg dom element. In addition to collecting the points selected by the user it also performs a user specified action on the start and end of lassoing.
	
	The lasso only collects the selected region, and passes it to the user. The search for any data in the graphic must be done by the plot. Lasso does provide functionality (lasso.iswithin) to check whether a particular pixel on the svg is within it.
  */
  	
  constructor(overlay, parentobj){
	
	
	// Declare the most important attributes. Note that the lasso does NOT find it's own selected data! The `selected' attribute is only a placeholder here to allow the user to store the results in it. This is to simplify the lasso code by moving the data identification out.
	this.svg = overlay
	this.boundary = []
	
	
	// Add behavior to the overlay.
	d3.select(overlay.parentElement).on("mousemove", function(){
	  if (event.shiftKey) {
		  overlay.style.display = "block"
	  } else {
		  overlay.style.display = "none"
	  } // if
	}) // on
	
	let obj = this
	d3.select(overlay)
	  .call( d3.drag()
		.on("start", function(){
			// Clear previous lasso, remove graphic, remove toolbar.
			obj.boundary = []
			obj.draw()
			parentobj.onlassostart(obj)
		}) // on
		.on("drag", function(){
			obj.addpoint()
			obj.draw()
		}) // on
		.on("end", function(){
			if(obj.boundary.length > 3){
				parentobj.onlassoend(obj)
			} // if
			obj.remove()
		}) // on
	  ) // call
	
  } // constructor


  

  addpoint(){
	let obj = this
	obj.boundary.push(d3.mouse(obj.svg))
  } // addpoint
  

  iswithin(point){
	// Check wheteher the `point' is within the polygon defined by the boundary of the lasso in `this.boundary'. The check is based on the idea that any ray starting from `point' must pass the boundary an odd number of times if it is within it, and an even number of times otherwise. For simplicity a horizontal ray was selected. The boundary is imagined as straight segments between neighbouring points of `this.boundary'. Every segment is checked to see whether the ray crosses it. As the ray is expected to run in one dimension only, the `isInside' flag is only changed if the segment is a boundary segment, AND if the crossing point is to the right of the initial point. The check could be optimised further by only considering the part of the lasso that is to the right of the selected point. A separate improvement could allow the user to input an array of points to be checked.
	let boundary = this.boundary
	
	var isInside = false
	for(let i=1; i<boundary.length; i++){
		checkIntersect(boundary[i-1], boundary[i], point)
	} // for
	checkIntersect(boundary[boundary.length-1], boundary[0], point)
	
	return isInside
	
	// Need to check the same number of edge segments as vertex points. The last edge should be the last and the first point.

	function checkIntersect(p0, p1, point){
		// One point needs to be above, while the other needs to be below -> the above conditions must be different.
		
		if( (p0[1] > point[1]) !== (p1[1] > point[1]) ){
			// One is above, and the other below. Now find if the x are positioned so that the ray passes through. Essentially interpolate the x at the y of the point, and see if it is larger.
			let x = (p1[0] - p0[0])/(p1[1] - p0[1])*(point[1] - p0[1]) + p0[0]
			
			isInside = x > point[0] ? !isInside : isInside
			
		} // if
	} // checkIntersect

  } // iswithin
	
  draw(){
	let obj = this
	
	// Create the data for a single polygon
	var d = [obj.boundary.map(d=>d.join()).join(" ")]
	
	d3.select(obj.svg)
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
	  ) // join
  } // draw

  remove(){
	let obj = this
	d3.select(obj.svg)
	  .selectAll("polygon")
	  .remove()
  } // remove
	
} // lasso

// Grouping toolbar
class toolbar {

  constructor(parentobj){
	// Has to have the graphic,
	this.graphic = {
		wrapper: undefined,
		position: {}
	} // graphic
	this.parentobj = parentobj
	
	// Make the toolbar.
	var d3toolbar = d3.select(parentobj.graphic.wrapper)
	  .append("div")
		.attr("class", "contourTooltip")
		.style("display", "none")
		.style("cursor", "pointer")
	this.graphic.wrapper = d3toolbar.node()

	// Add the dragging.
	let dragobj = new dragCard()
	d3toolbar.datum( this )
	d3toolbar.call(dragobj.obj)


	// MOVE? : Should the assemply of options be moved outside for greater flexibility? Also, how would I otherwise access the functionality required?? 
	let obj = this
	addButton("stack-overflow", d=>parentobj.ongroup())
	addButton("tags", d=>console.log("tag"))
	addButton("close", function(d){obj.hide(); parentobj.unhighlight()})
	
	function addButton(icon, event){
	  d3toolbar
	    .append("button")
		  .attr("class", "btn")
		  .on("click", event)
	    .append("i")
		  .attr("class", "fa fa-" + icon)
		  .style("cursor", "pointer")
	} // addButton

  } // constructor

  show(){
	// Position hte tooltip By finding the mean of all hte selected sprites.
	let obj = this
	
	
	let selected = obj.parentobj.tools.selected
	var position = selected.reduce(function(total, spriteobj){
		let midpoint = spriteobj.midpoint
		total.x += midpoint[0] / selected.length
		total.y += midpoint[1] / selected.length
		return total
	},
	{x: 0, y: 0})
	
	// Offset by the expected tooltip size. How to calculate that when display:none?
	let style = obj.graphic.wrapper.style
	style.display = "block"
	style.left = (position.x-100) + "px"
	style.top = (position.y-30) + "px"
	  
	  
  }  // show
		
  hide(){
	let obj = this
	obj.graphic.wrapper.style.display = "none"
  } // hide
} // toolbar




























