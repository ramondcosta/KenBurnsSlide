var renderer;
var scene;
var camera;
var composer;
var texture;
var shaderPass;
var grayShaderPass;
var grayShaderMaterial;
var parameters;
var uniforms;

var reset = false;

var gui = new dat.GUI();

function init() {

	scene = new THREE.Scene();
	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	buildGUI();

	camera = new THREE.OrthographicCamera( -0.5, 0.5, 0.5, -0.5, -1.0, 1.0 );
	scene.add( camera );

	var textureLoader = new THREE.TextureLoader();
	texture = textureLoader.load("./Assets/Images/lena.png", onLoadTexture);
	var txtMaterial = new THREE.MeshBasicMaterial( {
					map : texture
					} );

	// Plane
	var planeGeometry 	= new THREE.PlaneBufferGeometry(1.0, 1.0, 20, 20);
	var plane = new THREE.Mesh( planeGeometry, txtMaterial );
	plane.position.set(0.0, 0.0, -0.5);
	scene.add( plane );

	document.getElementById("WebGL-output").appendChild(renderer.domElement);

	renderer.clear();
    requestAnimationFrame( animate );
};

function onLoadTexture() {

	if (!texture.image)
		console.log("ERROR: loading texture");
	else {

		console.log("Image size: " + texture.image.width + " x " + texture.image.height);
		console.log("Pixel size: " + 1.0/texture.image.width + " x " + 1.0/texture.image.height);

		renderer.setSize(texture.image.width, texture.image.height);


		uniforms = {
			tOne: { type: "t", value: new THREE.TextureLoader().load( "./Assets/Images/barbara.png" ) },
			tTwo: { type: "t", value: new THREE.TextureLoader().load( "./Assets/Images/lena.png" ) },
			tCameraman: { type: "t", value: new THREE.TextureLoader().load( "./Assets/Images/cameraman.png" ) },
			tMandrill: { type: "t", value: new THREE.TextureLoader().load( "./Assets/Images/mandrill.png" ) },
			tChapa: { type: "t", value: new THREE.TextureLoader().load( "./Assets/Images/chapa.png" ) },
			zoom	: 	{ type: "f", value: 1.0 },
			t		: 	{ type: "f", value: 0.0 },
			fade	: 	{ type: "f", value: 1.0 },
			fade2	: 	{ type: "f", value: 0.0 },
			fade3	: 	{ type: "f", value: 0.0 },
			fade4	: 	{ type: "f", value: 0.0 },
			fade5	: 	{ type: "f", value: 0.0 },

		};
		grayShaderMaterial = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: document.getElementById( 'rgb-vs' ).textContent,
			fragmentShader: document.getElementById( 'gray-fs' ).textContent
		} );

		// THREE.rgbShader.fragmentShader = document.getElementById( 'gray-fs' ).textContent;

		composer = new THREE.EffectComposer(renderer);

		// Cria os passos de renderizacao
		var renderPass 	= new THREE.RenderPass(scene, camera);
		// shaderPass 		= new THREE.ShaderPass(THREE.rgbShader);

		grayShaderPass 	= new THREE.ShaderPass(grayShaderMaterial);
		// shaderPass.renderToScreen = true;
		grayShaderPass.renderToScreen = true;

		composer.addPass(renderPass);
		// composer.addPass(shaderPass);
		composer.addPass(grayShaderPass);
		composer.render();
		}
};


function buildGUI() {

	parameters = {
		bRFilter	: true,
		bGFilter	: true,
		bBFilter	: true
		};

	gui.add( parameters, 'bRFilter' );
	gui.add( parameters, 'bGFilter' );
	gui.add( parameters, 'bBFilter' );

	gui.open();

};

function animate() {
	update();
	render();
    requestAnimationFrame( animate );
};

function update() {

	var r=0.5,
		g=0.0,
		b=0.0;

};

function render() {
	// var delta = clock.getDelta();
	if(composer)
		composer.render();
	if(grayShaderMaterial){
		if(grayShaderMaterial.uniforms.fade.value > 0.0){
			grayShaderMaterial.uniforms.fade.value -= 0.005;
			grayShaderMaterial.uniforms.fade2.value =
				((1.0 - grayShaderMaterial.uniforms.fade.value));
		}else if (grayShaderMaterial.uniforms.fade2.value > 0.0) {
			grayShaderMaterial.uniforms.fade2.value -= 0.005;
			grayShaderMaterial.uniforms.fade3.value =
				((1.0 - grayShaderMaterial.uniforms.fade2.value));
		}else if (grayShaderMaterial.uniforms.fade3.value > 0.0) {
			grayShaderMaterial.uniforms.fade3.value -= 0.005;
			grayShaderMaterial.uniforms.fade4.value =
				((1.0 - grayShaderMaterial.uniforms.fade2.value));
		}else if (grayShaderMaterial.uniforms.fade4.value > 0.0) {
			grayShaderMaterial.uniforms.fade4.value -= 0.005;
			grayShaderMaterial.uniforms.fade5.value =
				((1.0 - grayShaderMaterial.uniforms.fade2.value));
		}
		// }else if (grayShaderMaterial.uniforms.fade5.value > 0.0) {
		// 	grayShaderMaterial.uniforms.fade2.value -= 0.005;
		// 	grayShaderMaterial.uniforms.fade3.value =
		// 		((1.0 - grayShaderMaterial.uniforms.fade2.value));
		// }


		if (grayShaderMaterial.uniforms.zoom.value < 2.0){
			grayShaderMaterial.uniforms.zoom.value += 0.005;
			grayShaderMaterial.uniforms.t.value += 0.001;

		}
		else {
			if (grayShaderMaterial.uniforms.t.value > 0)
				grayShaderMaterial.uniforms.t.value -= 0.001;
			else reset = true;
		}

	}
};
