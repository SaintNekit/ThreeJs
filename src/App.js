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
  const geometryCube = new THREE.BoxBufferGeometry( 160, 160, 160 );
  const geometryBall = new THREE.SphereBufferGeometry( 40, 20, 10 );
  const planeGeometry = new THREE.BoxBufferGeometry( 100, 150, 0);
  const firstBall = new THREE.SphereBufferGeometry(20, 20, 20);
  const secondBall = new THREE.SphereBufferGeometry(40, 40, 40);
  const thirdBall = new THREE.SphereBufferGeometry(80, 80, 80);
  const textLoader = new THREE.FontLoader();
  const texturesLoader = new THREE.TextureLoader();

  const textGeometry = new THREE.TextBufferGeometry('Hello World', {
    font: textLoader.load('./font_ubuntu.json'), 
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
    const material = new THREE.MeshPhongMaterial({shininess: 100});

    const h = Math.random();
    const s = 1;
    const l = 0.5;
    material.color.setHSL(h, s, l);

    return material;
  }

  const createBalls = (geometry, positionX, positionY) => {
    const figure = new THREE.Mesh( geometry, generateColor() );

    figure.position.x = positionX;
    figure.position.y = positionY;
    return figure;
  }

  const createFigure = (geometry, positionX, textures) => {
    let material;
    if (textures === 'list') {
      material = new THREE.MeshBasicMaterial({
        map: texturesLoader.load('https://sun9-62.userapi.com/c858524/v858524417/af57f/FWDhwH0unuY.jpg'),
      })
    }
    if (textures === 'cube') {
      material = [
        new THREE.MeshBasicMaterial({map: texturesLoader.load('https://sun1.beltelecom-by-minsk.userapi.com/MX7mQhAFmuDsr80KdW1rQpVtvu4Yp0YMTBpdHg/YZJYw4zQ_QE.jpg')}),
        new THREE.MeshBasicMaterial({map: texturesLoader.load('https://sun1.beltelecom-by-minsk.userapi.com/EOdGSI41514IhsLCqyUnpr56z9PUG-4p8nTstg/pvhZB4u2SN8.jpg')}),
        new THREE.MeshBasicMaterial({map: texturesLoader.load('https://sun1.beltelecom-by-minsk.userapi.com/Ww8dAQOjhGVBLAdDJr3PtcquAsjQlzO_0fLX9A/jrueCNpvVUs.jpg')}),
        new THREE.MeshBasicMaterial({map: texturesLoader.load('https://sun2.beltelecom-by-minsk.userapi.com/mQjuiW3Aa2-suXZ2GP8ydZ0hhWWf_0xYT2mkrw/XlYfqfM15hs.jpg')}),
        new THREE.MeshBasicMaterial({map: texturesLoader.load('https://sun1.beltelecom-by-minsk.userapi.com/NbR1uak6fCdOmZQ18Hh1vFZqlPoYx4FHDZvM7Q/2JlHQnP0ejE.jpg')}),
        new THREE.MeshBasicMaterial({map: texturesLoader.load('https://sun1.beltelecom-by-minsk.userapi.com/FZ53O_SnppsoLbbaDA14CuRxxzb-D5sBJgQzoQ/6A0aSf-z4pk.jpg')}),
      ]
    }
    
    const figure = new THREE.Mesh( geometry, textures ? material : generateColor() );

    scene.add(figure);
    figure.position.x = positionX;
    return figure;
  };

  const animeBall = new THREE.Mesh(thirdBall, new THREE.MeshToonMaterial({color: 'yellow'}));
  animeBall.position.x = -500;
  animeBall.position.y = 100;
  animeBall.rotation.y = 5;

  const cube = createFigure(geometryCube, 0, 'cube');
  const ball = createFigure(geometryBall, 150);
  const list = createFigure(planeGeometry, 300, 'list');
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
    
    camera.position.set(0, -200, 700);

    light.position.set(100, 200, 1000);

    scene.add(light);
    scene.add(font);
    scene.add(BigBallOrbit);
    scene.add(animeBall);
    BigBallOrbit.add(bigBall);
    BigBallOrbit.add(MediumBallOrbit);
    MediumBallOrbit.add(mediumBall);
    mediumBall.add(smallBall);
    list.add(ball);

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
    camera.lookAt(bigBall.position);
    
    renderer.render( scene, camera );
  }
  init();
  animate();
  return (
    <div/>
  )
}

export default App;
