// Detects webgl
if ( WEBGL.isWebGLAvailable() === false ) {
	document.body.appendChild( WEBGL.getWebGLErrorMessage() );
	document.getElementById( 'container' ).innerHTML = "";
}
// Graphics variables
var container, stats;
var camera, controls, scene, renderer;
var textureLoader;
var clock = new THREE.Clock();
// Physics variables
var gravityConstant = -9.8;
var windConstant = 0;
var physicsWorld;
var rigidBodies = [];
var margin = 0.05;
var hinge;
var cloth;
var clothPhysics = false;
var transformAux1 = new Ammo.btTransform();
var armMovement = 0;
init();
animate();

function init() {
	initGraphics();
	initPhysics();
	createObjects();
	initInput();
	initGui();
}
function initGraphics() {
	container = document.getElementById( 'container' );
	camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 2000 );
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0xbfd1e5 );
	camera.position.set( - 12, 7, 40 );
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;
	textureLoader = new THREE.TextureLoader();
	var ambientLight = new THREE.AmbientLight( 0x404040 );
	scene.add( ambientLight );
	var light = new THREE.DirectionalLight( 0xffffff, 1 );
	light.position.set( - 7, 10, 15 );
	scene.add( light );
	container.innerHTML = "";
	container.appendChild( renderer.domElement );
	controls = new THREE.OrbitControls( camera,renderer.domElement );
	controls.target.set( 0, 2, 0 );
	controls.update();
	window.addEventListener( 'resize', onWindowResize, false );
}
function initPhysics() {
	// Physics configuration
	var collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
	var dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
	var broadphase = new Ammo.btDbvtBroadphase();
	var solver = new Ammo.btSequentialImpulseConstraintSolver();
	var softBodySolver = new Ammo.btDefaultSoftBodySolver();
	physicsWorld = new Ammo.btSoftRigidDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration, softBodySolver );
	physicsWorld.setGravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );
	physicsWorld.getWorldInfo().set_m_gravity( new Ammo.btVector3( windConstant, gravityConstant, 0 ) );
}
function createObjects() {
	var pos = new THREE.Vector3();
	var quat = new THREE.Quaternion();
	// Ground
	pos.set( 0, - 0.5, 0 );
	quat.set( 0, 0, 0, 1 );
	var ground = createParalellepiped( 40, 1, 40, 0, pos, quat, new THREE.MeshPhongMaterial( { color: 0xFFFFFF } ) );
	ground.castShadow = true;
	ground.receiveShadow = true;
	




	var dominoMass = 1;
	var dominoLength = 0.8;
	var dominoDepth = 0.2;
	var dominoHeight = 1.2;
	var distance = 0.5;
	var x0 = -15;
	pos.set( x0, 0, 15 );

// draw all the line 	
for (var i = 0; i <2; i++){
	    //var dominoHeight = 2.4;
	    //dominoHeight -= i*0.2
		var numdominosLength = 60;
		var color  = createRandomColor();
		numdominosLength = numdominosLength-i*8;
		

	
//first line	
	quat.set( 0, 0, 0, 1 );
	for ( var j = 0; j < numdominosLength; j ++ ) {
		
		var domino = createParalellepiped( dominoDepth, dominoHeight, dominoLength, dominoMass, pos, quat, createMaterial(color) );
			//domino.castShadow = true;
			//domino.receiveShadow = true;
			pos.x+=distance;
		
	}
// first corner
    var numdominoCorner = 4;
	pos.z -=0.25
	for ( var j = 0; j < numdominoCorner; j ++ ) {
		quat.y += 0.25
		
		var domino = createParalellepiped( dominoDepth, dominoHeight, dominoLength, dominoMass, pos, quat, createMaterial(color) );
		pos.z -=0.6
	    pos.x+=0.3;
	}
	

//second line 
	numdominosLength -=8;
	quat.set( 0, 1, 0, 1 );
	pos.x -=0.25
	for ( var j = 0; j < numdominosLength; j ++ ) {
		
		var domino = createParalellepiped( dominoDepth, dominoHeight, dominoLength, dominoMass, pos, quat, createMaterial(color) );
			//domino.castShadow = true;
			//domino.receiveShadow = true;
			pos.z-=distance;
		
	}
	
// second corner
    var numdominoCorner = 4;
	pos.x -=0.25
	for ( var j = 0; j < numdominoCorner; j ++ ) {
		quat.y += 1.5
		
		var domino = createParalellepiped( dominoDepth, dominoHeight, dominoLength, dominoMass, pos, quat, createMaterial(color) );
		pos.x -=0.6
	    pos.z -=0.3;
	}
	
//third line 
	quat.set( 0, 0, 0, 1 );
	
	for ( var j = 0; j < numdominosLength-1; j ++ ) {
		
		var domino = createParalellepiped( dominoDepth, dominoHeight, dominoLength, dominoMass, pos, quat, createMaterial(color) );
			//domino.castShadow = true;
			//domino.receiveShadow = true;
			pos.x-=distance;
		
	}
//third corner 
    var numdominoCorner = 4;
	quat.set( 0, -7, 0, 1 );
	pos.z +=0.25
	for ( var j = 0; j < numdominoCorner; j ++ ) {
		quat.y += 1.4
		
		var domino = createParalellepiped( dominoDepth, dominoHeight, dominoLength, dominoMass, pos, quat, createMaterial(color) );
		pos.x -=0.6
	    pos.z +=0.3;
	}

//fourth line 
    numdominosLength -= 3;
	quat.set( 0, 1, 0, 1 );
	pos.z +=0.25
	pos.x +=0.2
	for ( var j = 0; j < numdominosLength; j ++ ) {
		
		var domino = createParalellepiped( dominoDepth, dominoHeight, dominoLength, dominoMass, pos, quat, createMaterial(color) );
			//domino.castShadow = true;
			//domino.receiveShadow = true;
			pos.z+=distance;
		
	}  
	
//fourth corner 
    var numdominoCorner = 4;
	quat.set( 0, -1, 0, 1 );
	pos.x +=0.25
	for ( var j = 0; j < numdominoCorner; j ++ ) {
		quat.y += 0.25
		
		var domino = createParalellepiped( dominoDepth, dominoHeight, dominoLength, dominoMass, pos, quat, createMaterial(color) );
		pos.z +=0.6
	    pos.x +=0.4;
	}
	pos.x +=0.25
	pos.z -=0.4
	
	
	}	
	

    
	
// controler

	var armMass = 2;
	var armLength = 2.5 ;
	var pylonHeight = 2;
	var baseMaterial = new THREE.MeshPhongMaterial( { color: 0xfacec0 } );
	pos.set( -17,0,17 );
	quat.set( 0, 0, 0, 1 );
	var base = createParalellepiped( 1, 0.2, 1, 0, pos, quat, baseMaterial );
	base.castShadow = true;
	base.receiveShadow = true;
	pos.set( -17,0,17 );
	var pylon = createParalellepiped( 0.4, pylonHeight, 0.4, 0, pos, quat, baseMaterial );
	pylon.castShadow = true;
	pylon.receiveShadow = true;
	pos.set(-16,0,16 );
	quat.set( 0,0, 0, 1 );
	var arm = createParalellepiped( 0.4, 0.4, armLength+0.4, armMass, pos, quat, baseMaterial );
	arm.castShadow = true;
	arm.receiveShadow = true;
	// Hinge constraint to move the arm
	var pivotA = new Ammo.btVector3( 0, pylonHeight * 0.5, 0 );
	var pivotB = new Ammo.btVector3( 0, - 0.2, - armLength * 0.5 );
	var axis = new Ammo.btVector3( 0, 1, 0 );
	hinge_new = new Ammo.btHingeConstraint( pylon.userData.physicsBody, arm.userData.physicsBody, pivotA, pivotB, axis, axis, true );
	physicsWorld.addConstraint( hinge_new, true );
	
	
	
	// The cloth
	// Cloth graphic object
	var clothWidth = 4;
	var clothHeight = 3;
	var clothNumSegmentsZ = clothWidth * 5;
	var clothNumSegmentsY = clothHeight * 5;
	var clothPos = new THREE.Vector3( 1, 12, 7 );
	//var clothGeometry = new THREE.BufferGeometry();
	var clothGeometry = new THREE.PlaneBufferGeometry( clothWidth, clothHeight, clothNumSegmentsZ, clothNumSegmentsY );
	clothGeometry.rotateY( Math.PI * 0.5 );
	clothGeometry.translate( clothPos.x, clothPos.y + clothHeight * 0.5, clothPos.z - clothWidth * 0.5 );
	//var clothMaterial = new THREE.MeshLambertMaterial( { color: 0x0030A0, side: THREE.DoubleSide } );
	var clothMaterial = new THREE.MeshLambertMaterial( { color: 0xd8f3fc, side: THREE.DoubleSide } );
	cloth = new THREE.Mesh( clothGeometry, clothMaterial );
	cloth.castShadow = true;
	cloth.receiveShadow = true;
	scene.add( cloth );
	textureLoader.load( "fern.png", function ( texture ) {
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		//texture.repeat.set( clothNumSegmentsZ, clothNumSegmentsY );
		cloth.material.map = texture;
		cloth.material.needsUpdate = true;
	} );



	// Cloth physic object
	var softBodyHelpers = new Ammo.btSoftBodyHelpers();
	var clothCorner11 = new Ammo.btVector3( clothPos.x, clothPos.y + clothHeight, clothPos.z );
	var clothCorner01 = new Ammo.btVector3( clothPos.x, clothPos.y + clothHeight, clothPos.z - clothWidth );
	var clothCorner10 = new Ammo.btVector3( clothPos.x, clothPos.y, clothPos.z );
	var clothCorner00 = new Ammo.btVector3( clothPos.x, clothPos.y, clothPos.z - clothWidth );
	var clothSoftBody = softBodyHelpers.CreatePatch( physicsWorld.getWorldInfo(), clothCorner00, clothCorner01, clothCorner10, clothCorner11, clothNumSegmentsZ + 1, clothNumSegmentsY + 1, 0, true );
	var sbConfig = clothSoftBody.get_m_cfg();
	sbConfig.set_viterations( 10 );
	sbConfig.set_piterations( 10 );
	clothSoftBody.setTotalMass( 0.9, false );
	Ammo.castObject( clothSoftBody, Ammo.btCollisionObject ).getCollisionShape().setMargin( margin * 3 );
	physicsWorld.addSoftBody( clothSoftBody, 1, - 1 );
	cloth.userData.physicsBody = clothSoftBody;
	// Disable deactivation
	clothSoftBody.setActivationState( 4 );


	// Ball

	var ballRadius = 0.5;
	var ball = new THREE.Mesh( new THREE.SphereBufferGeometry( ballRadius, 20, 20 ), new THREE.MeshPhongMaterial( { color: 0x606060 } ) );
	ball.castShadow = true;
	ball.receiveShadow = true;
	var ballShape = new Ammo.btSphereShape( ballRadius );
	ballShape.setMargin( margin );
	pos.set( clothPos.x, 15.5, clothPos.z - clothWidth );
	quat.set( 0, 0, 0, 1 );
	createRigidBody( ball, ballShape, 0, pos, quat );


	// The base
	var pylonHeight = 15.5
	var baseMaterial = new THREE.MeshPhongMaterial( { color: 0x606060 } );
	pos.set( clothPos.x, 0.1, clothPos.z - clothWidth );
	quat.set( 0, 0, 0, 1 );
	var base = createParalellepiped( 2, 0.2, 2, 0, pos, quat, baseMaterial );
	base.castShadow = true;
	base.receiveShadow = true;
	pos.set( clothPos.x, 0.5 * pylonHeight, clothPos.z - clothWidth );
	var pylon = createParalellepiped( 0.4, pylonHeight, 0.4, 0, pos, quat, baseMaterial );
	pylon.castShadow = true;
	pylon.receiveShadow = true
	// Glue the cloth to the arm
	var influence = 0.5;
	clothSoftBody.appendAnchor( 0, pylon.userData.physicsBody, false, influence )
	clothSoftBody.appendAnchor( clothNumSegmentsZ, pylon.userData.physicsBody, false, influence );
	
	
	// windmill
	
	var ballRadius = 0.2;
	var ball = new THREE.Mesh( new THREE.SphereBufferGeometry( ballRadius, 20, 20 ), new THREE.MeshPhongMaterial( { color: 0x606060 } ) );
	ball.castShadow = true;
	ball.receiveShadow = true;
	var ballShape = new Ammo.btSphereShape( ballRadius );
	ballShape.setMargin( margin );
	pos.set( -17+1.5+ballRadius,13.2,clothPos.z - clothWidth );
	quat.set( 0, 0, 0, 1 );
	createRigidBody( ball, ballShape, 0, pos, quat );
	
	var cylinder = new THREE.Mesh( new THREE.CylinderBufferGeometry	( 0.2,0.2,3, 30 ), new THREE.MeshPhongMaterial( { color: 0xeffafe } ) );
	var cylinderShape = new Ammo.btCylinderShape( new Ammo.btVector3( 0.2, 3 * 0.5, 0.2 ) );
	cylinderShape.setMargin( margin );
	pos.set( -17,13.2,clothPos.z - clothWidth );
	quat.set( 0, 0, 0, 1 );
	quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), -Math.PI / 2 );
	createRigidBody( cylinder, cylinderShape, 0, pos, quat );

	
	var pylonHeight = 13.1;
	var baseMaterial = new THREE.MeshPhongMaterial( { color: 0xeffafe } );
	pos.set( -17,0,clothPos.z - clothWidth );
	quat.set( 0, 0, 0, 1 );
	var base = createParalellepiped( 2, 0.2, 2, 0, pos, quat, baseMaterial );
	base.castShadow = true;
	base.receiveShadow = true;
	pos.set( -17,0.5 * pylonHeight,clothPos.z - clothWidth );
	var pylon = createParalellepiped( 0.4, pylonHeight, 0.4, 0, pos, quat, baseMaterial );
	pylon.castShadow = true;
	pylon.receiveShadow = true;
	quat.set( 0,0, 0, 1 );
	var armMass = 1;
	var armLength = 3 ;
	pos.set(-17+1.7,13.1,clothPos.z - clothWidth+1.9 );
	var arm1 = createParalellepiped( 0.1, 0.4, armLength+0.4, armMass, pos, quat, baseMaterial );
	pos.set(-17+1.7,13.1,clothPos.z - clothWidth-1.9 );
	var arm2 = createParalellepiped( 0.1, 0.4, armLength+0.4, armMass, pos, quat, baseMaterial );
	pos.set(-17+1.7,13.1+2,clothPos.z - clothWidth );
	var arm3 = createParalellepiped( 0.1, armLength+0.4, 0.4, armMass, pos, quat, baseMaterial );
	pos.set(-17+1.7,13.1-2,clothPos.z - clothWidth );
	var arm4 = createParalellepiped( 0.1, armLength+0.4, 0.4, armMass, pos, quat, baseMaterial );
	// Hinge constraint to move the arm
	var pivotA = new Ammo.btVector3( 0, 13.2*0.5,0);
	var pivotB = new Ammo.btVector3( -1.7, 0, -2 );
	var axis = new Ammo.btVector3( 1, 0, 0 );
	windmill = new Ammo.btHingeConstraint( pylon.userData.physicsBody, arm1.userData.physicsBody, pivotA, pivotB, axis, axis, true );
	physicsWorld.addConstraint( windmill, true );
	var pivotA = new Ammo.btVector3( 0, 13.2*0.5,0);
	var pivotB = new Ammo.btVector3( -1.7, 0, 2 );
	windmill2 = new Ammo.btHingeConstraint( pylon.userData.physicsBody, arm2.userData.physicsBody, pivotA, pivotB, axis, axis, true );
	physicsWorld.addConstraint( windmill2, true );
	var pivotA = new Ammo.btVector3( 0, 13.2*0.5,0);
	var pivotB = new Ammo.btVector3( -1.7, -2, 0 );
	windmill3 = new Ammo.btHingeConstraint( pylon.userData.physicsBody, arm3.userData.physicsBody, pivotA, pivotB, axis, axis, true );
	physicsWorld.addConstraint( windmill3, true );
	var pivotA = new Ammo.btVector3( 0, 13.2*0.5,0);
	var pivotB = new Ammo.btVector3( -1.7, 2, 0 );
	windmill4 = new Ammo.btHingeConstraint( pylon.userData.physicsBody, arm4.userData.physicsBody, pivotA, pivotB, axis, axis, true );
	physicsWorld.addConstraint( windmill4, true );
	


}
function createParalellepiped( sx, sy, sz, mass, pos, quat, material ) {
	var threeObject = new THREE.Mesh( new THREE.BoxBufferGeometry( sx, sy, sz, 1, 1, 1 ), material );
	var shape = new Ammo.btBoxShape( new Ammo.btVector3( sx * 0.5, sy * 0.5, sz * 0.5 ) );
	shape.setMargin( margin );
	createRigidBody( threeObject, shape, mass, pos, quat );
	return threeObject;
}
function createRigidBody( threeObject, physicsShape, mass, pos, quat ) {
	threeObject.position.copy( pos );
	threeObject.quaternion.copy( quat );
	var transform = new Ammo.btTransform();
	transform.setIdentity();
	transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
	transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
	var motionState = new Ammo.btDefaultMotionState( transform );
	var localInertia = new Ammo.btVector3( 0, 0, 0 );
	physicsShape.calculateLocalInertia( mass, localInertia );
	var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, physicsShape, localInertia );
	var body = new Ammo.btRigidBody( rbInfo );
	threeObject.userData.physicsBody = body;
	scene.add( threeObject );
	if ( mass > 0 ) {
		rigidBodies.push( threeObject );
		// Disable deactivation
		body.setActivationState( 4 );
	}
	physicsWorld.addRigidBody( body );
}
function createRandomColor() {
	return Math.floor( Math.random() * ( 1 << 24 ) );
}
function createMaterial(c) {
	return new THREE.MeshPhongMaterial( { color: c } );
}
function initInput() {
	window.addEventListener( 'keydown', function ( event ) {
		switch ( event.keyCode ) {
			// D
			case 68:
				armMovement = 1;
				break;
				// A
			case 65:
				armMovement = - 1;
				
				break;
		}
	}, false );
	window.addEventListener( 'keyup', function () {
		armMovement = 0;
	}, false );
}

function initGui(){
	
	
	var controls = new function () {
	this.ClothPhysics = 'off';
	this.ClothPhysicsButton =false;
	this.Constant = 9.8;
	this.WindStrength = 0;
	

	this.ClothPhysicsSwitch = function(){
		if(this.ClothPhysicsButton==false){
			this.ClothPhysicsButton = true;
			clothPhysics = true;
			this.ClothPhysics = 'on';
		}else{
			this.ClothPhysicsButton = false;
			this.ClothPhysics = 'off';
			clothPhysics = false;
		}
		
	};
	
	
	
	this.changeGravity= function() {
		    gravityConstant = controls.Constant *-1;
			
			windConstant = controls.WindStrength;
			
		};
		
	
	

    };
	
	
	
	var gui = new dat.GUI();
	g = gui.addFolder('Gravity')	
    g.add(controls, 'Constant', -10, 50).onChange(controls.changeGravity);
	c = gui.addFolder('Cloth')
	c.add(controls, 'ClothPhysics').listen();
	c.add(controls, 'ClothPhysicsSwitch' );
	c.add(controls, 'WindStrength', 0, 50).onChange(controls.changeGravity);


}





function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
	requestAnimationFrame( animate );
	render();
}
function render() {
	var deltaTime = clock.getDelta();
	updatePhysics( deltaTime );
	renderer.render( scene, camera );
}
function updatePhysics( deltaTime ) {
	//update Gravity
	physicsWorld.setGravity( new Ammo.btVector3( 0, gravityConstant, 0 ) );
	if(windConstant>0){
	physicsWorld.getWorldInfo().set_m_gravity( new Ammo.btVector3( (Math.random()*0.5)*windConstant,gravityConstant+Math.random()*15, -1*(Math.random()*0.25*windConstant)+(Math.random()*0.25*windConstant ) ));
	}else{
		physicsWorld.getWorldInfo().set_m_gravity( new Ammo.btVector3( windConstant, gravityConstant, 0 ) );
	}
	
	// Hinge control
	windmill.enableAngularMotor( true, 0.6*windConstant, 50 );
	windmill2.enableAngularMotor( true, 0.6*windConstant, 50 );
	windmill3.enableAngularMotor( true, 0.6*windConstant, 50 );
	windmill4.enableAngularMotor( true, 0.6*windConstant, 50 );
	hinge_new.enableAngularMotor( true, 0.6*armMovement, 50 );
	// Step world
	physicsWorld.stepSimulation( deltaTime, 10 );
	


	// Update cloth
	if(clothPhysics){
	var softBody = cloth.userData.physicsBody;
	var clothPositions = cloth.geometry.attributes.position.array;
	var numVerts = clothPositions.length / 3;
	var nodes = softBody.get_m_nodes();
	var indexFloat = 0;
	for ( var i = 0; i < numVerts; i ++ ) {
		var node = nodes.at( i );
		var nodePos = node.get_m_x();
		clothPositions[ indexFloat ++ ] = nodePos.x();
		clothPositions[ indexFloat ++ ] = nodePos.y();
		clothPositions[ indexFloat ++ ] = nodePos.z();
	}
	cloth.geometry.computeVertexNormals();
	cloth.geometry.attributes.position.needsUpdate = true;
	cloth.geometry.attributes.normal.needsUpdate = true;
	}
	// Update rigid bodies
	for ( var i = 0, il = rigidBodies.length; i < il; i ++ ) {
		var objThree = rigidBodies[ i ];
		var objPhys = objThree.userData.physicsBody;
		var ms = objPhys.getMotionState();
		if ( ms ) {
			ms.getWorldTransform( transformAux1 );
			var p = transformAux1.getOrigin();
			var q = transformAux1.getRotation();
			objThree.position.set( p.x(), p.y(), p.z() );
			objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );
		}
	}
}

