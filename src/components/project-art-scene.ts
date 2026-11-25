import { CircleGeometry, DoubleSide, Mesh, MeshBasicMaterial, OrthographicCamera, RingGeometry, Scene, WebGLRenderer } from "three";

// Sample the actual SVG paths so the signals and the original artwork cannot drift apart.
export function createProjectArtScene(host: HTMLDivElement, active: () => boolean) {
  const svg = host.parentElement!.querySelector("svg")!;
  const renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setClearColor(0, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  const camera = new OrthographicCamera(0, 560, 0, 280, .1, 10);
  camera.position.z = 5;
  const scene = new Scene();
  const dotGeometry = new CircleGeometry(3, 16);
  const ringGeometry = new RingGeometry(6, 7, 32);
  const material = () => new MeshBasicMaterial({ color: "#d0f3dd", side: DoubleSide, transparent: true, depthWrite: false, toneMapped: false });
  const paths = Array.from(svg.querySelectorAll<SVGPathElement>("[data-flow]"));
  const signals = paths.map((path, i) => {
    const length = path.getTotalLength();
    const samples = Array.from({ length: 241 }, (_, j) => path.getPointAtLength(j / 240 * length));
    const dot = new Mesh(dotGeometry, material());
    const trail = Array.from({ length: 8 }, () => new Mesh(dotGeometry, material()));
    scene.add(...trail, dot);
    return { dot, trail, samples, duration: Number(path.dataset.flow) || 4, offset: i * .37 };
  });
  const pulses = Array.from(svg.querySelectorAll<SVGCircleElement>("[data-pulse]")).map((node, i) => {
    const ring = new Mesh(ringGeometry, material());
    ring.position.set(node.cx.baseVal.value, node.cy.baseVal.value, .1);
    scene.add(ring);
    return { ring, offset: i * .27 };
  });
  let frame = 0;
  let elapsed = 0;
  let previous = 0;
  let disposed = false;
  let lost = false;
  const update = () => {
    signals.forEach(({ dot, trail, samples, duration, offset }) => {
      const progress = (elapsed / duration + offset) % 1;
      [dot, ...trail].forEach((mesh, i) => {
        const t = progress - i * .009;
        mesh.visible = t >= 0;
        const sample = Math.max(0, t) * 240;
        const index = Math.min(239, Math.floor(sample));
        const a = samples[index], b = samples[index + 1];
        mesh.position.set(a.x + (b.x - a.x) * (sample - index), a.y + (b.y - a.y) * (sample - index), .2);
        mesh.scale.setScalar(i === 0 ? 1 : 1 - i * .075);
        mesh.material.opacity = i === 0 ? .95 : .3 * (1 - i / 9);
      });
    });
    pulses.forEach(({ ring, offset }) => {
      const phase = (elapsed / 2.8 + offset) % 1;
      ring.scale.setScalar(1 + phase * 2);
      ring.material.opacity = .45 * (1 - phase) ** 2;
    });
  };
  const render = (now: number) => {
    frame = 0;
    if (disposed || lost || !active()) { previous = 0; return; }
    if (previous) elapsed += Math.min((now - previous) / 1000, .05);
    previous = now;
    update();
    renderer.render(scene, camera);
    frame = requestAnimationFrame(render);
  };
  const sync = () => {
    if (disposed || lost) return;
    if (active()) { if (!frame) { previous = 0; frame = requestAnimationFrame(render); } }
    else { cancelAnimationFrame(frame); frame = 0; previous = 0; }
  };
  const resize = () => {
    const width = host.clientWidth, height = host.clientHeight;
    if (!width || !height || disposed || lost) return;
    renderer.setSize(width, height);
    // Match SVG's default xMidYMid meet, including its mobile max-height.
    const scale = Math.min(width / 560, height / 280);
    const w = width / scale, h = height / scale;
    camera.left = (560 - w) / 2; camera.right = (560 + w) / 2;
    camera.top = (280 - h) / 2; camera.bottom = (280 + h) / 2;
    camera.updateProjectionMatrix();
    update();
    renderer.render(scene, camera);
  };
  const contextLost = (event: Event) => {
    event.preventDefault(); lost = true;
    cancelAnimationFrame(frame); frame = 0;
    renderer.domElement.style.visibility = "hidden";
  };
  renderer.domElement.addEventListener("webglcontextlost", contextLost);
  host.appendChild(renderer.domElement);
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize(); sync();
  return { sync, dispose: () => {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    renderer.domElement.removeEventListener("webglcontextlost", contextLost);
    scene.traverse(object => { if (object instanceof Mesh) (object.material as MeshBasicMaterial).dispose(); });
    dotGeometry.dispose(); ringGeometry.dispose();
    renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove();
  } };
}
