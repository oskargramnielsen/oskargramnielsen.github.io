const canvas = document.getElementById('canvas');

const ctx = canvas.getContext('2d');

// Set canvas dimensions to cover the whole page
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Offset the canvas from the top of the page by the header height
const headerHeight = document.querySelector('header').offsetHeight;
canvas.style.top = `${headerHeight}px`;

// Your animation code goes here...

// Define the size of the canvas and the size of the squares
const canvasWidth = 6000;
const canvasHeight = 4000;
const squareSize = 20;


// Calculate the number of squares needed to fill the canvas
const squaresPerRow = canvasWidth / squareSize;
const squaresPerColumn = canvasHeight / squareSize;

// Create an array to hold the colors of each square
let colors = [];

// Fill the colors array with black
for (let i = 0; i < squaresPerRow * squaresPerColumn; i++) {
  colors.push('rgb(0, 0, 0)');
}

// Draw the squares on the canvas
function draw() {
  for (let i = 0; i < squaresPerRow; i++) {
    for (let j = 0; j < squaresPerColumn; j++) {
      const color = colors[j * squaresPerRow + i];
      ctx.fillStyle = color;
      ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);
    }
  }
}

// Update the colors array with the new heatmap data
function updateHeatmapData(x, y) {
    for (let i = 0; i < squaresPerRow; i++) {
      for (let j = 0; j < squaresPerColumn; j++) {
        const distance = Math.sqrt(Math.pow(i * squareSize - x, 2) + Math.pow(j * squareSize - y, 2));
        const colorValue = Math.min(Math.round(100 - distance / 2), 100);
        const color = `rgb(${colorValue}, ${colorValue}, ${colorValue})`;
        colors[j * squaresPerRow + i] = color;
      }
    }
  }

// Add an event listener to track mouse movements
canvas.addEventListener('mousemove', (e) => {
  updateHeatmapData(e.offsetX, e.offsetY);
});

// Add an animation loop to constantly update the canvas
function animate() {
  draw();
  requestAnimationFrame(animate);
}

animate();
