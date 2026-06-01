import fs from "fs";
import { PNG } from "pngjs";

const png = PNG.sync.read(fs.readFileSync("public/avatars/aviatorv1.png"));
const W = png.width;
const H = png.height;

function bbox(x0, x1, y0, y1, filter) {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  let c = 0;
  let rs = 0;
  let gs = 0;
  let bs = 0;
  for (let y = Math.floor(H * y0); y < Math.floor(H * y1); y++) {
    for (let x = Math.floor(W * x0); x < Math.floor(W * x1); x++) {
      const i = (W * y + x) * 4;
      const r = png.data[i];
      const g = png.data[i + 1];
      const b = png.data[i + 2];
      const a = png.data[i + 3];
      if (a < 180 || !filter(r, g, b, x, y)) continue;
      c++;
      rs += r;
      gs += g;
      bs += b;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (!c) return null;
  const norm = (v) => Math.round((v / (v === minX || v === maxX ? W : H)) * 10000) / 10000;
  const scale = (v) => Math.round(v * (500 / W) * 10) / 10;
  return {
    c,
    cx: scale((minX + maxX) / 2),
    cy: scale((minY + maxY) / 2),
    w: scale(maxX - minX),
    h: scale(maxY - minY),
    minX: scale(minX),
    maxX: scale(maxX),
    minY: scale(minY),
    maxY: scale(maxY),
    rx: norm((minX + maxX) / 2),
    ry: norm((minY + maxY) / 2),
    rw: norm(maxX - minX),
    rh: norm(maxY - minY),
    avg: `rgb(${Math.round(rs / c)},${Math.round(gs / c)},${Math.round(bs / c)})`,
  };
}

const subject = (() => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (W * y + x) * 4;
      const r = png.data[i];
      const g = png.data[i + 1];
      const b = png.data[i + 2];
      if (r + g + b < 40) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  return { minX, minY, maxX, maxY, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2 };
})();

console.log("Image", W, "x", H);
console.log("Subject center px", subject.cx, subject.cy);

const features = {
  leftSclera: bbox(0.31, 0.44, 0.365, 0.415, (r, g, b) => r > 185 && g > 175 && b > 165 && r - b < 35),
  rightSclera: bbox(0.56, 0.69, 0.365, 0.415, (r, g, b) => r > 185 && g > 175 && b > 165 && r - b < 35),
  leftIris: bbox(0.34, 0.42, 0.375, 0.405, (r, g, b) => r < 95 && g < 72 && b < 58 && r > 35),
  rightIris: bbox(0.58, 0.66, 0.375, 0.405, (r, g, b) => r < 95 && g < 72 && b < 58 && r > 35),
  teeth: bbox(0.34, 0.66, 0.505, 0.545, (r, g, b) => r > 218 && g > 212 && b > 205),
  upperLip: bbox(0.34, 0.66, 0.475, 0.515, (r, g, b) => r > 110 && r > g * 1.05 && g < 175 && b < 160),
  lowerLip: bbox(0.34, 0.66, 0.535, 0.585, (r, g, b) => r > 100 && r > g * 1.03 && g < 180),
  mustache: bbox(0.32, 0.68, 0.435, 0.505, (r, g, b) => r < 95 && g < 75 && b < 70 && r > 15),
  mouthDark: bbox(0.34, 0.66, 0.495, 0.545, (r, g, b) => r < 70 && g < 55 && b < 50),
  cheekSkin: bbox(0.38, 0.62, 0.42, 0.47, (r, g, b) => r > 140 && r > g && g > 80 && b < 130),
};

console.log(JSON.stringify(features, null, 2));

if (features.leftIris && features.rightIris) {
  console.log("\nEYE_L", {
    cx: features.leftIris.cx,
    cy: features.leftIris.cy,
    w: features.leftIris.w * 1.15,
    h: features.leftIris.h * 1.35,
  });
  console.log("EYE_R", {
    cx: features.rightIris.cx,
    cy: features.rightIris.cy,
    w: features.rightIris.w * 1.15,
    h: features.rightIris.h * 1.35,
  });
}

if (features.teeth && features.lowerLip) {
  const pad = 8;
  const cover = {
    minX: Math.min(features.mustache?.minX ?? 999, features.upperLip?.minX ?? 999, features.teeth.minX) - pad,
    maxX: Math.max(features.mustache?.maxX ?? 0, features.lowerLip.maxX, features.teeth.maxX) + pad,
    minY: Math.min(features.mustache?.minY ?? 999, features.upperLip?.minY ?? 999) - pad,
    maxY: Math.max(features.lowerLip.maxY, features.teeth.maxY) + pad,
  };
  cover.cx = Math.round(((cover.minX + cover.maxX) / 2) * 10) / 10;
  cover.cy = Math.round(((cover.minY + cover.maxY) / 2) * 10) / 10;
  console.log("\nMOUTH", {
    cx: features.teeth.cx,
    cy: features.mouthDark?.cy ?? features.teeth.cy,
    w: cover.maxX - cover.minX,
    teethW: features.teeth.w,
    cover,
  });
}
