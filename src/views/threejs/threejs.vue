<template>
  <div id="gridContainer" ref="gridContainer"></div>
</template>
<script lang="ts">
import { onMounted, ref } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default {
  setup() {
    // 场景
    const scene: THREE.Scene = new THREE.Scene();
    // 立方体
    var geometry: THREE.BoxGeometry = new THREE.BoxGeometry(100, 100, 100);
    // 材质
    const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true })
    const mesh: THREE.Mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh);
    // 相机
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(200, 300, 200);
    camera.lookAt(scene.position);
    // 渲染
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight - 64)
    renderer.render(scene, camera);
    // 控制器
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.addEventListener('change', render)
    function render() {
      renderer.render(scene, camera)
    }
    onMounted(() => document.getElementById("gridContainer")!.appendChild(renderer.domElement))
    return {};
  },
};
</script>
<style lang="less" scoped>
#gridContainer {
  height: 100%;
}
</style>