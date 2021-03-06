import './style.css'
import * as THREE from 'three'
//import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { LayerMaterial, Base, Depth, Fresnel, Noise, Displace } from 'lamina/vanilla'
import { Vector3 } from 'three'

//const gui = new dat.GUI();
let canvas_width = window.innerWidth;
let canvas_height = window.innerHeight * 3;

    let targetX = 0;
    let targetY = 0;
class Scene {
  constructor() {

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    this.renderer.setSize(window.innerWidth, canvas_height);
    //this.renderer.setClearColor('black', 0);
    
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / canvas_height,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 10);    
    
    this.scene = new THREE.Scene();
    
    this.clock = new THREE.Clock();
    //this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    
    this.init();
    this.animate();
  }
  
  init() {
    this.addCanvas();
    this.addElements();
    this.addEvents();
   
  } 
  
  addCanvas() {
    const canvas = this.renderer.domElement;
    canvas.classList.add('webgl');
    document.body.appendChild(canvas);
  }  
  
  addElements() {
    //abstract sphere

    //abs sphere geometry
    const geometry = new THREE.IcosahedronBufferGeometry(1, 64);
    
    //abs sphere layers
    
    const displaceLayer = new Displace({
      type: 'perlin',
    });


    
    //abs sphere material
    const mat = new LayerMaterial({
      color: "white",
      lighting: "phong",
      layers: [
        
        displaceLayer,
      ]
    })

    this.mesh = new THREE.Mesh(geometry, mat)

    //particle system
    const vertices = [];
    
    for(let i = 0; i < 20000; i++){

      let x = (Math.random() - 0.5) * 10;
      let y = (Math.random() - 0.5) * 10;
      let z = (Math.random() - 0.5) * 10;

      vertices.push(x, y ,z);
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.Float32BufferAttribute( vertices, 3 ));
    
    const particleMat = new THREE.PointsMaterial({
      size: 0.007
    });
    
    this.particleMesh = new THREE.Points(particleGeo, particleMat);

    // Image Loader

    // const loader = new THREE.TextureLoader();
    // const imgPlane =  new THREE.PlaneBufferGeometry(5, 1.3);
    // for (let i = 0; i < 3; i++){
    //   const imgMaterial = new THREE.MeshBasicMaterial({
    //     map: loader.load(`/blackhole/${i}.png`)
    //   })
    //   const img = new THREE.Mesh(imgPlane, imgMaterial)
    //   img.position.set(1, i*1.8)
    //   this.scene.add(img);
    // }
    
    //add meshes to scene here

    //lights

    const ambLight = new THREE.AmbientLight('#FFFFFF', 1);
    
    this.scene.add(this.particleMesh, this.mesh, ambLight)
  }
  
  addEvents() {
    window.addEventListener('resize', this.resize.bind(this));
    document.addEventListener('mousemove', this.onDocumentMouseMove);
  }
  
  
  resize() {
    let width = window.innerWidth;
    let height = canvas_height;

    this.camera.aspect = width / height;
    this.renderer.setSize(width, height);

    this.camera.updateProjectionMatrix();
  }
  
  onDocumentMouseMove(){
    let mouseX = 0;
    let mouseY = 0;

    

    const windowX = window.innerWidth / 2;
    const windowY = canvas_height / 2;

    mouseX = (event.clientX - windowX);
    mouseY = (event.clientY - windowY);

    targetX = mouseX * 0.001
    targetY = mouseY * 0.001

    
}

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }

  render() {
    //this.controls.update();

    this.mesh.rotation.x = 0.5 * this.clock.getElapsedTime();
    this.mesh.rotation.y = 0.5 * this.clock.getElapsedTime();
    this.particleMesh.rotation.x = 0.2 * this.clock.getElapsedTime();
    this.particleMesh.rotation.y = 0.2 * this.clock.getElapsedTime();

    //console.log(this.clock.getElapsedTime());

    this.mesh.rotation.x = 0.5 * (targetY - this.mesh.rotation.x);
    this.mesh.rotation.y = 0.5 * (targetX - this.mesh.rotation.y);
    this.mesh.rotation.z = 0.5 * (targetY - this.mesh.rotation.x);
    this.particleMesh.rotation.x = 0.5 * (targetX - this.particleMesh.rotation.y);
    this.particleMesh.rotation.y = 0.5 * (targetY - this.particleMesh.rotation.x);
    this.particleMesh.rotation.z = 0.5 * (targetX - this.particleMesh.rotation.y);
     
    this.renderer.render(this.scene, this.camera);
    //console.log(targetX, targetY);
  }  
}

new Scene();