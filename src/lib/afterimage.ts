const turn = 2 * Math.PI;
const highlight = "#96b9ea";
const midtone = "#415f87";
const shadow = "#090e19";

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

function noise(seed: number) {
  const value = Math.sin(seed * 84.234 + 17.17) * 43758.5453;
  return value - Math.floor(value);
}

function metallic(light: number) {
  if (light < .15) return shadow;
  if (light > .88) return highlight;
  const t = clamp((light - .15) / .73);
  const blend = t * t * (3 - 2 * t);
  const channels = [65, 95, 135].map((base, i) =>
    Math.round(base + blend * ([150, 185, 234][i] - base))
  );
  return `rgb(${channels.join(",")})`;
}

export function drawAfterimage(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  progress: number,
) {
  const size = Math.min(width, height);
  const centerX = width * .515;
  const centerY = height * (width < 480 && height < 300 ? .49 : .475);
  const scale = size * .145;
  const phase = turn * progress;
  const sweep = Math.sin(phase);
  const roll = -.28 + .23 * sweep;
  const pitch = -.435 + .22 * Math.sin(phase + .3);
  const yaw = .27 + .18 * (1 - Math.cos(phase));

  context.clearRect(0, 0, width, height);
  const glow = context.createRadialGradient(centerX + sweep * scale * .33, centerY, 0, centerX, centerY, size * .57);
  glow.addColorStop(0, midtone + "3d");
  glow.addColorStop(.56, midtone + "14");
  glow.addColorStop(1, midtone + "00");
  context.fillStyle = glow;
  context.fillRect(0, 0, width, height);

  context.fillStyle = highlight;
  for (let i = 0; i < 990; i++) {
    const x = noise(i * 3) * width;
    const y = noise(i * 3 + 1) * height;
    const distance = Math.hypot((x - centerX) / width, (y - centerY) / height);
    const grain = noise(i * 3 + 2);
    context.globalAlpha = clamp((.61 - distance) * .54) * grain;
    context.fillRect(x, y, grain < .98 ? 1 : 2, 1);
  }
  context.globalAlpha = 1;

  context.save();
  context.strokeStyle = highlight + "28";
  context.lineWidth = .7;
  context.beginPath();
  context.ellipse(centerX, centerY, size * .433, size * .408, -.22, 0, turn);
  context.stroke();
  context.setLineDash([1, 6]);
  context.beginPath();
  context.ellipse(centerX, centerY, size * .469, size * .446, -.22, 0, turn);
  context.stroke();
  context.setLineDash([]);
  for (const side of [-1, 1]) {
    const x = centerX + side * size * .469;
    context.beginPath();
    context.moveTo(x - 4, centerY);
    context.lineTo(x + 4, centerY);
    context.moveTo(x, centerY - 4);
    context.lineTo(x, centerY + 4);
    context.stroke();
  }
  context.restore();

  const cosYaw = Math.cos(yaw);
  const sinYaw = Math.sin(yaw);
  const cosPitch = Math.cos(pitch);
  const sinPitch = Math.sin(pitch);
  const cosRoll = Math.cos(roll);
  const sinRoll = Math.sin(roll);

  // Project the transverse strands of a twisted ribbon and paint the farthest ones first.
  const bands = Array.from({ length: 148 }, (_, i) => {
    const angle = i / 148 * turn;
    const twist = angle * 2.5 + .35 * sweep;
    const radius = 2.13 + .31 * Math.cos(angle * 3 + .25);
    const wave = .53 * Math.sin(angle * 3 + .45);
    let depthSum = 0;
    const points = Array.from({ length: 33 }, (_, j) => {
      const distance = (j / 32 - .5) * 1.95;
      const ring = radius + distance * Math.cos(twist) * .80;
      const x = ring * Math.cos(angle) + .29 * Math.cos(angle * 2);
      const y = ring * Math.sin(angle) + .18 * Math.cos(angle * 3);
      const z = distance * Math.sin(twist) + wave;
      const rotatedX = x * cosYaw - z * sinYaw;
      const rotatedZ = z * cosYaw + x * sinYaw;
      const rotatedY = y * cosPitch - rotatedZ * sinPitch;
      const depth = rotatedZ * cosPitch + y * sinPitch;
      const perspective = scale / (1 + depth * .118);
      depthSum += depth;
      return {
        x: centerX + (rotatedX * cosRoll - rotatedY * sinRoll) * perspective,
        y: centerY + (rotatedY * cosRoll + rotatedX * sinRoll) * perspective,
      };
    });
    return { points, depth: depthSum / points.length, angle };
  });

  context.lineCap = "round";
  for (const { points, depth, angle } of bands.sort((a, b) => b.depth - a.depth)) {
    const first = points[0];
    const last = points[points.length - 1];
    const light = .5 + .32 * Math.sin(angle * 2.5 + .72 + sweep) - depth * .09;
    const gradient = context.createLinearGradient(first.x, first.y, last.x, last.y);
    gradient.addColorStop(0, metallic(light - .34));
    gradient.addColorStop(.23, metallic(light - .12));
    gradient.addColorStop(.52, metallic(light + .21));
    gradient.addColorStop(.74, metallic(light + .42));
    gradient.addColorStop(1, metallic(light - .067));
    context.beginPath();
    context.moveTo(first.x, first.y);
    for (let i = 1; i < points.length; i++) context.lineTo(points[i].x, points[i].y);
    context.strokeStyle = shadow + "b5";
    context.lineWidth = Math.max(1.9, size * .0062);
    context.stroke();
    context.strokeStyle = gradient;
    context.lineWidth = Math.max(.68, size * .00225);
    context.stroke();

    if (Math.sin(angle * 16) > .9) {
      context.beginPath();
      context.arc(last.x, last.y, size * .002, 0, turn);
      context.fillStyle = highlight + "a5";
      context.fill();
    }
  }
}
