
 
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
	// WebGL2 examples suggest we need a canvas
    // canvas = document.createElement( 'canvas' );
    // var context = canvas.getContext( 'webgl2' );
    // var renderer = new THREE.WebGLRenderer( { canvas: canvas, context: context } );
	renderer = new THREE.WebGLRenderer( );
    // set some state - here just clear color
    renderer.setClearColor(new THREE.Color(0x333333));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
	var raycaster = new THREE.Raycaster();
	var mouse = new THREE.Vector2(),INTERSECTED;
	var mouseDown = false;
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', onMouseDown, false );
    document.addEventListener( 'mouseup', onMouseup, false );
	document.addEventListener( 'mousemove', onMouseMove2, false );
    
	
    // All drawing will be organized in a scene graph
    var scene = new THREE.Scene();
	
    // show axes at the origin
    var axes = new THREE.AxesHelper(10);
    scene.add(axes);
	
    // put a plane on the ground 
	// 20 wide, 40 deep - this is x/y
    var planeGeometry = new THREE.PlaneGeometry(20, 40);
    var planeMaterial = new THREE.MeshBasicMaterial({color: 0x55cc00, side: THREE.DoubleSide});
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    // now rotate the plane such that it is on the ground
	// let's use Euler angles
    plane.rotation.x = -0.5 * Math.PI;
	// first position than rotation
    plane.position.set( 0, -10, 0.0 );
    // add the plane to the scene
    scene.add(plane);
	
   
	
	
	
	//  body
	
	var body = new THREE.Group();
    var cylGeometry = new THREE.CylinderGeometry(2, 2, 15, 64);
	var faceMaterial = new THREE.MeshBasicMaterial({color: 'orange'});
	var cylinder = 	new THREE.Mesh(cylGeometry, faceMaterial);
	body.add(cylinder);
	// skin 
	var i;
	var count =1;
	for(i=-7;i<7;i+=0.4){
	var skinGeometry  = new THREE.CylinderGeometry(2, 2, 0.8, 64,64,false,(count*Math.PI/4)+Math.PI/2,Math.PI/8);
	var skinMaterial = new THREE.MeshBasicMaterial({color: 'tan'});
	var skin = new THREE.Mesh(skinGeometry, skinMaterial);
	skin.position.set(0,i,0);
	body.add(skin);
	count = count +1;
	}
	
	
    body.position.set( 0, 0, 0 );
	body.rotation.x = 0.5 *Math.PI;
	
	
	//head and neck
	var sphereGeometry = new THREE.SphereGeometry(1.05, 20, 20);
	var cylGeometry = new THREE.CylinderGeometry(1, 1, 5, 64);
	
	var sphereMaterial = new THREE.MeshBasicMaterial({color: 'darkorange'});
	
	var neckJoint1 = new THREE.Mesh(sphereGeometry,sphereMaterial);
	var neck1 = new THREE.Mesh(cylGeometry, faceMaterial);
	neck1.position.set(0,2.5,0);
	
	var skinGeometry  = new THREE.CylinderGeometry(1.1, 1.1, 4.9, 64,64,false,-Math.PI*1/4,Math.PI/2);
	var neck1Skin = new THREE.Mesh(skinGeometry, skinMaterial);
	neck1Skin.position.set(0,2.5,0);
	
	
	var neckJoint2 = new THREE.Mesh(sphereGeometry,sphereMaterial);
	neckJoint2.position.set(0,0,0);
	var neck2 = new THREE.Mesh(cylGeometry, faceMaterial);
	neck2.position.set(0,2.5,0);
	var neck2Skin = new THREE.Mesh(skinGeometry, skinMaterial);
	neck2Skin.position.set(0,2.5,0);
	
	var neckJoint3 = new THREE.Mesh(sphereGeometry,sphereMaterial);
	neckJoint3.position.set(0,0,0);
	
	var cylGeometry = new THREE.CylinderGeometry(1.5, 1.5, 4, 64);
	var head = new THREE.Mesh(cylGeometry, faceMaterial);
	head.position.set(0,0.75,-0.75);
	head.rotation.x = Math.PI/2;
	
	var cylGeometry = new THREE.CylinderGeometry(0.75, 0.75, 3, 64);
	var mouth = new THREE.Mesh(cylGeometry, sphereMaterial);
	var skinGeometry  = new THREE.CylinderGeometry(0.76, 0.76, 2.9, 64,64,false,Math.PI/2,Math.PI);
	var mouthSkin = new THREE.Mesh(skinGeometry, skinMaterial);
	mouthSkin.position.set(0,0,-3.25);
	mouthSkin.rotation.x = Math.PI/2;
	mouth.position.set(0,0,-3.25);
	mouth.rotation.x = Math.PI/2;
	
	var cylGeometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 64);
	var ear1 = new THREE.Mesh(cylGeometry, faceMaterial);
	ear1.position.set(0,1,0);
	var ear2 = new THREE.Mesh(cylGeometry, faceMaterial);
	ear2.position.set(0,1,0);
	
	var sphereGeometry = new THREE.SphereGeometry(0.75, 0.75, 20);
	var earjoint1 = new THREE.Mesh(sphereGeometry,sphereMaterial);
	
    var earjoint2 = new THREE.Mesh(sphereGeometry,sphereMaterial);
	
	
	
	
	var earGroup1 = new THREE.Group();
	earGroup1.position.set(0.7,1.75,0);
	earGroup1.add(ear1);
	earGroup1.add(earjoint1);
	
	var earGroup2 = new THREE.Group();
	earGroup2.position.set(-0.7,1.75,0);
	earGroup2.add(ear2);
	earGroup2.add(earjoint2);
	
	var headGroup = new THREE.Group();
	headGroup.position.set(0,5,0);
	headGroup.add(neckJoint3);
	headGroup.add(head);
	headGroup.add(mouth);
	headGroup.add(mouthSkin);
	headGroup.add(earGroup1);
	headGroup.add(earGroup2);
	
	var neckmid = new THREE.Group();
	neckmid.position.set(0,5,0);
	neckmid.add(neckJoint2);
	neckmid.add(neck2);
	//neckmid.add(neck2Skin);
	neckmid.add(headGroup);
	
	
	var neckbottom  = new THREE.Group();
	neckbottom.position.set(0,1.75,-6.25);
	neckbottom.add(neckJoint1);
	neckbottom.add(neck1);
	//neckbottom.add(neck1Skin);
	neckbottom.add(neckmid);
	neckbottom.rotation.x = -Math.PI/8;
	neckmid.rotation.x =Math.PI/12;
	headGroup.rotation.x = -Math.PI/12;
	
	
	
	
	
	
    
	
	// legs
   
	
	var sphereGeometry = new THREE.SphereGeometry(0.8, 20, 20);
	var cylGeometry = new THREE.CylinderGeometry(0.75, 0.75, 2.5, 64);
	var sphereMaterial = new THREE.MeshBasicMaterial({color: 'darkorange'});
	var sphere4Material = new THREE.MeshBasicMaterial({color: 'brown'});
	
	// right front leg

	var rf_cylinder1 = new THREE.Mesh(cylGeometry, faceMaterial);
	var rf_cylinder2 = new THREE.Mesh(cylGeometry, faceMaterial);
	var rf_cylinder3 = new THREE.Mesh(cylGeometry, faceMaterial);
    var rf_sphere1 = new THREE.Mesh(sphereGeometry,sphereMaterial);
	var rf_sphere2 = new THREE.Mesh(sphereGeometry,sphereMaterial);
	var rf_sphere3 = new THREE.Mesh(sphereGeometry,sphereMaterial);
	var rf_sphere4 = new THREE.Mesh(sphereGeometry,sphere4Material);
	rf_sphere1.position.set(0,-0.75,0);
	rf_cylinder1.position.set(0,-2,0);
	rf_sphere2.position.set(0,-3.25,0);
	rf_cylinder2.position.set(0,-4.5,0);
	rf_sphere3.position.set(0,-0,0);
	rf_cylinder3.position.set(0,-1.25,0);
	rf_sphere4.position.set(0,-2.5,0);

	var rf1 = new THREE.Group();
	var rf2 = new THREE.Group();
	rf1.add(rf_sphere1);
	rf1.add(rf_sphere2);
	rf2.add(rf_sphere3);
	rf2.add(rf_sphere4);
	rf1.add(rf_cylinder1);
	rf1.add(rf_cylinder2);
	rf2.add(rf_cylinder3);
	
	var legRightFront = new THREE.Group();
	rf1.position.set(0,0,0);
	rf2.position.set(0,-5.75,0);
	legRightFront.add(rf1)
	legRightFront.add(rf2)
	legRightFront.position.set(1.5,0,-5.5);
	
	
	
	//right back leg
	var rb_cylinder1 = new THREE.Mesh(cylGeometry, faceMaterial);
	var rb_cylinder2 = new THREE.Mesh(cylGeometry, faceMaterial);
	var rb_cylinder3 = new THREE.Mesh(cylGeometry, faceMaterial);
    var rb_sphere1 = new THREE.Mesh(sphereGeometry,sphereMaterial);
	var rb_sphere2 = new THREE.Mesh(sphereGeometry,sphereMaterial);
	var rb_sphere3 = new THREE.Mesh(sphereGeometry,sphereMaterial);
	var rb_sphere4 = new THREE.Mesh(sphereGeometry,sphere4Material);
	rb_sphere1.position.set(0,-0.75,0);
	rb_cylinder1.position.set(0,-2,0);
	rb_sphere2.position.set(0,-3.25,0);
	rb_cylinder2.position.set(0,-4.5,0);
	rb_sphere3.position.set(0,-0,0);
	rb_cylinder3.position.set(0,-1.25,0);
	rb_sphere4.position.set(0,-2.5,0);

	var rb1 = new THREE.Group();
	var rb2 = new THREE.Group();
	rb1.add(rb_sphere1);
	rb1.add(rb_sphere2);
	rb2.add(rb_sphere3);
	rb2.add(rb_sphere4);
	rb1.add(rb_cylinder1);
	rb1.add(rb_cylinder2);
	rb2.add(rb_cylinder3);
	
	var legRightBack = new THREE.Group();
	rb1.position.set(0,0,0);
	rb2.position.set(0,-5.75,0);
	legRightBack.add(rb1)
	legRightBack.add(rb2)
	legRightBack.position.set(1.5,0,5.5);
	
	
	//lef front leg 
	
	var lf_cylinder1 = new THREE.Mesh(cylGeometry, faceMaterial);
	var lf_cylinder2 = new THREE.Mesh(cylGeometry, faceMaterial);
	var lf_cylinder3 = new THREE.Mesh(cylGeometry, faceMaterial);
    var lf_sphere1 = new THREE.Mesh(sphereGeometry,sphereMaterial);
	var lf_sphere2 = new THREE.Mesh(sphereGeometry,sphereMaterial);
	var lf_sphere3 = new THREE.Mesh(sphereGeometry,sphereMaterial);
	var lf_sphere4 = new THREE.Mesh(sphereGeometry,sphere4Material);
	lf_sphere1.position.set(0,-0.75,0);
	lf_cylinder1.position.set(0,-2,0);
	lf_sphere2.position.set(0,-3.25,0);
	lf_cylinder2.position.set(0,-4.5,0);
	lf_sphere3.position.set(0,-0,0);
	lf_cylinder3.position.set(0,-1.25,0);
	lf_sphere4.position.set(0,-2.5,0);

	var lf1 = new THREE.Group();
	var lf2 = new THREE.Group();
	lf1.add(lf_sphere1);
	lf1.add(lf_sphere2);
	lf2.add(lf_sphere3);
	lf2.add(lf_sphere4);
	lf1.add(lf_cylinder1);
	lf1.add(lf_cylinder2);
	lf2.add(lf_cylinder3);
	
	var legLeftFront = new THREE.Group();
	lf1.position.set(0,0,0);
	lf2.position.set(0,-5.75,0);
	legLeftFront.add(lf1)
	legLeftFront.add(lf2)
	legLeftFront.position.set(-1.5,0,-5.5);
		
	
	//lef back leg 
	
	var lb_cylinder1 = new THREE.Mesh(cylGeometry, faceMaterial);
	var lb_cylinder2 = new THREE.Mesh(cylGeometry, faceMaterial);
	var lb_cylinder3 = new THREE.Mesh(cylGeometry, faceMaterial);
    var lb_sphere1 = new THREE.Mesh(sphereGeometry,sphereMaterial);
	var lb_sphere2 = new THREE.Mesh(sphereGeometry,sphereMaterial);
	var lb_sphere3 = new THREE.Mesh(sphereGeometry,sphereMaterial);
	var lb_sphere4 = new THREE.Mesh(sphereGeometry,sphere4Material);
	lb_sphere1.position.set(0,-0.75,0);
	lb_cylinder1.position.set(0,-2,0);
	lb_sphere2.position.set(0,-3.25,0);
	lb_cylinder2.position.set(0,-4.5,0);
	lb_sphere3.position.set(0,-0,0);
	lb_cylinder3.position.set(0,-1.25,0);
	lb_sphere4.position.set(0,-2.5,0);

	var lb1 = new THREE.Group();
	var lb2 = new THREE.Group();
	lb1.add(lb_sphere1);
	lb1.add(lb_sphere2);
	lb2.add(lb_sphere3);
	lb2.add(lb_sphere4);
	lb1.add(lb_cylinder1);
	lb1.add(lb_cylinder2);
	lb2.add(lb_cylinder3);
	
	var legLeftBack = new THREE.Group();
	lb1.position.set(0,0,0);
	lb2.position.set(0,-5.75,0);
	legLeftBack.add(lb1)
	legLeftBack.add(lb2)
	legLeftBack.position.set(-1.5,0,5.5);

	
	
	var whole = new THREE.Group();
	whole.add(body);
	whole.add(legLeftBack);
	whole.add(legLeftFront);
	whole.add(legRightBack);
	whole.add(legRightFront);
	whole.add(neckbottom);
    scene.add(whole);


	
	
	// need a camera to look at things
	// calcaulate aspectRatio
	var aspectRatio = window.innerWidth/window.innerHeight;
	var width = 30;
	// The orthographic camera seems to have its axes changed from WebGL
    // var camera = new THREE.OrthographicCamera( -width/2, width/2, aspectRatio*width/2, -aspectRatio*width/2,  -10*width/2, 10*width/2);
	// Camera needs to be global
	camera = new THREE.PerspectiveCamera(75, aspectRatio, 1, 1000);
    // position the camera back and point to the center of the scene
    camera.position.set( width*Math.cos(Math.PI/12), width*Math.sin(Math.PI/12), 0 ); 
	// at 0 0 0 on the scene
    camera.lookAt(scene.position); 

	
	var animationbutton =false;
	
    // render the scene
    renderer.render(scene, camera);
     
	
    // setup the control gui
    var controls = new function () {
        this.speed = 1;
		this.elevation = 1/12;
		this.azimuth = 0;
		this.animation = 'off';
		this.bottomNeck_fb = 1/8;
		this.bottomNeck_lr = 0;
		this.midNeck_fb = -1/12;
		this.head_fb = 1/12;
		this.head_lr = 0;
		this.leftEar_fb = 0;
		this.leftEar_lr = 0;
		this.rightEar_fb = 0;
		this.rightEar_lr = 0;
		this.changeCamera= function() {
			var x = Math.cos(Math.PI*controls.azimuth);
			var z = Math.sin(Math.PI*controls.azimuth);
			camera.position.set( width*Math.cos(Math.PI*controls.elevation)*x, width*Math.sin(Math.PI*controls.elevation), width*Math.cos(Math.PI*controls.elevation)*z ); 
		    camera.lookAt(scene.position); 
		};
		this.Switch = function(){
			if(animationbutton==false){
				animationbutton = true;
				this.animation = 'on';
			}else{
				animationbutton = false;
				this.animation = 'off';
				
			}
			
		};
		this.ResetBodyRotation = function(){
			whole.rotation.x = 0;
			whole.rotation.y = 0;
			whole.rotation.z = 0;
		};
		

		
		this.rotation = function(){
			neckbottom.rotation.x = controls.bottomNeck_fb*(-1)*Math.PI;
			neckbottom.rotation.z = controls.bottomNeck_lr*Math.PI;
			neckmid.rotation.x = controls.midNeck_fb*(-1)*Math.PI;
			headGroup.rotation.x = controls.head_fb*(-1)*Math.PI;
			headGroup.rotation.y = controls.head_lr*Math.PI;
			earGroup2.rotation.x = controls.leftEar_fb*(-1)*Math.PI;
			earGroup2.rotation.z = controls.leftEar_lr*Math.PI;
			earGroup1.rotation.x = controls.rightEar_fb*(-1)*Math.PI;
			earGroup1.rotation.z = controls.rightEar_lr*(-1)*Math.PI;
			
			
		}
		

        this.redraw = function () {
      
        };
    };
	
	



    var gui = new dat.GUI();
    gui.add(controls, 'speed', 0.1, 10).onChange(controls.redraw);
	gui.add(controls, 'elevation',1/12,11/12).onChange(controls.changeCamera);
	gui.add(controls, 'azimuth' , -1,1).onChange(controls.changeCamera);
	gui.add(controls, 'Switch' );
	gui.add(controls, 'animation').listen();
	gui.add(controls, 'bottomNeck_fb',-1/4,3/4).onChange(controls.rotation);
	gui.add(controls, 'bottomNeck_lr',-1/2,1/2).onChange(controls.rotation);
	gui.add(controls, 'midNeck_fb',-1/4,1/4).onChange(controls.rotation);
	gui.add(controls, 'head_fb',-1/4,1/4).onChange(controls.rotation);
	gui.add(controls, 'head_lr',-1/2,1/2).onChange(controls.rotation);
	gui.add(controls, 'leftEar_fb',-1/4,1/4).onChange(controls.rotation);
	gui.add(controls, 'leftEar_lr',-1/4,1/4).onChange(controls.rotation);
	gui.add(controls, 'rightEar_fb',-1/4,1/4).onChange(controls.rotation);
	gui.add(controls, 'rightEar_lr',-1/4,1/4).onChange(controls.rotation);
	gui.add(controls, 'ResetBodyRotation' );

    render();
	
	
    
	var s = 0.003*Math.PI;
	//var s = 3*Math.PI;
	var object ;
    function render() {
		// render using requestAnimationFrame - register function
		requestAnimationFrame(render);
		
		
		
		//animation 
		if(legRightFront.rotation.x > 0.25*Math.PI){
			
			s = -0.003*Math.PI;	
		}
		if(legRightFront.rotation.x < -0.25*Math.PI){
			
			s = 0.003*Math.PI;	
		}
		
		if(animationbutton ==true){
			legRightFront.rotation.x =legRightFront.rotation.x+s*controls.speed;
            rf2.rotation.x = rf2.rotation.x-s*controls.speed;			
			legLeftBack.rotation.x = legLeftBack.rotation.x-s*controls.speed;
			lb2.rotation.x = lb2.rotation.x+s*controls.speed;
			legRightBack.rotation.x =legRightBack.rotation.x+s*controls.speed;
			rb2.rotation.x = rb2.rotation.x-s*controls.speed;
			legLeftFront.rotation.x =legLeftFront.rotation.x-s*controls.speed;
			lf2.rotation.x = lf2.rotation.x+s*controls.speed;
			//neckbottom.rotation.z = neckbottom.rotation.z+s*controls.speed;
			//neckbottom.rotation.y = neckbottom.rotation.y+(controls.speed*Math.PI/20)
			var height = 10*Math.cos(legRightFront.rotation.x);
			whole.position.set(0,-(10-height),0);
		
		
			}
			
	    //interaction
		
		raycaster.setFromCamera( mouse, camera );
		var intersects = raycaster.intersectObjects( whole.children,true );
		if ( intersects.length > 0 ) {
			
			var intersect = intersects[ 0].object;
			object = intersect;
			cylinder.material.color.set('red');
			
	
					
					
			} else {
			
			   cylinder.material.color.set('orange');		
			}		
	   
		
		
		renderer.render(scene, camera);
        }
	
	    function onMouseDown(event){
			
            event.preventDefault();
		    //interaction
		
			raycaster.setFromCamera( mouse, camera );
				var intersects = raycaster.intersectObjects( body.children,true );
				if ( intersects.length > 0 ) {
					
					mouseDown = true;
					
					
					
				} else {
					
					
				}
        
        }

        function onMouseup(event){      
        mouseDown = false;
        }

        function onMouseMove2(event){
        if(!mouseDown){
            return;
        }       
        whole.rotation.y += (mouse.x*0.5)%(2*Math.PI); 
        whole.rotation.z += (mouse.y*0.5)%(2*Math.PI);		
        }
	    function onDocumentMouseMove( event ) {
			event.preventDefault();
			mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
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



