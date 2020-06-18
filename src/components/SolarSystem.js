import React from 'react';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { removeLights, createEarth, createClouds, createStars, createSun, createMoon } from '../utils/helpers';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TweenMax, TimelineMax } from 'gsap';


const SolarSystem = () => {
  let display = true;
  let reverse = false;

  const gui = new dat.GUI();
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01, 10000 );
  const renderer = new THREE.WebGLRenderer( { antialias: true });
  const light = new THREE.PointLight(0xffffff, 1);
  const ambLight = new THREE.AmbientLight(0x333333);
  const earthOrbit = new THREE.Object3D();
  const zeroValue = 0.01;
  let earthAngle = zeroValue;
  let moonAngle = zeroValue;
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const earthVector = new THREE.Vector3(0.5, 1, zeroValue);
  const cloudVector = new THREE.Vector3(0.5, 1, -0.5);
  const sunVector = new THREE.Vector3(zeroValue, 0.3, zeroValue);
  const starsTimeLine = new TimelineMax({ yoyo: true });
  const planetsTimeLine = new TimelineMax();
  let sunSpinningSpeed = zeroValue;
  let earthSpinningSpeed = zeroValue;
  let earthFlyingSpeed = zeroValue;
  let moonFlyingSpeed = zeroValue;
  
  const sun = createSun();
  const earth = createEarth();
  const stars = createStars();
  const clouds = createClouds();
  const moon = createMoon();

  const setOrbitControls = () => {
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.update();
  }

  const init = () => {
    gui.width = '300px';
    const folder = gui.addFolder('Options');
    const settings = {
      'sun spinning speed': sunSpinningSpeed,
      'earth spinning speed': earthSpinningSpeed,
      'earth rotation speed': earthFlyingSpeed,
      'moon rotation speed': moonFlyingSpeed,
    };
    folder.add(settings, 'sun spinning speed', -1.0, 1.0).onChange((speed) => {
      sunSpinningSpeed = speed;
    });
    folder.add(settings, 'earth spinning speed', -1.0, 1.0).onChange((speed) => {
      earthSpinningSpeed = speed;
    });
    folder.add(settings, 'earth rotation speed', -1.0, 1.0).onChange((speed) => {
      earthFlyingSpeed = speed;
    });
    folder.add(settings, 'moon rotation speed', -1.0, 1.0).onChange((speed) => {
      moonFlyingSpeed = speed;
    })
    folder.open();

    camera.position.set(zeroValue, 2, 7);
    light.intensity = zeroValue;
    sun.scale.set(zeroValue);
    earthOrbit.scale.set(zeroValue);
    moon.scale.set(zeroValue);

    starsTimeLine.add(
      TweenMax.to(stars.rotation, 10, {
        y: 1,
        z: 3,
        ease: 'sine.out'
      }),
    );

    planetsTimeLine.add(
      TweenMax.to(light, 5, {
        intensity: 1,
        ease: 'power1.out',
      })
    );
    planetsTimeLine.add(
      TweenMax.to(sun.scale, 4, {
        x: 1,
        y: 1,
        z: 1,
        ease: 'power2.in',
      }), + 1
    );
    planetsTimeLine.add(
      TweenMax.to(earthOrbit.scale, 5, {
        x: 1,
        y: 1,
        z: 1,
        ease: 'power3.out'
      }), + 5
    );
    planetsTimeLine.add(
      TweenMax.to(moon.scale, 5, {
        x: 1,
        y: 1,
        z: 1,
        ease: 'power4.inOut'
      }), + 7
    );
    
    // scene.add(ambLight);
    scene.add(light);
    scene.add(stars);
    scene.add(sun);
    scene.add(earthOrbit);
    earthOrbit.add(earth);
    earthOrbit.add(clouds);
    earthOrbit.add(moon);

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild(renderer.domElement);
    document.body.style.overflow = 'hidden';
    setOrbitControls();
    document.addEventListener('mousedown', mouseClick);
    window.addEventListener('resize', windowResize, false);
  };

  const animate = () => {
    earth.rotateOnAxis(earthVector.normalize(), earthSpinningSpeed);
    clouds.rotateOnAxis(cloudVector.normalize(), earthSpinningSpeed * 2);
    sun.rotateOnAxis(sunVector.normalize(), sunSpinningSpeed);
    
    earthAngle += earthFlyingSpeed * (Math.PI / 3);
    moonAngle += moonFlyingSpeed * (Math.PI / 0.8);

    earthOrbit.position.set(Math.sin(earthAngle) * 3, 0, Math.cos(earthAngle) * 2);
    moon.position.set(Math.sin(moonAngle) * 0.3, 0, Math.cos(moonAngle) * 0.3);

    moon.lookAt(earthOrbit.position);

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
  };

  const mouseClick = (e) => {
    e.preventDefault();
    mouse.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
    const sunObj = raycaster.intersectObject(sun);
    const starsObj = raycaster.intersectObject(stars);
    
    if(starsObj.length && e.ctrlKey) {
      reverse = !reverse;
      reverse ? starsTimeLine.play() : starsTimeLine.reverse();
    };
    
    if (sunObj.length) {
      display = !display;
      display ? scene.add(sun) : scene.remove(sun);
      display ? removeLights(ambLight, light, scene) : removeLights(light, ambLight, scene);
    }
    
    renderer.render(scene, camera);
  };

  const windowResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  init();
  animate();

  return (
    <div id="canvas"/>
  )
}

export default SolarSystem;
