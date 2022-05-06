<template>
  <div id="container" ref="container"></div>
</template>
<script lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import * as THREE from "three";
import Stats from 'three/examples/jsm/libs/stats.module';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
export default {
  setup() {
    const container = ref<HTMLDivElement>();
    // 场景
    const scene: THREE.Scene = new THREE.Scene();
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);
    // 光源
    var light = new THREE.AmbientLight();
    light.position.set(25, 25, 25);
    scene.add(light);
    // 相机
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / (window.innerHeight - 64),
      0.1,
      1000
    );
    camera.position.z = 2;
    camera.position.x = -0.5;
    camera.position.y = 0.5;
    // 渲染
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize(window.innerWidth, window.innerHeight - 64)
    // 控制器
    const controls: OrbitControls = new OrbitControls(camera, renderer.domElement)
    // 模型
    const loader: GLTFLoader = new GLTFLoader();
    loader.load(
      `/models/vintage_camera/scene.gltf`,
      function (gltf) {
        scene.add(gltf.scene);
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      (error) => {
        console.log(error);
      }
    );
    // 监控
    const stats = Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '5px';
    stats.domElement.style.left = '5px';
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      stats.update();
      render();
    };
    const render = () => renderer.render(scene, camera);
    // resize
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      render();
    }
    window.addEventListener('resize', onWindowResize);
    onMounted(() => {
      container.value!.appendChild(renderer.domElement);
      container.value!.appendChild(stats.dom);
      animate();
    })
    onUnmounted(() => {
      stats.end();
      renderer.clear();
      scene.clear();
      window.removeEventListener('resize', onWindowResize);
    })
    return {
      container,
    };
  },
};
</script>
<style lang="less" scoped>
#container {
  height: 100%;
}
</style>