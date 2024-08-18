// Function to sleep for a specified time
const sleep = (time) => {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

// Class for typing animation
class TypeAsync extends HTMLSpanElement {
  get typeInterval() {
    const randomMs = 100 * Math.random();
    return randomMs < 50 ? 10 : randomMs;
  }

  async type(text) {
    for (let character of text) {
      this.innerText += character;
      await sleep(this.typeInterval);
    }
  }

  async delete(text) {
    for (let character of text) {
      this.innerText = this.innerText.slice(0, this.innerText.length - 1);
      await sleep(this.typeInterval);
    }
  }
}

// Initialize the typing animation and dropdown functionality
async function init() {
  const node = document.querySelector("#type-text");
  const header = document.querySelector("header");
  const menuToggle = document.querySelector('.menu-toggle');
  const menuItems = document.querySelector('.menu-items');

  // Initially hide the header and move it upwards
  header.style.opacity = "0";
  header.style.transform = "translate(0px, -150px)";

  await sleep(1000); // Wait for 1 second

  node.innerText = ""; // Clear the text

  for await (const _ of (async function* () {
    while (true) yield null; // Infinite loop for animation
  })()) {
    await node.type('Hi. I’m Oskar.');
    await sleep(700);
    await node.delete('Hi. I’m Oskar.');
    await node.type('An architectural engineer.');
    await sleep(700);
    await node.delete('An architectural engineer.');
    await node.type('Welcome to my website.');

    // Make the header visible and move it to its original position
    header.style.opacity = "1";
    header.style.transform = "translate(0px, 0px)";
    header.style.transition = "all 1.7s ease";

    await sleep(1000); // Wait for 5 seconds
    await node.delete('Welcome to my website.');
    
    await sleep(100); // Wait for 2 seconds
    
    // Redirect to info.html after deleting the text
    window.location.href = 'info.html';
  }

  // Dropdown functionality
  menuToggle.addEventListener('click', () => {
    menuItems.classList.toggle('show'); // Toggle the 'show' class
  });
}

// Custom element definition
customElements.define("type-async", TypeAsync, { extends: "span" });

// Start the animation when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
