import React from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const App = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.01, 10000 );
  const light = new THREE.DirectionalLight(0xFFFFFF, 1);
  const geometryCube = new THREE.BoxBufferGeometry( 60, 60, 60 );
  const geometryBall = new THREE.SphereBufferGeometry( 40, 20, 10 );
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

  const createFigure = (geometry, positionX, color) => {
    const material = new THREE.MeshPhongMaterial({color});

    const figure = new THREE.Mesh( geometry, material );

    scene.add(figure);
    figure.position.x = positionX;
    return figure;
  };

  const cube = createFigure(geometryCube, 0, 0xffff00);
  const ball = createFigure(geometryBall, 150, 0xffffff);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight)
  })

  const init = () => {
    
    camera.position.set(50, 200, 200);

    light.position.set(100, 200, 1000);

    scene.add(light);

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

    const delta = clock.getDelta();
    camera.position.x = Math.cos(angle) * radius;
    camera.position.z = Math.sin(angle) * radius;
    angle += angSpeed * delta;
    camera.lookAt(cube.position);
    
    renderer.render( scene, camera );
  }
  init();
  animate();
  return (
    <div/>
  )
}

export default App;
