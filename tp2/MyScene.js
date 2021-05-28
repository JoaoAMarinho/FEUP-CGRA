import { CGFscene, CGFcamera, CGFaxis } from "../lib/CGF.js";
import { MyTangram } from "./MyTangram.js";
import { MyUnitCube } from "./MyUnitCube.js";
import { MyUnitCubeQuad } from "./MyUnitCubeQuad.js";

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
  }
  init(application) {
    super.init(application);
    
    this.initCameras();
    this.initLights();

    //Background color
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    //Initialize scene objects
    this.axis = new CGFaxis(this);
    this.tangram = new MyTangram(this);
    this.cube = new MyUnitCubeQuad(this);

    //Objects connected to MyInterface
    this.displayAxis = true;
    this.scaleFactor = 1;

    //Display diamnod, triangle and parallelogram
    this.displayTangram=true;
    this.displayCube=true;
    //this.displayDiamond=true;
    //this.displayTriangle=true;
    //this.displayParallelogram=true;
  }
  initLights() {
    this.lights[0].setPosition(15, 2, 5, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  initCameras() {
    this.camera = new CGFcamera(
      0.4,
      0.1,
      500,
      vec3.fromValues(15, 15, 15),
      vec3.fromValues(0, 0, 0)
    );
  }
  setDefaultAppearance() {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);
  }
  display() {
    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Draw axis
    if (this.displayAxis) this.axis.display();

    this.setDefaultAppearance();

    var sca = [
      this.scaleFactor,
      0.0,
      0.0,
      0.0,
      0.0,
      this.scaleFactor,
      0.0,
      0.0,
      0.0,
      0.0,
      this.scaleFactor,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
    ];

    this.multMatrix(sca);
    
    const translateCube = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 3, -0.5, 1
    ];

    const scaleCube = [
      6,0,0,0,
      0,7,0,0,
      0,0,1,0,
      0,0,0,1
    ];

    const rotateAll = [
      1,0,0,0,
      0, Math.cos(-Math.PI/2), Math.sin(-Math.PI/2),0,
      0,-Math.sin(-Math.PI/2),Math.cos(-Math.PI/2),0,
      0,0,0,1
    ];
 
    const translateAll = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      3, 0, 6.5, 1
    ];

    const translateTangram = [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0.5, 0, 1
    ];



    this.pushMatrix();
      this.multMatrix(translateAll);
      this.multMatrix(rotateAll);
      this.pushMatrix();
        this.multMatrix(translateCube);
        this.multMatrix(scaleCube);
        if(this.displayCube) this.cube.display(this);
      this.popMatrix();
      this.pushMatrix();
        this.multMatrix(translateTangram);
        if(this.displayTangram) this.tangram.display(this);
      this.popMatrix();
    this.popMatrix();


  }
}