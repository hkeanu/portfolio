"use client";

import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { BufferGeometry, Float32BufferAttribute, PMREMGenerator, Color, MathUtils, type Group, type Mesh, type MeshStandardMaterial } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export type SceneInput = { x: number; y: number; scroll: number };
export type Discipline = "all" | "data" | "automation" | "systems";
type Props = { playing: boolean; active: boolean; perspective: number; discipline: Discipline; immediate: boolean; input: RefObject<SceneInput>; onReady: () => void; onFailure: () => void };
const disciplines = ["data", "automation", "systems"];
const silver = new Color("#dbece5");
const mint = new Color("#91d9bd");
const dim = new Color("#455f57");

function makeRibbon() {
  const positions: number[] = [];
  const indices: number[] = [];
  const segments = 180;
  const rows = 16;
  for (let i = 0; i <= segments; i++) {
    const a = i / segments * Math.PI * 2;
    for (let j = 0; j <= rows; j++) {
      const v = j / rows * Math.PI * 2;
      // A closed, softly rounded ribbon. Rounded edges catch the studio light.
      const radius = 1.38 + .12 * Math.cos(a * 3) + Math.cos(v) * .19;
      positions.push(radius * Math.cos(a), radius * Math.sin(a), Math.sin(v) * .07 + .22 * Math.sin(a * 2));
      if (i < segments && j < rows) {
        const k = i * (rows + 1) + j;
        indices.push(k, k + 1, k + rows + 1, k + 1, k + rows + 2, k + rows + 1);
      }
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function Sculpture({ playing, active, perspective, discipline, immediate, input, onReady, onFailure }: Props) {
  const group = useRef<Group>(null);
  const phase = useRef(0);
  const reported = useRef(false);
  const { gl, scene, invalidate } = useThree();
  const geometry = useMemo(makeRibbon, []);
  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const target = pmrem.fromScene(room, .04);
    scene.environment = target.texture;
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    gl.domElement.addEventListener("webglcontextlost", lost);
    invalidate();
    return () => {
      gl.domElement.removeEventListener("webglcontextlost", lost);
      scene.environment = null;
      target.dispose(); room.dispose(); pmrem.dispose(); geometry.dispose();
    };
  }, [gl, scene, geometry, onReady, onFailure, invalidate]);
  useEffect(() => { if (active) invalidate(); }, [playing, active, perspective, discipline, immediate, invalidate]);
  useEffect(() => {
    if (!active || !playing) return;
    const requestFrame = () => invalidate();
    window.addEventListener("pointermove", requestFrame, { passive: true });
    window.addEventListener("scroll", requestFrame, { passive: true });
    return () => { window.removeEventListener("pointermove", requestFrame); window.removeEventListener("scroll", requestFrame); };
  }, [active, playing, invalidate]);
  useFrame((_, delta) => {
    if (!group.current) return;
    if (playing && active) phase.current += Math.min(delta, .05);
    const t = phase.current;
    const view = perspective === 1 ? .65 : perspective === 2 ? -.55 : 0;
    const target = [-.28 + view + input.current.y * .16 + Math.sin(t * .4) * .04,
      .35 + input.current.x * .22 + input.current.scroll * .35 + Math.sin(t * .25) * .06,
      -.24 + Math.sin(t * .3) * .025];
    // Damp toward the current target; rapid input retargets from the current
    // pose. Keyboard and reduced-motion selections resolve immediately.
    const blend = immediate ? 1 : 1 - Math.exp(-24 * Math.min(delta, .05));
    let settling = false;
    target.forEach((value, i) => {
      const axis = (["x", "y", "z"] as const)[i];
      const next = MathUtils.lerp(group.current!.rotation[axis], value, blend);
      settling ||= Math.abs(next - value) > .0005;
      group.current!.rotation[axis] = Math.abs(next - value) < .0005 ? value : next;
    });
    group.current.children.forEach((child, i) => {
      const mesh = child as Mesh<BufferGeometry, MeshStandardMaterial>;
      const selected = disciplines[i] === discipline;
      const color = discipline === "all" ? (i === 1 ? mint : silver) : selected ? mint : dim;
      mesh.material.color.lerp(color, blend);
      const scale = discipline === "all" ? 1 : selected ? 1.055 : .95;
      const next = MathUtils.lerp(mesh.scale.x, scale, blend);
      const colorDelta = Math.abs(mesh.material.color.r - color.r) + Math.abs(mesh.material.color.g - color.g) + Math.abs(mesh.material.color.b - color.b);
      settling ||= Math.abs(next - scale) > .0005 || colorDelta > .001;
      if (colorDelta <= .001) mesh.material.color.copy(color);
      mesh.scale.setScalar(Math.abs(next - scale) < .0005 ? scale : next);
    });
    group.current.position.y = Math.sin(t * .5) * .045;
    // Switch off the poster after a completed render, not just renderer setup.
    if (!reported.current) { reported.current = true; queueMicrotask(onReady); }
    if (active && (playing || settling)) invalidate();
  });
  return <group ref={group}>
    <mesh geometry={geometry} rotation={[.12, -.12, 0]}><meshStandardMaterial color="#dbece5" metalness={.94} roughness={.21} /></mesh>
    <mesh geometry={geometry} rotation={[1.12, .48, .95]}><meshStandardMaterial color="#91d9bd" metalness={.85} roughness={.25} /></mesh>
    <mesh geometry={geometry} rotation={[-.72, 1.25, -.6]}><meshStandardMaterial color="#dbece5" metalness={.94} roughness={.23} /></mesh>
  </group>;
}

export default function ConnectedScene(props: Props) {
  return <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ position: [0, 0, 6.7], fov: 38 }} gl={{ alpha: true, antialias: true, powerPreference: "low-power" }} fallback={null}>
    <ambientLight intensity={.5} />
    <directionalLight position={[3, 5, 4]} intensity={3} color="#edf9f0" />
    <directionalLight position={[-4, -1, 2]} intensity={2} color="#9ed6c0" />
    <Sculpture {...props} />
  </Canvas>;
}
