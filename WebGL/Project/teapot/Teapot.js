

var flatshading = false
var texture = null
var check = true
var shinniness = 100
var specularColor = 0x111111
var displacementscale =0
var bumpscale = 0
var displacementTexture = null
var bumpTexture = null
var specularTexture = null
var envTexture = null

// initialization of Three.js
function init() {
	// Check if WebGL is available see Three/examples
	// No need for webgl2 here - change as appropriate
    if ( WEBGL.isWebGLAvailable() === false ) {
		// if not print error on console and exit
    	document.body.appendChild( WEBGL.getWebGLErrorMessage() );
    }
	// add our rendering surface and initialize the renderer
    var container = document.createElement( 'div' );
    document.body.appendChild( container );
	renderer = new THREE.WebGLRenderer( );
    // set some state - here just clear color
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
	

	

	
    // All drawing will be organized in a scene graph
    var scene = new THREE.Scene();
	

	
	// put a plane on the ground 
	// 20 wide, 20 deep - this is x/y
    var planeGeometry = new THREE.PlaneGeometry(20, 20);
    var planeMaterial = new THREE.MeshPhongMaterial( { color: 0x808080 })
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // now rotate the plane such that it is on the ground
	// let's use Euler angles
    plane.rotation.x = -0.5 * Math.PI;
	// first position than rotation
    plane.position.set( 0, -2, 0.0 );
    // add the plane to the scene
    //scene.add(plane);
	
	
    
	//directional Light
	
	var directionalLight = new THREE.DirectionalLight( 0xffffff ,1 );
	directionalLight.position.set(0,100,100)
    scene.add(directionalLight);
	
	//spot light
	
	var spotLight = new THREE.SpotLight( 0xffffff,0,20,Math.PI*1/4 );
	spotLight.position.set( 0, 5, 5 );
	

	

	scene.add(spotLight);
	
	//lightHelper = new THREE.SpotLightHelper( spotLight );
	//			scene.add( lightHelper );
	
   
   
	
	 // Adding teapot to the earth
    var teapotGeometry = new THREE.TeapotBufferGeometry(1, 200, true, true, true, false, false);
    //var teapot = new THREE.Mesh(teapotGeometry, new THREE.MeshBasicMaterial({ color: 'white' }));
	var material = new THREE.MeshPhongMaterial( { color: 'white' ,flatShading:flatshading,map:texture} );
	var teapot = new THREE.Mesh(teapotGeometry, material);
	
    // Set position on top of earth
    teapot.position.set(0, 0, 0);
	//teapot.rotation.y = Math.PI*1/2
	
	scene.add(teapot)
	
	
	function phongmateril(spec,dis,bump){
		
		if (check){
			
		var material = new THREE.MeshPhongMaterial( { color: 'white' ,side: THREE.DoubleSide,envMap: envTexture,map:texture,displacementMap:displacementTexture,
		bumpMap:bumpTexture,specularMap:specularTexture,shininess:shinniness,
		specular:specularColor,displacementScale:displacementscale,bumpScale:bumpscale} );
		}else{
			
			
			
			var material = new THREE.MeshBasicMaterial({ color: 'white',side:THREE.DoubleSide,map:texture});
		}
		
		
		return material
		
	}
	
	//cube 
	
	 var cubegeometry = new THREE.CubeGeometry(1000,1000,1000)

	 var cubeMaterials =  [
		 new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load( 'skyboxes/front.png' ),side:THREE.DoubleSide}),
		 new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load( 'skyboxes/back.png' ),side:THREE.DoubleSide}),
		 new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load( 'skyboxes/up.png' ),side:THREE.DoubleSide}),
		 new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load( 'skyboxes/down.png' ),side:THREE.DoubleSide}),
		 new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load( 'skyboxes/right.png' ),side:THREE.DoubleSide}),
		 new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load( 'skyboxes/left.png' ),side:THREE.DoubleSide})
	 ];
	 
	var loader = new THREE.CubeTextureLoader();
	loader.setPath( 'skyboxes/' );

	var textureCube = loader.load( [
	'front.png', 'back.png',
	'up.png', 'down.png',
	'right.png', 'left.png'
	] );

	 var cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials);
	 var cube = new THREE.Mesh(cubegeometry,cubeMaterial);

	 
	
	

	
	
 // calcaulate aspectRatio
	var aspectRatio = window.innerWidth/window.innerHeight;
	var width = 7.07;
	camera = new THREE.PerspectiveCamera(75, aspectRatio, 1, 1000);
    camera.position.set( 0, 0, 5 ); 
    camera.lookAt(scene.position); 

    
// OrbitControls
	control = new THREE.OrbitControls(camera,renderer.domElement);

	control.minDistance = 2;
	control.maxDistance = 30;
	control.enablePan = false;

	control.update()	
	
	
	
	
    
    // setup the control gui
    var controls = new function () {
	this.Directional = 'on';
	this.DirectionalButton =true;
	this.angle = 1/2
	this.elevation = 1/4;
	this.azimuth = 0;
	this.SpotLight = 'off';
	this.SpotLightButton =false;
	this.PhongShading = 'on';
	this.PhongShadingbutton =true;
	this.Decal = 'off';
	this.Decalbutton =false;
	this.Specular = 'off';
	this.Specularbutton =false;
	this.shininess = 100
	this.color = 0x111111
	this.Displacement = 'off';
	this.Displacementbutton =false;
	this.dscale = 0
	this.Bumpbutton = false;
	this.Bump = 'off';
	this.bscale = 0
	this.skyboxbutton = false;
	this.skybox = 'off';
	this.EnvMapbutton = false;
	this.EnvMap = 'off';	

	this.DirectionalSwitch = function(){
		if(this.DirectionalButton==false){
			this.DirectionalButton = true;
			directionalLight.intensity = 1
	
			
			this.Directional = 'on';
		}else{
			this.DirectionalButton = false;
			this.Directional = 'off';
			directionalLight.intensity = 0
			
		}
		
	};
	
	
	
	this.changeCamera= function() {
		    spotLight.angle = Math.PI/2*controls.angle
			var x = Math.cos(Math.PI*controls.azimuth);
			var z = Math.sin(Math.PI*controls.azimuth);
			spotLight.position.set( width*Math.cos(Math.PI*controls.elevation)*x, width*Math.sin(Math.PI*controls.elevation), width*Math.cos(Math.PI*controls.elevation)*z ); 
		   // lightHelper.update()
		};
		
		
		
	this.SpotLightSwitch = function(){
			if(this.SpotLightButton==false){
				this.SpotLightButton = true;
			    spotLight.intensity = 1
		
				
				this.SpotLight = 'on';
			}else{
				this.SpotLightButton = false;
				this.SpotLight = 'off';
				spotLight.intensity = 0
				
			}
			
		};	
	this.PhongShadingSwitch = function(){
			if(this.PhongShadingbutton==false){
				this.PhongShadingbutton = true;
				check = true
				var material = phongmateril()
				teapot.material = material
				
				this.PhongShading = 'on';
			}else{
				this.PhongShadingbutton = false;
				this.PhongShading = 'off';
				check = false
				var material = phongmateril()
				teapot.material = material
				
			}
			
		};
	this.DecalSwitch = function(){
			if(this.Decalbutton==false){
				this.Decalbutton = true;
			
			// Texture
				texture = new THREE.TextureLoader().load( 'fern.png' );
				var material = phongmateril()
				teapot.material = material
				
				this.Decal = 'on';
			}else{
				this.Decalbutton = false;
				this.Decal = 'off';
				texture = null
				var material = phongmateril()
				teapot.material = material
				
		}
			
	}
	
	
	this.SpecularSwitch = function(){
			if(this.Specularbutton==false){
				this.Specularbutton = true;
			
			// Texture
				specularTexture = new THREE.TextureLoader().load( 'fern_specular.png' );
				var material = phongmateril()
				teapot.material = material
				
				this.Specular = 'on';

			}else{
				this.Specularbutton = false;
				this.Specular = 'off';
				specularTexture = null
				var material = phongmateril()
				teapot.material = material
				
		}
			
	}
	this.DisplacementSwitch = function(){
			if(this.Displacementbutton==false){
				this.Displacementbutton = true;
			
			// Texture
				displacementTexture = new THREE.TextureLoader().load( 'fern_displacement.png' );
				var material = phongmateril(true,false)
				teapot.material = material
				
				this.Displacement = 'on';
	
			}else{
				this.Displacementbutton = false;
				this.Displacement = 'off';
				displacementTexture = null
				var material = phongmateril()
				teapot.material = material
				
		}
			
	}	
	this.BumpSwitch = function(){
			if(this.Bumpbutton==false){
				this.Bumpbutton = true;
			
			// Texture
				bumpTexture = new THREE.TextureLoader().load( 'fern_bump.png' );
				var material = phongmateril(false,true)
				teapot.material = material
				
				this.Bump = 'on';

			}else{
				this.Bumpbutton = false;
				this.Bump = 'off';
				bumpTexture = null
				var material = phongmateril()
				teapot.material = material
				
		}
			
	}		

   this.changeSpecular = function(){
		shinniness = controls.shininess
		specularColor = controls.color
		var material = phongmateril()
		teapot.material = material

	}
   this.changeDisplacement = function(){
	   displacementscale = controls.dscale
	   var material = phongmateril(true,false)
	   teapot.material = material
	   
	   
   }
  this.changeBump = function(){
	   bumpscale = controls.bscale
	   var material = phongmateril(false,true)
	   teapot.material = material
	   
	   
   }
   
   this.skyboxSwitch = function(){
	   	if(this.skyboxbutton==false){
				this.skyboxbutton = true;		
				this.skybox = 'on';
				scene.add(cube)

			}else{
				this.skyboxbutton = false;
				this.skybox = 'off';
				scene.remove(cube)

				
		}  
	   
   }
   	this.EnvMapSwitch = function(){
			if(this.EnvMapbutton==false){
				this.EnvMapbutton = true;
			
			// Texture
				envTexture = textureCube;
				var material = phongmateril()
				teapot.material = material
				
				this.EnvMap = 'on';

			}else{
				this.EnvMapbutton = false;
				this.EnvMap = 'off';
				envTexture = null
				var material = phongmateril()
				teapot.material = material
				
		}
			
	}	



	
	

    };


    var gui = new dat.GUI();
	dl = gui.addFolder('Directional Light')	
	dl.add(controls, 'Directional').listen();
	dl.add(controls, 'DirectionalSwitch' );
	sl = gui.addFolder('Spot Light')	
    sl.add(controls, 'angle', 0, 0.75).onChange(controls.changeCamera);
    sl.add(controls, 'elevation',0,1).onChange(controls.changeCamera);
	sl.add(controls, 'azimuth' , -1,1).onChange(controls.changeCamera);
	sl.add(controls, 'SpotLight').listen();
	sl.add(controls, 'SpotLightSwitch' );
	ps = gui.addFolder('Phong Shading')	
	ps.add(controls, 'PhongShading').listen();
	ps.add(controls, 'PhongShadingSwitch' );
	ps = gui.addFolder('Textures as Decal')	
	ps.add(controls, 'Decal').listen();
	ps.add(controls, 'DecalSwitch' );
	sm = gui.addFolder('Specular Maps')
	sm.add(controls, 'Specular').listen();
	sm.add(controls, 'SpecularSwitch' );
	sm.add(controls, 'shininess', 1, 400).onChange(controls.changeSpecular);
	sm.addColor(controls,'color').onChange(controls.changeSpecular)
	dm = gui.addFolder('Displacement Map')
	dm.add(controls, 'Displacement').listen();
	dm.add(controls, 'DisplacementSwitch' );
	dm.add(controls, 'dscale', 0, 0.1).onChange(controls.changeDisplacement);
	bm = gui.addFolder('Bump Map')
	bm.add(controls, 'Bump').listen();
	bm.add(controls, 'BumpSwitch' );
	bm.add(controls, 'bscale', 0, 0.1).onChange(controls.changeBump);
	bs = gui.addFolder('SkyBox and EnvMap')
	bs.add(controls, 'skybox').listen();
	bs.add(controls, 'skyboxSwitch' );
	bs.add(controls, 'EnvMap').listen();
	bs.add(controls, 'EnvMapSwitch' );
	
	
	
	
	render();

    
    function render() {
        // render using requestAnimationFrame - register function
        requestAnimationFrame(render);

		
	
        renderer.render(scene, camera);
    }

}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    // If we use a canvas then we also have to worry of resizing it
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.onload = init;

// register our resize event function
window.addEventListener('resize', onResize, true);



