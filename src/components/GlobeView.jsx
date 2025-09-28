import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import floatsJSON from '../floatdetails.json';

const GlobeView = () => {
  const mountRef = useRef(null);
  const [floatsData, setFloatsData] = useState([]);
  const [autoRotate, setAutoRotate] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Load JSON data
  useEffect(() => {
    setFloatsData(floatsJSON);
  }, []);

  // Search functionality (not affecting 3D rendering for now)
  const filteredFloats = floatsData.filter(float =>
    float.PLATFORM_NUMBER.toString().includes(searchTerm) ||
    float.PROJECT_NAME?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    float.PI_NAME?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Three.js globe setup
  useEffect(() => {
    if (floatsData.length === 0) return;

    const mount = mountRef.current;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 30);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);

    // Earth sphere
    const earthGeometry = new THREE.SphereGeometry(9, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load(
        'https://cdn.jsdelivr.net/npm/three-globe/example/img/earth-blue-marble.jpg'
      ),
      specular: new THREE.Color(0x333333),
      shininess: 5
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Float markers as children of Earth
    floatsData.forEach(data => {
      const { LATITUDE, LONGITUDE } = data;
      const phi = (90 - LATITUDE) * (Math.PI / 180);
      const theta = (LONGITUDE + 180) * (Math.PI / 180);
      const radius = 9.0; // slightly above sphere
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);

      const markerGeometry = new THREE.SphereGeometry(0.12, 16, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff6b6b });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.set(x, y, z);
      marker.userData = { floatData: data };

      earth.add(marker); // <-- attach to Earth
    });

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.minDistance = 12;
    controls.maxDistance = 60;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.5;

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);
      if (autoRotate) earth.rotation.y += 0.0005;
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      const newWidth = mount.clientWidth;
      const newHeight = mount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [floatsData, autoRotate]);

  // Export JSON
  const exportData = () => {
    const dataStr = JSON.stringify(floatsData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', 'argo_floats_data.json');
    linkElement.click();
  };

  return (
    <div className="flex flex-col h-screen text-white bg-black">
      <div className="py-4 flex justify-center">
        <h1 className="text-3xl font-extrabold tracking-wide text-white text-center">OCEAN GLOBAL VIEW</h1>
      </div>
      <div className="flex-1">
        <div ref={mountRef} style={{ width: '100%', height: '70vh' }} />
        <div className="p-4">
          <input
            type="text"
            placeholder="Search floats..."
            className="w-full p-2 bg-gray-900 border border-gray-700 rounded text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={exportData}
            className="mt-2 px-3 py-1 rounded bg-gray-900 border border-gray-700 text-gray-300"
          >
            Export JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobeView;