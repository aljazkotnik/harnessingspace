export class kgroup {
  constructor(pos){
	this.pos = pos;
	this.previous = []
	this.members = [];
	this.changed = true;
	this.id = 0;
  } // constructor

  average(accessor){
	let obj = this

	let n = obj.members.length
	return obj.members.reduce(function(acc, member){
		let vals = accessor(member)
		if(acc){
			acc = acc.map(function(v,i){return v + vals[i]/n})
		} else {
			acc = vals.map(function(v){return v/n})
		} // if
		return acc
	}, undefined) // reduce

  } // average
  
  update(){
	let obj = this
	obj.cp = obj.average(d=>d.cp)
	obj.pos = obj.average(d=>d.pos)
  } // update
} // kgroup
	
	
export class kmeans {
  constructor(points){
	// The incoming points can be complicated objects. Wrap them appropriately for internal use. The k-means object will require an accessor to hte on-screen position of the incoming objects, as well as to the array that should be used in the k-means. 
	  
	this.groups = []
	this.points = points
	this.i = 0
  } // constructor
	
  addgroup(pos){
	let obj = this
	
	// Must have less groups than points!
	if(obj.groups.length < obj.points.length){
	
		// When a new group is added the groups should be reinitialised.
		obj.groups.push(new kgroup(pos))
	
		obj.groupinit()
	
	} // if
	
  } // addgroup

  groupinit(){
	let obj = this
	
	// Update group ids.
	obj.groups.forEach(function(group, i){
		group.id = i
		group.members = []
	})

	// Distribute the points between the groups.
	obj.points.forEach(function(point, i){
		let closest = kmeans.findclosestgroup(point, obj.groups, d=>d.pos)
		closest.group.members.push(point)
		point.groupid = closest.group.id
		
	})
	
	
	// FORCE THE GROUPS TO HAVE MEMBERS!!
	obj.groups.forEach(function(group){
		if(group.members.length < 1){
			// Find the group with the maximum amount of points.
			let largest = obj.groups.reduce(function(acc, group){
				return acc.members.length > group.members.length ? acc : group
			}, {members: []}) // reduce
			
			let donated = largest.members.splice(0,1)[0]
			
			group.members.push(donated)
			donated.groupid = group.id
		} // if
	})
	
	
	// Calculate initial centroids.
	obj.groups.forEach(function(group, i){
		group.cp = group.average(d=>d.cp)
	})
	

  } // groupinit
	
  clear(){
	let obj = this
	obj.groups = []
  } // clear
  
	
  cluster(){
	let obj = this
	
	if(obj.groups.length > 1){
	
		// Calculate the centroids.
		obj.i = 0
		while( obj.groups.some(function(group){return group.changed}) ){
			
			
			
			let t0 = performance.now()
			obj.step()
			let t1 = performance.now()
			
			console.log("step:", obj.i, " dt: ", t1 - t0, "ms")
			
			
			if(obj.i > 100){
				console.log("Iteration limit exceeded")
				break;
			} // if
			
		} // while
	
	} // if

  } // cluster
  
  step(){
	
	let obj = this
	
	// Recalculate centroids, purge the membership, but keep a log.
	obj.groups.forEach(function(group){
		group.update()
		group.previous = group.members
		group.members = []
	}) // forEach
	
	// Redistribute sprites
	obj.points.forEach(function(point){
		// Find the closest group.
		let closest = kmeans.findclosestgroup(point, obj.groups, d=>d.cp)
		closest.group.members.push(point)
		point.groupid = closest.group.id
	}) // forEach
	
	
	// Check if there is a difference between the previous and current group membership.
	obj.groups.forEach(function(group){
		
		let isMembershipSame = aContainsB(group.previous, group.members) 
		                    && aContainsB(group.members , group.previous)
		
		group.changed = !isMembershipSame;
		
	}) // forEach
	
	
	obj.i += 1
	
  } // step
	
	
  static findclosestgroup(point, groups, accessor){
	
	return groups.reduce(function(current, group){
		let dist = kmeans.euclidean(accessor(group), accessor(point))
		if(dist < current.dist){
			current.group = group
			current.dist = dist
		} // if
		return current
	}, {group: undefined, dist: Number.POSITIVE_INFINITY})
	
  } // findclosestgroup
  
  static euclidean(centroid, sprite){
	// centroid and the sprite should already be the data: `spriteobj.file.content[0].data.Cp'. They are n-dimensional vectors of the same length.
	
	let s = 0
	for(let i=0; i<centroid.length; i++){
		s += (centroid[i] - sprite[i])**2
	} // for
	
	// Note that s is not square-rooted. Since we're just comparing the distances it doesn't need to be.
	return s
  } // euclidean
	
} // kmeans


function aContainsB(A, B){
	// A.some(...) => is any element of A not present in B?
	// Returns true if some elements are missing, and false if not. Therefore !A.some(...) => are all elements of A in B?
	return !A.some(function(a){
		// !B.includes(a) => is B missing a?
		return !B.includes(a)
	})
} // aContainsB