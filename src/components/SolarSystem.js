import React from 'react';
import * as THREE from 'three';
import { createMesh } from '../utils/helpers';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import starsBackground from '../assets/galaxy_starfield.png';
import earthTextures from '../assets/2_no_clouds_4k.jpg';
import earthHiils from '../assets/elev_bump_4k.jpg';
import earthWater from '../assets/water_4k.png';
import earthClouds from '../assets/fair_clouds_4k.png';
import sunTextures from '../assets/sun.jpg';
import moonTextures from '../assets/moon_1024.jpg';
import moonCrators from '../assets/4k_ceres_fictional.jpg';

const SolarSystem = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01, 10000 );
  const renderer = new THREE.WebGLRenderer( { antialias: true });
  const texturesLoader = new THREE.TextureLoader();
  const light = new THREE.PointLight(0xffffff, 1);
  const ambLight = new THREE.AmbientLight(0x333333);
  const earthOrbit = new THREE.Object3D();
  let earthAngle = 0;
  let moonAngle = 0;

  const earthGeometry = new THREE.SphereGeometry(0.1, 32, 32);
  const earthMaterial = new THREE.MeshPhongMaterial({
    map: texturesLoader.load(earthTextures),
    bumpMap: texturesLoader.load(earthHiils),
    bumpScale: 0.005,
    specularMap: texturesLoader.load(earthWater),
    specular: new THREE.Color('gray'),
  });

  const starsGeometry = new THREE.SphereGeometry(90, 64, 64);
  const starsMaterial = new THREE.MeshPhongMaterial({
    map: texturesLoader.load(starsBackground),
    side: THREE.BackSide,
  });

  const cloudsGeometry = new THREE.SphereGeometry(0.103, 32, 32);
  const cloudsMaterial = new THREE.MeshBasicMaterial({
    map: texturesLoader.load(earthClouds),
    transparent: true,
  });

  const sunGeometry = new THREE.SphereGeometry(1, 50, 50);
  const sunMaterial = new THREE.MeshBasicMaterial({
    map: texturesLoader.load(sunTextures),
    // side: THREE.DoubleSide,
  });

  const moonGeometry = new THREE.SphereGeometry(0.05, 30, 30);
  const moonMaterial = new THREE.MeshPhongMaterial({
    map: texturesLoader.load(moonTextures),
    bumpMap: texturesLoader.load(moonCrators),
    shininess: 40,
    bumpScale: 0.002,
  })
  
  const sun = createMesh(sunGeometry, sunMaterial);
  const earth = createMesh(earthGeometry, earthMaterial);
  const stars = createMesh(starsGeometry, starsMaterial);
  const clouds = createMesh(cloudsGeometry, cloudsMaterial);
  const moon = createMesh(moonGeometry, moonMaterial);

  const setOrbitControls = () => {
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.update();
  }

  const init = () => {
    camera.position.z = 7;
    sun.position.x = 0;
    light.position.x = 0;

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
    setOrbitControls();
  };

  const animate = () => {
    earth.rotateOnAxis(new THREE.Vector3(0.5, 1, 0).normalize(), 0.01);
    clouds.rotateOnAxis(new THREE.Vector3(0.5, 1, -0.5).normalize(), 0.02);
    // moon.rotateOnAxis(new THREE.Vector3(0.5, 0, 0).normalize(), 0.005);
    sun.rotateOnAxis(new THREE.Vector3(0, 0.3, -0.5).normalize(), 0.01);

    earthAngle += 0.015 * (75 * (Math.PI / 360));
    moonAngle += 0.04 * (75 * (Math.PI / 360));

    earthOrbit.position.x = Math.sin(earthAngle) * 2;
    earthOrbit.position.z = Math.cos(earthAngle) * 2;
    moon.position.y = Math.cos(moonAngle) * 0.3;
    moon.position.z = Math.sin(moonAngle) * 0.3;

    moon.lookAt(earthOrbit.position);

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
  };

  init();
  animate();

  return (
    <div id="canvas"/>
  )
}

export default SolarSystem;
