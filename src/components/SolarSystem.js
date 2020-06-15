import React from 'react';
import * as THREE from 'three';
import { createMesh } from '../utils/helpers';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import starsBackground from '../assets/galaxy_starfield.png';
import earthTextures from '../assets/2_no_clouds_4k.jpg';
import earthHiils from '../assets/elev_bump_4k.jpg';
import earthWater from '../assets/water_4k.png';
import earthClouds from '../assets/fair_clouds_4k.png';
import sunMat from '../assets/sun.jpg';

const SolarSystem = () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01, 10000 );
  const renderer = new THREE.WebGLRenderer( { antialias: true });
  const texturesLoader = new THREE.TextureLoader();
  const light = new THREE.PointLight(0xffffff, 1);
  const ambLight = new THREE.AmbientLight(0x333333);
  const sunOrbit = new THREE.Object3D();
  const earthOrbit = new THREE.Object3D();

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

  const sunGeometry = new THREE.SphereGeometry(1, 30, 30);
  const sunMaterial = new THREE.MeshBasicMaterial({
    map: texturesLoader.load(sunMat),
  });
  
  const sun = createMesh(sunGeometry, sunMaterial);
  const earth = createMesh(earthGeometry, earthMaterial);
  const stars = createMesh(starsGeometry, starsMaterial);
  const clouds = createMesh(cloudsGeometry, cloudsMaterial);

  const setOrbitControls = () => {
    const controls = new OrbitControls( camera, renderer.domElement );
    controls.update();
  }

  const init = () => {
    camera.position.z = 10;
    sun.position.x = 0;
    light.position.x = 0;
    earth.position.x = 2;
    clouds.position.x = 2;

    // light.position.set(2, 0, 0);

    scene.add(ambLight);
    scene.add(light);
    scene.add(stars);
    scene.add(sunOrbit);
    sunOrbit.add(earthOrbit);
    sunOrbit.add(sun);
    earthOrbit.add(earth);
    earthOrbit.add(clouds);

    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild(renderer.domElement);
    setOrbitControls();
  };

  const animate = () => {
    earth.rotation.y += 0.005;
    clouds.rotation.y += 0.006;
    clouds.rotation.x += 0.0009;
    // earthOrbit.rotation.y += 0.01;
    sunOrbit.rotation.y += 0.01;
    sun.rotation.x +=0.005;

    // camera.lookAt(sun.position);

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
