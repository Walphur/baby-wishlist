// Script único para quitar el fondo blanco de los logos (flood-fill desde los bordes).
// Uso: node scripts/remove-bg.js
const sharp = require("sharp");
const path = require("path");

async function removeBackground(inputPath, outputPath, { threshold = 12, feather = 34 } = {}) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const idx = (x, y) => (y * width + x) * channels;

  const corners = [idx(0, 0), idx(width - 1, 0), idx(0, height - 1), idx(width - 1, height - 1)];
  let bgR = 0, bgG = 0, bgB = 0;
  corners.forEach((i) => {
    bgR += data[i];
    bgG += data[i + 1];
    bgB += data[i + 2];
  });
  bgR /= 4; bgG /= 4; bgB /= 4;

  function colorDist(i) {
    const dr = data[i] - bgR, dg = data[i + 1] - bgG, db = data[i + 2] - bgB;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  }

  const visited = new Uint8Array(width * height);
  const stack = [];
  function seed(x, y) {
    if (x < 0 || y < 0 || x >= width || y >= height) return;
    const p = y * width + x;
    if (visited[p]) return;
    visited[p] = 1;
    stack.push([x, y]);
  }
  for (let x = 0; x < width; x++) { seed(x, 0); seed(x, height - 1); }
  for (let y = 0; y < height; y++) { seed(0, y); seed(width - 1, y); }

  while (stack.length) {
    const [x, y] = stack.pop();
    const i = idx(x, y);
    const d = colorDist(i);
    if (d > threshold + feather) continue; // no es fondo, no propagar ni tocar
    const alpha = d <= threshold ? 0 : Math.round(255 * ((d - threshold) / feather));
    data[i + 3] = Math.min(data[i + 3], alpha);
    const neighbors = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
    for (const [nx, ny] of neighbors) {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const p = ny * width + nx;
      if (visited[p]) continue;
      visited[p] = 1;
      stack.push([nx, ny]);
    }
  }

  await sharp(data, { raw: { width, height, channels } }).png().toFile(outputPath);
  console.log(`OK: ${path.basename(outputPath)} (bg detectado ~ rgb(${bgR.toFixed(0)},${bgG.toFixed(0)},${bgB.toFixed(0)}))`);
}

(async () => {
  const dir = path.join(__dirname, "..", "public", "brand");
  await removeBackground(path.join(dir, "fox.png"), path.join(dir, "fox.png"));
  await removeBackground(path.join(dir, "bear.png"), path.join(dir, "bear.png"));
  await removeBackground(path.join(dir, "wordmark.png"), path.join(dir, "wordmark.png"));
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
