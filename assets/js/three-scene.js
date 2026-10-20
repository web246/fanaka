export async function initHeroScene() {
  const canvas = document.querySelector("[data-hero-canvas]");
  if (!canvas) return;

  try {
    const THREE = await import(
      "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js"
    );
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      innerWidth / innerHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 10);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setSize(innerWidth, innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    scene.add(new THREE.AmbientLight(0xffffff, 1.8));
    const keyLight = new THREE.PointLight(0xe0be6a, 38, 24);
    keyLight.position.set(2, 3, 5);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x12805f, 24, 22);
    rimLight.position.set(-4, -2, 1);
    scene.add(rimLight);

    const emblem = new THREE.Group();
    emblem.position.set(2.7, -0.05, 0);
    emblem.rotation.set(-0.08, -0.22, -0.1);
    scene.add(emblem);

    const gold = new THREE.MeshStandardMaterial({
      color: 0xd9b45c,
      metalness: 0.82,
      roughness: 0.24,
      emissive: 0x3c2608,
      emissiveIntensity: 0.26,
    });
    const paleGold = new THREE.MeshStandardMaterial({
      color: 0xf0d58c,
      metalness: 0.78,
      roughness: 0.2,
    });

    const monogram = new THREE.Shape();
    monogram.moveTo(-0.58, 1.02);
    monogram.lineTo(0.64, 1.02);
    monogram.lineTo(0.64, 0.68);
    monogram.lineTo(-0.17, 0.68);
    monogram.lineTo(-0.17, 0.16);
    monogram.lineTo(0.48, 0.16);
    monogram.lineTo(0.48, -0.18);
    monogram.lineTo(-0.17, -0.18);
    monogram.lineTo(-0.17, -1.02);
    monogram.lineTo(-0.58, -1.02);
    monogram.closePath();
    const letter = new THREE.Mesh(
      new THREE.ExtrudeGeometry(monogram, {
        depth: 0.22,
        bevelEnabled: true,
        bevelSegments: 3,
        steps: 1,
        bevelSize: 0.045,
        bevelThickness: 0.045,
      }),
      gold,
    );
    letter.position.z = 0.12;
    emblem.add(letter);

    const crestShape = new THREE.Shape();
    crestShape.moveTo(0, 2.15);
    crestShape.quadraticCurveTo(1.05, 1.7, 1.78, 1.35);
    crestShape.lineTo(1.62, -0.15);
    crestShape.quadraticCurveTo(1.38, -1.45, 0, -2.12);
    crestShape.quadraticCurveTo(-1.38, -1.45, -1.62, -0.15);
    crestShape.lineTo(-1.78, 1.35);
    crestShape.quadraticCurveTo(-1.05, 1.7, 0, 2.15);
    const crestPoints = crestShape.getPoints(72);
    const crestGeometry = new THREE.BufferGeometry().setFromPoints(
      crestPoints.map((point) => new THREE.Vector3(point.x, point.y, 0)),
    );
    const crest = new THREE.LineLoop(
      crestGeometry,
      new THREE.LineBasicMaterial({
        color: 0xe0be6a,
        transparent: true,
        opacity: 0.72,
      }),
    );
    crest.scale.setScalar(0.92);
    emblem.add(crest);

    const orbit = new THREE.Group();
    emblem.add(orbit);
    [2.25, 2.6].forEach((radius, index) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(radius, index === 0 ? 0.012 : 0.007, 8, 128),
        index === 0 ? paleGold : gold,
      );
      ring.rotation.set(0.72 + index * 0.32, 0.3, index * 0.55);
      orbit.add(ring);
    });

    const jewel = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.18, 1),
      paleGold,
    );
    jewel.position.set(1.95, 1.1, 0.6);
    emblem.add(jewel);

    const points = 260;
    const positions = new Float32Array(points * 3);
    for (let i = 0; i < points; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xe0be6a,
      size: 0.028,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    let active = !document.hidden;
    let paused = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let targetX = 0;
    let targetY = 0;
    const visibility = new IntersectionObserver(([entry]) => {
      active = entry.isIntersecting;
      if (active && !paused) requestAnimationFrame(render);
    });
    visibility.observe(canvas);

    window.addEventListener(
      "pointermove",
      (event) => {
        targetX = (event.clientX / innerWidth - 0.5) * 0.12;
        targetY = (event.clientY / innerHeight - 0.5) * 0.08;
      },
      { passive: true },
    );

    document.addEventListener("visibilitychange", () => {
      active = !document.hidden;
      if (active && !paused) requestAnimationFrame(render);
    });
    matchMedia("(prefers-reduced-motion: reduce)").addEventListener?.(
      "change",
      (event) => {
        paused = event.matches;
        if (!paused) requestAnimationFrame(render);
        else renderer.render(scene, camera);
      },
    );

    const render = () => {
      if (active) {
        if (!paused) {
          emblem.rotation.y += (targetX - emblem.rotation.y) * 0.035;
          emblem.rotation.x += (-targetY - emblem.rotation.x) * 0.035;
          orbit.rotation.z += 0.0018;
          orbit.rotation.y += 0.0007;
          jewel.rotation.y += 0.008;
          particles.rotation.y += 0.00018;
        }
        renderer.render(scene, camera);
      }
      if (active && !paused) requestAnimationFrame(render);
    };
    if (active) render();
    window.addEventListener(
      "resize",
      () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
      },
      { passive: true },
    );
  } catch {
    /* WebGL or the optional CDN may be unavailable; the poster design remains complete. */
  }
}
