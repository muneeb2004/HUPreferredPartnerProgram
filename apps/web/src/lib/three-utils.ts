/**
 * Three.js integration and resource management utilities.
 * Defines global rules and standard materials for the platform's 3D aesthetics.
 */

import * as THREE from 'three';

export const disposeNode = (node: THREE.Object3D): void => {
  if (node instanceof THREE.Mesh) {
    if (node.geometry) {
      (node.geometry as THREE.BufferGeometry).dispose();
    }
    if (node.material) {
      if (Array.isArray(node.material)) {
        node.material.forEach((mat): void => (mat as THREE.Material).dispose());
      } else {
        (node.material as THREE.Material).dispose();
      }
    }
  }
};

export const clearScene = (scene: THREE.Scene): void => {
  while (scene.children.length > 0) {
    const child = scene.children[0];
    if (child) {
      scene.remove(child);
      disposeNode(child);
    } else {
      break;
    }
  }
};

export const defaultMaterials = {
  gold: new THREE.MeshStandardMaterial({
    color: '#D4A853',
    metalness: 0.6,
    roughness: 0.2,
  }),
  navy: new THREE.MeshStandardMaterial({
    color: '#0A1628',
    metalness: 0.1,
    roughness: 0.8,
  }),
};
