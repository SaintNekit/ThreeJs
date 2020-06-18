import React from 'react';
import * as THREE from 'three';
import { removeLights, createEarth, createClouds, createStars, createSun, createMoon } from '../utils/helpers';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TweenMax, TimelineMax } from 'gsap';

const SolarSystem = () => {
  let display = true;
  let reverse = false;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01, 10000 );
  const renderer = new THREE.WebGLRenderer( { antialias: true });
  const light = new THREE.PointLight(0xffffff, 1);
  const ambLight = new THREE.AmbientLight(0x333333);
  const earthOrbit = new THREE.Object3D();
  const zeroValue = 0;
  let earthAngle = 0;
  let moonAngle = 0;
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const earthVector = new THREE.Vector3(0.5, 1, zeroValue);
  const cloudVector = new THREE.Vector3(0.5, 1, -0.5);
  const sunVector = new THREE.Vector3(zeroValue, 0.3, zeroValue);
  const rotationSpeed = 0.01;
  const starsTimeLine = new TimelineMax({ yoyo: true });
  const planetsTimeLine = new TimelineMax();
  
  
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
    earth.rotateOnAxis(earthVector.normalize(), rotationSpeed);
    clouds.rotateOnAxis(cloudVector.normalize(), rotationSpeed * 2);
    sun.rotateOnAxis(sunVector.normalize(), rotationSpeed);
    
    earthAngle += rotationSpeed * (Math.PI / 3);
    moonAngle += rotationSpeed * (Math.PI / 0.8);

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
    
    if(starsObj.length) {
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
