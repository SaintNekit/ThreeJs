import * as THREE from 'three';

export const createMesh = (geometry, material) => {
  return new THREE.Mesh(geometry, material);
}