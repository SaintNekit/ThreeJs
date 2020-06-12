import React from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {} from './'

const App = () => {
  let font;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xAF10BA);
  const BigBallOrbit = new THREE.Object3D();
  const MediumBallOrbit = new THREE.Object3D();
  const camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.01, 10000 );
  const light = new THREE.DirectionalLight(0xFFFFFF, 1);
  const geometryCube = new THREE.BoxBufferGeometry( 60, 60, 60 );
  const geometryBall = new THREE.SphereBufferGeometry( 40, 20, 10 );
  const planeGeometry = new THREE.BoxBufferGeometry( 100, 150, 0);
  const firstBall = new THREE.SphereBufferGeometry(20, 20, 20);
  const secondBall = new THREE.SphereBufferGeometry(40, 40, 40);
  const thirdBall = new THREE.SphereBufferGeometry(80, 80, 80);
  const loader = new THREE.FontLoader();

  loader.load('./font_ubuntu.json', (val) => {
    console.log(val)
    font = val;
  });
  const textGeometry = new THREE.TextBufferGeometry('Hello World', {
    font: font, 
    size: 500,
    height: 450,
    curveSegments: 320,
    bevelEnabled: false,
    bevelThickness: 0.3,
    bevelSize: 0.1,
    bevelSegments: 5,
  });
  const renderer = new THREE.WebGLRenderer( { antialias: true });
  const clock = new THREE.Clock();
  let angle = 0;
  const angSpeed = THREE.Math.degToRad(80);
  const radius = 100;

  const setOrbitControls = () => {
    const controls = new OrbitControls( camera, renderer.domElement );
    // controls.enablePan = false;
    controls.update();
  }

  const generateColor = () => {
    const material = new THREE.MeshPhongMaterial();

    const hue = Math.random();
    const saturation = 1;
    const luminance = 0.5;
    material.color.setHSL(hue, saturation, luminance);

    return material;
  }

  const createBalls = (geometry, positionX, positionY) => {
    const figure = new THREE.Mesh( geometry, generateColor() );

    figure.position.x = positionX;
    figure.position.y = positionY;
    return figure;
  }

  const createFigure = (geometry, positionX) => {
    const figure = new THREE.Mesh( geometry, generateColor() );

    scene.add(figure);
    figure.position.x = positionX;
    return figure;
  };

  const cube = createFigure(geometryCube, 0);
  const ball = createFigure(geometryBall, 150);
  const list = createFigure(planeGeometry, 300);
  const text = createFigure(textGeometry, -150);
  const smallBall = createBalls(firstBall, 50, 100);
  const mediumBall = createBalls(secondBall, 200, 250);
  const bigBall = createBalls(thirdBall, 0, 400);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight)
  })

  const init = () => {
    
    camera.position.set(800, -600, 300);

    light.position.set(100, 200, 1000);

    scene.add(light);
    scene.add(font);
    scene.add(BigBallOrbit);
    BigBallOrbit.add(bigBall);
    BigBallOrbit.add(MediumBallOrbit);
    MediumBallOrbit.add(mediumBall);
    mediumBall.add(smallBall);

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    setOrbitControls();
  }

  const animate = () => {
    requestAnimationFrame( animate );
    cube.rotation.x += 0.02;
    cube.rotation.y += 0.02;
    ball.rotation.x += 0.1;
    ball.rotation.y += 0.1;
    list.rotation.y += 0.01;
    BigBallOrbit.rotation.y +=0.02;
    mediumBall.rotation.x +=0.03;
    mediumBall.rotation.y += 0.01;
    smallBall.rotation.x +=0.1;
    // MediumBallOrbit.position.x = 50;

    const delta = clock.getDelta();
    // camera.position.x = Math.cos(angle) * radius;
    // camera.position.z = Math.sin(angle) * radius;
    angle += angSpeed * delta;
    // camera.lookAt(cube.position);
    
    renderer.render( scene, camera );
  }
  init();
  animate();
  return (
    <div/>
  )
}

export default App;
