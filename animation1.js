async function init() {

  const node = document.querySelector("#type-text");
  const header = document.querySelector("header");
  header.style.opacity = "0";
  header.style.transform = "translate(0px, -150px)";

  // await new Promise(resolve => setTimeout(resolve, 1000));

  node.innerText = "";

  while (true) {
    // await node.type('Hi. I’m Oskar.');
    // await sleep(700);
    // await node.delete('Hi. I’m Oskar.');
    // await node.type('An architectural engineer.');
    // await sleep(700);
    // await node.delete('An architectural engineer.');
    // await node.type('Welcome to my website. ');
    
    header.style.opacity = "1";
    header.style.transform = "translate(0px, 0px)";
    header.style.transition = "all 1.7s ease";

    await sleep(5000);
    await node.delete('Welcome to my website. ');
    await sleep(2000);
  }
}

const sleep = (time) => {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

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

customElements.define("type-async", TypeAsync, { extends: "span" });

init();
