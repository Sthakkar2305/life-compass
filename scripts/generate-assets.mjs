import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { deflateSync } from "node:zlib";

const root = process.cwd();

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c >>> 0;
}

function crc32(buffers) {
  let c = 0xffffffff;
  for (const buffer of buffers) {
    for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  const crc = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  crc.writeUInt32BE(crc32([typeBuffer, data]), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function png(width, height, rgba) {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (width * 4 + 1);
    raw[rowStart] = 0;
    rgba.copy(raw, rowStart + 1, y * width * 4, (y + 1) * width * 4);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8;
  header[9] = 6;
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0))
  ]);
}

function createCanvas(width, height, base = [248, 241, 227, 255]) {
  const data = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    data[i * 4] = base[0];
    data[i * 4 + 1] = base[1];
    data[i * 4 + 2] = base[2];
    data[i * 4 + 3] = base[3];
  }
  return { width, height, data };
}

function blendPixel(canvas, x, y, color, alpha = color[3] / 255) {
  if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return;
  const index = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
  const inv = 1 - alpha;
  canvas.data[index] = Math.round(canvas.data[index] * inv + color[0] * alpha);
  canvas.data[index + 1] = Math.round(canvas.data[index + 1] * inv + color[1] * alpha);
  canvas.data[index + 2] = Math.round(canvas.data[index + 2] * inv + color[2] * alpha);
  canvas.data[index + 3] = 255;
}

function fillRect(canvas, x, y, w, h, color, alpha = color[3] / 255) {
  for (let yy = Math.floor(y); yy < y + h; yy += 1) {
    for (let xx = Math.floor(x); xx < x + w; xx += 1) blendPixel(canvas, xx, yy, color, alpha);
  }
}

function fillCircle(canvas, cx, cy, r, color, alpha = color[3] / 255) {
  const r2 = r * r;
  for (let y = Math.floor(cy - r); y <= cy + r; y += 1) {
    for (let x = Math.floor(cx - r); x <= cx + r; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      if (dx * dx + dy * dy <= r2) blendPixel(canvas, x, y, color, alpha);
    }
  }
}

function roundedRect(canvas, x, y, w, h, radius, color, alpha = color[3] / 255) {
  fillRect(canvas, x + radius, y, w - radius * 2, h, color, alpha);
  fillRect(canvas, x, y + radius, radius, h - radius * 2, color, alpha);
  fillRect(canvas, x + w - radius, y + radius, radius, h - radius * 2, color, alpha);
  fillCircle(canvas, x + radius, y + radius, radius, color, alpha);
  fillCircle(canvas, x + w - radius, y + radius, radius, color, alpha);
  fillCircle(canvas, x + radius, y + h - radius, radius, color, alpha);
  fillCircle(canvas, x + w - radius, y + h - radius, radius, color, alpha);
}

function linear(canvas, top, bottom) {
  for (let y = 0; y < canvas.height; y += 1) {
    const t = y / Math.max(1, canvas.height - 1);
    const color = [
      Math.round(top[0] * (1 - t) + bottom[0] * t),
      Math.round(top[1] * (1 - t) + bottom[1] * t),
      Math.round(top[2] * (1 - t) + bottom[2] * t),
      255
    ];
    fillRect(canvas, 0, y, canvas.width, 1, color, 1);
  }
}

function save(path, canvas) {
  const abs = join(root, path);
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, png(canvas.width, canvas.height, canvas.data));
}

function drawIcon(size) {
  const c = createCanvas(size, size, [248, 241, 227, 255]);
  linear(c, [247, 226, 181], [29, 47, 84]);
  fillCircle(c, size * 0.16, size * 0.12, size * 0.34, [245, 158, 11, 255], 0.32);
  fillCircle(c, size * 0.86, size * 0.92, size * 0.38, [37, 99, 235, 255], 0.42);
  roundedRect(c, size * 0.2, size * 0.16, size * 0.6, size * 0.7, size * 0.1, [83, 42, 22, 255], 0.98);
  fillRect(c, size * 0.24, size * 0.16, size * 0.045, size * 0.7, [20, 15, 17, 255], 0.34);
  roundedRect(c, size * 0.32, size * 0.24, size * 0.38, size * 0.48, size * 0.05, [255, 250, 238, 255], 0.96);
  fillRect(c, size * 0.38, size * 0.36, size * 0.25, size * 0.018, [37, 99, 235, 255], 0.72);
  fillRect(c, size * 0.38, size * 0.44, size * 0.2, size * 0.018, [245, 158, 11, 255], 0.78);
  fillRect(c, size * 0.38, size * 0.52, size * 0.25, size * 0.018, [34, 197, 94, 255], 0.72);
  fillCircle(c, size * 0.64, size * 0.66, size * 0.055, [245, 158, 11, 255], 0.95);
  return c;
}

function drawScreenshot(width, height) {
  const c = createCanvas(width, height, [248, 241, 227, 255]);
  linear(c, [250, 242, 225], [230, 239, 255]);
  fillCircle(c, width * 0.14, height * 0.16, Math.min(width, height) * 0.23, [245, 158, 11, 255], 0.18);
  fillCircle(c, width * 0.88, height * 0.18, Math.min(width, height) * 0.25, [37, 99, 235, 255], 0.14);
  roundedRect(c, width * 0.08, height * 0.1, width * 0.84, height * 0.78, 28, [255, 255, 255, 255], 0.62);
  roundedRect(c, width * 0.13, height * 0.18, width * 0.26, height * 0.5, 24, [83, 42, 22, 255], 0.93);
  roundedRect(c, width * 0.18, height * 0.25, width * 0.16, height * 0.3, 12, [255, 250, 238, 255], 0.94);
  const cardW = width > 700 ? width * 0.13 : width * 0.3;
  const gap = width > 700 ? width * 0.025 : width * 0.035;
  const startX = width > 700 ? width * 0.45 : width * 0.11;
  const y = width > 700 ? height * 0.28 : height * 0.52;
  const colors = [
    [37, 99, 235, 255],
    [34, 197, 94, 255],
    [245, 158, 11, 255],
    [168, 85, 247, 255],
    [236, 72, 153, 255]
  ];
  for (let i = 0; i < 5; i += 1) {
    const x = width > 700 ? startX + i * (cardW + gap) : startX + (i % 2) * (cardW + gap);
    const yy = width > 700 ? y : y + Math.floor(i / 2) * (height * 0.13);
    roundedRect(c, x, yy, cardW, height * 0.16, 18, colors[i], 0.86);
    fillCircle(c, x + cardW * 0.24, yy + height * 0.05, Math.min(width, height) * 0.022, [255, 255, 255, 255], 0.9);
  }
  return c;
}

for (const size of [72, 96, 128, 192, 384, 512]) save(`public/icons/icon-${size}.png`, drawIcon(size));
save("public/icons/apple-touch-icon.png", drawIcon(180));
save("public/screenshots/home-wide.png", drawScreenshot(1280, 720));
save("public/screenshots/home-mobile.png", drawScreenshot(390, 844));

console.log("Generated PWA icons and screenshots.");
