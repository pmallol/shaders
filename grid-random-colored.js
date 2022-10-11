const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [2048, 2048],
};

const sketch = () => {
  //local state

  const palette = random.pick(palettes);
  // console.log(palette);

  const createGrid = () => {
    const points = [];
    const count = 10;

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        //uv space between 0 and 1
        //top left 0 | bottom right 1
        //guard for dividing by 0
        const u = count <= 1 ? 0.5 : x / (count - 1);
        const v = count <= 1 ? 0.5 : y / (count - 1);

        points.push({
          //make it gaussian
          // radius: Math.abs(random.gaussian() * 0.01),
          radius: Math.abs(0.01 + random.gaussian() * 0.01),
          position: [u, v],
          color: random.pick(palette)
        });
      }
    }
    return points;
  };

  //set deterministic seed for both physical and virtual example stays the same
  random.setSeed(512);
  const points = createGrid().filter(() => random.value() > 0.2);
  // console.log(points);
  const margin = 300;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      const {
        position,
        radius,
        color
      } = data;
      const [u, v] = position;

      //scale each point to pixel space
      //interpolate to somewhere close to left/right/top/bottom
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.beginPath();
      //radius relative to width of page
      context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      context.fillStyle = color;
      context.fill();
    });
  };
};

canvasSketch(sketch, settings);
