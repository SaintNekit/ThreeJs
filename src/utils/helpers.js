import * as THREE from 'three';
import starsBackground from '../assets/galaxy_starfield.png';
import earthTextures from '../assets/2_no_clouds_4k.jpg';
import earthHiils from '../assets/elev_bump_4k.jpg';
import earthWater from '../assets/water_4k.png';
import earthClouds from '../assets/fair_clouds_4k.png';
import sunTextures from '../assets/sun.jpg';
import moonTextures from '../assets/moon_1024.jpg';
import moonCrators from '../assets/4k_ceres_fictional.jpg';

const texturesLoader = new THREE.TextureLoader();
const planetAxis = 32;

export const createMesh = (geometry, material) => {
  return new THREE.Mesh(geometry, material);
};

export const removeLights = (mainLight, secondaryLight, scene) => {
  scene.remove(mainLight);
  scene.add(secondaryLight);
};

export const createEarth = () => {
  return createMesh(new THREE.SphereGeometry(0.1, planetAxis, planetAxis), new THREE.MeshPhongMaterial({
    map: texturesLoader.load(earthTextures),
    bumpMap: texturesLoader.load(earthHiils),
    bumpScale: 0.005,
    specularMap: texturesLoader.load(earthWater),
    specular: new THREE.Color('gray'),
  }))
};

export const createClouds = () => {
  return createMesh(new THREE.SphereGeometry(0.103, planetAxis, planetAxis), new THREE.MeshBasicMaterial({
    map: texturesLoader.load(earthClouds),
    transparent: true,
  }))
};

export const createStars = () => {
  return createMesh(new THREE.SphereGeometry(90, planetAxis * 2, planetAxis * 2), new THREE.MeshPhongMaterial({
    map: texturesLoader.load(starsBackground),
    side: THREE.BackSide,
  }))
};

export const createSun = () => {
  return createMesh(new THREE.SphereGeometry(1, planetAxis, planetAxis), new THREE.MeshBasicMaterial({
    map: texturesLoader.load(sunTextures),
    // side: THREE.DoubleSide,
  }));
};

export const createMoon = () => {
  return createMesh(new THREE.SphereGeometry(0.05, planetAxis, planetAxis), new THREE.MeshPhongMaterial({
    map: texturesLoader.load(moonTextures),
    bumpMap: texturesLoader.load(moonCrators),
    shininess: 40,
    bumpScale: 0.002,
  }));
}
