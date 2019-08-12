// Initial Setup
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

// EventListeners
addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});

// Utillities
function distance(x1, y1, x2, y2) { return Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2)) }

let time = 0;

let perspPar = 1.015;
let firstRowLength = 400;
let firstRowDistVanPoint = 150;
let perspRatio = firstRowDistVanPoint / firstRowLength;

let distCircles = 12;
let sizeCircles = 1

let border = 50;

let xNumCircles = 60;
let yNumCircles = 60;

// let yNumCircles = innerHeight / distCircles - border * 2 / distCircles;
// let xNumCircles = innerWidth / distCircles - border * 2 / distCircles;

let xPosTriggers = [19, 39];
let yPosTriggers = [19, 19];

let amplMax = 11 / xPosTriggers.length;
let period = 0.5;
let waveLength = distCircles * 10;
let wavePropag = waveLength / period;

// Objects
function circle(x, y, r, type) {
  c.beginPath();

  if (type == 'regular') { c.fillStyle = '#009aaa';  c.arc(x, y, r, 0, 2 * Math.PI, true); }
  if (type == 'trigger') { c.fillStyle = '#ff4d4d';  c.arc(x, y, r * 2, 0, 2 * Math.PI, true); }
  if (type == 'edge') { c.fillStyle = '#ffa64d';  c.arc(x, y, r, 0, 2 * Math.PI, true); }

  c.fill();
  c.closePath();
}

// Animation Loop
function animate() {

  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  c.fillStyle = '#181c17';
  c.fillRect(0, 0, canvas.width, canvas.height);

  for (y = 0; y < yNumCircles; y++) {

    let yDistVanPoint = firstRowDistVanPoint * Math.pow(perspPar, y);               //hier
    let rowLength = yDistVanPoint / perspRatio;
    let xPerspDist = rowLength / xNumCircles;

    for (x = 0; x < xNumCircles; x++) {
      let type = 'regular';
      let ampl = 0;

      for (i = 0; i < xPosTriggers.length; i++) {
        let dist = distance(distCircles * x, distCircles * y, distCircles * xPosTriggers[i], distCircles * yPosTriggers[i]);
        if (dist == 0) { type = 'trigger'; }
        if (time * wavePropag >= dist) { ampl += amplMax * Math.sin(2 * Math.PI * (time / period - dist / waveLength)); }
      }

      if (x == 0 || x == (xNumCircles - 1) || y == 0 || y == (yNumCircles - 1)) {
        type = 'edge';
      }

      if (type == 'trigger') {
        ampl = amplMax * Math.sin(2 * Math.PI * (time / period - 0 / waveLength));
      }

      circle((canvas.width - xPerspDist * xNumCircles) / 2 + xPerspDist * x, border + yDistVanPoint + ampl * Math.pow(perspPar, y), sizeCircles * Math.pow(perspPar, y), type);
    }
  }

  time += 0.01;
}

animate();
