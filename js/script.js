let barstate = ''
let speed = 250
const previewText = document.getElementById('previewText');
const textColorIndicator = document.getElementById('textColorIndicator');
const bgColorIndicator = document.getElementById('bgColorIndicator');
const flashToggle = document.getElementById('flashToggle');
const thebackground = document.querySelectorAll('.background')
const textcolor = document.querySelectorAll('.textcolor')
const FontIndicator = document.querySelector('.font')
const TextColorSelector = document.querySelector('#textColorPicker')
const BgColorSelector = document.querySelector('#bgColorPicker')
let flashInterval

document.addEventListener('DOMContentLoaded', () => {
  let speed = 250
  if (!localStorage.getItem('background')) {
    localStorage.setItem('background', 'black');
  }
  if (!localStorage.getItem('textcolor')) {
    localStorage.setItem('textcolor', 'white');
  }
  if (!localStorage.getItem('font')) {
    localStorage.setItem('font', 'HelveticaNeue-Medium');
  }
  SetVars();

  const inputText = document.getElementById('inputtext');
  const textElement = document.querySelector('.text');
  const textarea = document.querySelector('text-area')
  FontIndicator.addEventListener('click', () => { ChangeVars(localStorage.getItem("textcolor"), localStorage.getItem("background"), prompt("CSS Font")) });
  inputText.addEventListener('input', () => { textElement.textContent = inputText.value; });
  TextColorSelector.addEventListener('input', function (event) {
    ChangeVars(event.target.value, localStorage.getItem("background"), localStorage.getItem("font"))
  });
  BgColorSelector.addEventListener('input', function (event) {
    ChangeVars(localStorage.getItem("textcolor"), event.target.value, localStorage.getItem("font"))
  });
});

function SetVars() {
  thebackground.forEach(el => el.style.backgroundColor = localStorage.getItem("background"));
  textcolor.forEach(el => el.style.color = localStorage.getItem("textcolor"));
  textcolor.forEach(el => el.style.fontFamily = localStorage.getItem("font"));
  textColorIndicator.style.backgroundColor = localStorage.getItem("textcolor")
  FontIndicator.textContent = localStorage.getItem("font")
  FontIndicator.style.fontFamily = localStorage.getItem("font")
}

function ChangeVars(text, background, font) {
  localStorage.setItem('textcolor', text);
  localStorage.setItem('background', background);
  localStorage.setItem('font', font)
  SetVars();
}

function fitText(element) {

  element.style.fontSize = '260px';

  const container = element.parentElement;
  let currentFontSize = parseFloat(window.getComputedStyle(element).fontSize);


  while (element.scrollHeight > container.clientHeight && currentFontSize > 1) {
    currentFontSize--;
    element.style.fontSize = `${currentFontSize}px`;
  }
}

const textElement = document.querySelector('.text');
fitText(textElement);


window.addEventListener('input', () => fitText(textElement));
window.addEventListener('resize', () => fitText(textElement));

function Bar(state) {
  const bar = document.querySelector('#bar');
  bar.classList.toggle('is-visible');
  focus();
}

function focus() {
  var inputElement = document.getElementById('inputtext');
  if (inputElement) {
    inputElement.focus();
  }
}

window.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    if (barstate = 'visible') {
      Bar();
      focus();
    }
  }
});


// Speed selector
document.querySelectorAll('.speed-option').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.speed-option').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    if (this.textContent === 'Slowest') {
      speed = 1000
    }
    if (this.textContent === 'Slow') {
      speed = 500
    }
    if (this.textContent === 'Medium') {
      speed = 250
    }
    if (this.textContent === 'Fast') {
      speed = 120
    }
    if (this.textContent === 'Fastest') {
      speed = 55
    }
    clearInterval(flashInterval);
    if (flashToggle.checked) {
      flashInterval = setInterval(() => {
        ChangeVars(localStorage.getItem("background"), localStorage.getItem("textcolor"), localStorage.getItem("font"))
      }, speed);
    }
  });
});

// Flash toggle
flashToggle.addEventListener('change', function () {
  if (this.checked) {
    flashInterval = setInterval(() => {
      ChangeVars(localStorage.getItem("background"), localStorage.getItem("textcolor"), localStorage.getItem("font"))
    }, speed);
  } else {
    clearInterval(flashInterval);
    previewText.style.opacity = '1';
  }
});

// Color swap
function swapColors() {
  ChangeVars(localStorage.getItem("background"), localStorage.getItem("textcolor"), localStorage.getItem("font"))
}



function resetSettings() {
  ChangeVars("white", "black", "HelveticaNeue-Medium")
  speed = 250
  flashToggle.checked = false;
  clearInterval(flashInterval);
  previewText.style.opacity = '1';
  document.querySelectorAll('.speed-option').forEach(b => b.classList.remove('active'));
  document.querySelector('[data-speed="medium"]').classList.add('active');
}












