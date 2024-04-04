import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'


const iframe = document.getElementById('iframe')



var scene = new THREE.Scene();


// Load laptop
const gltfLoader = new GLTFLoader()

gltfLoader.load('laptop.gltf', (laptop) => {
  laptop = laptop
  const textureLoader = new THREE.TextureLoader()
  const textureBaked = textureLoader.load('bakeLaptop.jpg')
  textureBaked.flipY = false
  laptop.scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.name != 'Plane001') {
      const material = new THREE.MeshBasicMaterial({
        map: textureBaked
      })
      child.material = material
    }
  })
  scene.add(laptop.scene)

})

gltfLoader.load('screen.gltf', (screen) => {
  screen = screen
  const textureLoader = new THREE.TextureLoader()
  const textureBaked = textureLoader.load('bakeLaptop.jpg')
  textureBaked.flipY = false
  screen.scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
      child.material = material
    }
  })

  scene.add(screen.scene)

  var background = makeElementObject(iframe, 1300, 800, screen)
  let escala = 0.00363
  background.scale.set(escala, escala, escala)
  let value = 1 / escala
  background.children[1].position.z = screen.scene.children[0].position.z * value
  background.children[1].position.y = screen.scene.children[0].position.y * value
  background.children[0].position.z = screen.scene.children[0].position.z * value
  background.children[0].position.y = screen.scene.children[0].position.y * value

  background.children[1].rotation.x = screen.scene.children[0].rotation.x
  background.children[0].rotation.x = screen.scene.children[0].rotation.x


  console.log(screen.scene.children[0].rotation)


  console.log(background.children[0].rotation)

  //background.rotation.copy(screen.scene.children[0].rotation)


  scene.add(background);



})





var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var cssRenderer = new CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.id = 'three-html-box'
document.body.appendChild(cssRenderer.domElement);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var controls = new OrbitControls(camera, cssRenderer.domElement);
camera.position.set(0, 4, 5);
const target = new THREE.Vector3(0, 0, 0); // Por ejemplo, el centro de la escena
controls.target.copy(target);
controls.update();









function animate() {
  requestAnimationFrame(animate);
  // Actualizar la animación si es necesario
  cssRenderer.render(scene, camera);
  renderer.render(scene, camera);
  controls.update();
}
animate();


function makeElementObject(type, width, height, screen) {
  const obj = new THREE.Object3D

  var css3dObject = new CSS3DObject(type);
  obj.css3dObject = css3dObject

  obj.add(css3dObject)

  // make an invisible plane for the DOM element to chop
  // clip a WebGL geometry with it.
  var material = new THREE.MeshPhongMaterial({
    opacity: 0.15,
    color: new THREE.Color(0x111111),
    blending: THREE.NoBlending,
    // side	: THREE.DoubleSide,
  });
  var geometry = new THREE.BoxGeometry(width, height, 2);
  var mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  obj.lightShadowMesh = mesh

  obj.add(mesh);
  console.log(obj.position)

  return obj
}


