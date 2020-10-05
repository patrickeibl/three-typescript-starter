// add styles
import './style.css';
// three.js
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// create the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color('white')

// create the camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();

// set size
renderer.setSize(window.innerWidth, window.innerHeight);

// add canvas to dom
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

// add lights
const light = new THREE.DirectionalLight(0xffffff, 0.75)
light.position.set(100, 100, 100);
light.lookAt(scene.position)
scene.add(light);

const ambient = new THREE.AmbientLight(0xffffff, 0.75)
scene.add(ambient)

const wireframe = false;

const postWidth = 5.5
const postHeight = 48
const postXDistance = 64.25
const postZDistance = 36
const postMaterial = new THREE.MeshStandardMaterial({color: new THREE.Color('rgb(148,106,82)'), wireframe: wireframe})

const posts: THREE.Mesh[] = []
for (let i = 0; i < 4; i++) {
  posts.push(new THREE.Mesh(new THREE.BoxGeometry(postWidth, postHeight, postWidth), postMaterial));
  scene.add(posts[i]);
  posts[i].position.x = (i & 1) ? postXDistance + postWidth / 2 : postWidth / 2
  posts[i].position.y = postHeight / 2
  posts[i].position.z = (i >= 2) ? postZDistance + postWidth / 2 : postWidth / 2
}

const woodMaterial = new THREE.MeshStandardMaterial({color: new THREE.Color('rgb(202,164,114)'), wireframe: wireframe})
const supportHeight = 5.5
const sinkOpeningDepth = 22.375
const sinkOpeningWidth = 31.375
const twoByFourDepth = 1.5
const twoByFourHeight = 3.5
const counterDepth = 2 * twoByFourDepth + sinkOpeningDepth
const supportDepth = postZDistance + postWidth + counterDepth
const counterToGround = 24

const leftSupport = new THREE.Mesh(new THREE.BoxGeometry(twoByFourDepth, supportHeight, supportDepth), woodMaterial)
leftSupport.position.x = posts[0].position.x + postWidth / 2 + twoByFourDepth / 2;
leftSupport.position.y = counterToGround - supportHeight / 2;
leftSupport.position.z = supportDepth / 2;
scene.add(leftSupport)

const rightSupport = leftSupport.clone()
rightSupport.position.x = posts[1].position.x - postWidth / 2 - twoByFourDepth / 2;
scene.add(rightSupport)

const counterFrame = new THREE.Group()

const counterFrameLeft = new THREE.Mesh(new THREE.BoxGeometry(twoByFourDepth, twoByFourHeight, sinkOpeningDepth), woodMaterial)
counterFrameLeft.position.x = leftSupport.position.x + twoByFourDepth
counterFrameLeft.position.y = counterToGround - twoByFourHeight / 2
counterFrameLeft.position.z = posts[2].position.z + postWidth / 2 + sinkOpeningDepth / 2 + twoByFourDepth
counterFrame.add(counterFrameLeft)

const counterFrameRight = counterFrameLeft.clone()
counterFrameRight.position.x = rightSupport.position.x - twoByFourDepth
counterFrame.add(counterFrameRight)

const counterFrameMiddle = counterFrameLeft.clone()
counterFrameMiddle.position.x = counterFrameRight.position.x - sinkOpeningWidth
counterFrame.add(counterFrameMiddle)

const counterFrameWidth = postXDistance - 2 * twoByFourDepth - postWidth
const counterFrameBack = new THREE.Mesh(new THREE.BoxGeometry(counterFrameWidth, twoByFourHeight, twoByFourDepth), woodMaterial)
counterFrameBack.position.x = (counterFrameLeft.position.x + counterFrameRight.position.x) / 2
counterFrameBack.position.y = counterFrameLeft.position.y
counterFrameBack.position.z = posts[2].position.z + postWidth / 2 + twoByFourDepth / 2
counterFrame.add(counterFrameBack)

const counterFrameFront = counterFrameBack.clone()
counterFrameFront.position.z += counterDepth - twoByFourDepth
counterFrame.add(counterFrameFront)

scene.add(counterFrame)

const shelfFrame = counterFrame.clone()
const shelfFrameDrop = 15
shelfFrame.position.y = counterFrame.position.y - shelfFrameDrop
scene.add(shelfFrame)

const shelfSupportHeight = shelfFrameDrop + twoByFourHeight
const shelfSupportWidth = 1.5
const shelfSupportBL = new THREE.Mesh(new THREE.BoxGeometry(shelfSupportWidth, shelfSupportHeight, shelfSupportWidth), woodMaterial)
shelfSupportBL.position.x = counterFrameLeft.position.x + twoByFourDepth
shelfSupportBL.position.y = counterFrameLeft.position.y - shelfFrameDrop / 2
shelfSupportBL.position.z = counterFrameBack.position.z + twoByFourDepth
scene.add(shelfSupportBL)

const ground = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ color: new THREE.Color('green'), side: THREE.DoubleSide }))
ground.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 2)
ground.position.x = postXDistance / 2
ground.position.z = postZDistance / 2
scene.add(ground)

camera.position.set(100, 100, 100)
camera.lookAt(scene.position);

function animate(): void {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera)
}

animate();
