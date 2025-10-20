let barstate = ''
let speed = 250
const previewText = document.getElementById('previewText');
const textColorIndicator = document.getElementById('textColorIndicator');
const bgColorIndicator = document.getElementById('bgColorIndicator');
const flashToggle = document.getElementById('flashToggle');
const thebackground = document.querySelectorAll('.background')
const textcolor = document.querySelectorAll('.textcolor')
const FontIndicator = document.querySelector('#selected-font-display')
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

  // Ensure saved font is applied on load. If a user previously selected a font,
  // load it (Google font link will be added by loadGoogleFont) and apply via ChangeVars.
  try {
    const savedFont = localStorage.getItem('font') || 'HelveticaNeue-Medium';
    if (savedFont && savedFont !== 'HelveticaNeue-Medium' && typeof loadGoogleFont === 'function') {
      // append the Google Fonts link for the saved family
      loadGoogleFont(savedFont);
      // attempt to wait for the font to be available before applying it
      // use a best-effort approach: try document.fonts.load, otherwise apply immediately
      if (document.fonts && typeof document.fonts.load === 'function') {
        document.fonts.load(`16px "${savedFont}"`).then(() => {
          ChangeVars(localStorage.getItem('textcolor'), localStorage.getItem('background'), savedFont);
        }).catch(() => {
          ChangeVars(localStorage.getItem('textcolor'), localStorage.getItem('background'), savedFont);
        });
      }
    } else {
      // default font or no loader available — just apply
      ChangeVars(localStorage.getItem('textcolor'), localStorage.getItem('background'), savedFont);
    }
  } catch (e) {
    // ignore errors but still try to apply values
    try { ChangeVars(localStorage.getItem('textcolor'), localStorage.getItem('background'), localStorage.getItem('font') || 'HelveticaNeue-Medium'); } catch(_){}
  }

  const inputText = document.getElementById('inputtext');
  const textElement = document.querySelector('.text');
  const textarea = document.querySelector('text-area')
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
  // persist colors immediately
  try { localStorage.setItem('textcolor', text); } catch(e) {}
  try { localStorage.setItem('background', background); } catch(e) {}

  // If the font is the default bundled font, just persist and apply.
  const fontName = font || localStorage.getItem('font') || 'HelveticaNeue-Medium';

  // If this is a Google font (i.e., not the bundled default), ensure the
  // Google Fonts stylesheet is appended and wait for the face to load before applying.
  if (fontName && fontName !== 'HelveticaNeue-Medium' && typeof loadGoogleFont === 'function') {
    try {
      loadGoogleFont(fontName);
      // wait for the font to be available, then persist and apply
      if (document.fonts && typeof document.fonts.load === 'function') {
        document.fonts.load(`16px "${fontName}"`).then(() => {
          try { localStorage.setItem('font', fontName); } catch(e) {}
          SetVars();
        }).catch(() => {
          try { localStorage.setItem('font', fontName); } catch(e) {}
          SetVars();
        });
        return;
      }
    } catch (e) {
      // fall through and apply anyway
    }
  }

  // Default path: persist font and apply immediately
  try { localStorage.setItem('font', fontName); } catch(e) {}
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

    const googleFonts = [
      'HelveticaNeue-Medium', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 
      'Oswald', 'Raleway', 'Poppins', 'Merriweather', 'Nunito',
      'Playfair Display', 'Ubuntu', 'Mukta', 'Rubik', 'Work Sans',
      'Fira Sans', 'Source Sans Pro', 'Noto Sans', 'PT Sans', 'Crimson Text',
      'Lora', 'Roboto Condensed', 'Slabo 27px', 'PT Serif', 'Inconsolata'
    ];

    let selectedFont = localStorage.getItem('font');
    let customFonts = [];
  // Track which font families we've already requested/loaded.
  // Do NOT pre-seed with the saved font from localStorage — that prevents
  // loadGoogleFont from appending the Google Fonts stylesheet for the
  // saved family on startup. Seed with the bundled default instead.
  let loadedFonts = new Set(['HelveticaNeue-Medium']);
    let isDropdownOpen = false;

    const dropdownButton = document.getElementById('dropdown-button');
    const dropdownMenu = document.getElementById('font-dropdown');
    const selectedFontDisplay = document.getElementById('selected-font-display');
    const searchInput = document.getElementById('search-input');
    const googleFontList = document.getElementById('google-font-list');
    const customFontList = document.getElementById('custom-font-list');
    const fileInput = document.getElementById('file-input');
    const uploadButton = document.getElementById('upload-button');

    // Initialize
    renderGoogleFonts(googleFonts);

    // Toggle dropdown
    dropdownButton.addEventListener('click', function() {
      isDropdownOpen = !isDropdownOpen;
      dropdownMenu.classList.toggle('open', isDropdownOpen);
      dropdownButton.classList.toggle('open', isDropdownOpen);
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!dropdownButton.contains(e.target) && !dropdownMenu.contains(e.target)) {
        isDropdownOpen = false;
        dropdownMenu.classList.remove('open');
        dropdownButton.classList.remove('open');
      }
    });

    // Tab switching
    document.querySelectorAll('.tab').forEach(function(tab) {
      tab.addEventListener('click', function() {
        const tabName = tab.getAttribute('data-tab');
        
        document.querySelectorAll('.tab').forEach(function(t) {
          t.classList.remove('active');
        });
        tab.classList.add('active');
        
        document.querySelectorAll('.tab-content').forEach(function(content) {
          content.classList.remove('active');
        });
        document.getElementById(tabName + '-tab').classList.add('active');
      });
    });

    // Search functionality
    searchInput.addEventListener('input', function(e) {
      const query = e.target.value.toLowerCase();
      const filtered = googleFonts.filter(function(font) {
        return font.toLowerCase().includes(query);
      });
      renderGoogleFonts(filtered);
    });

    // Upload button
    uploadButton.addEventListener('click', () => {
      fileInput.click();
    });

    // File upload
    fileInput.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      
      files.forEach(file => {
        if (file.type.match(/font\/(ttf|otf|woff|woff2)/) || 
            file.name.match(/\.(ttf|otf|woff|woff2)$/i)) {
          
          const reader = new FileReader();
          reader.onload = (event) => {
            const fontName = file.name.replace(/\.[^/.]+$/, '');
            const fontFace = new FontFace(fontName, `url(${event.target.result})`);
            
            fontFace.load().then((loadedFace) => {
              document.fonts.add(loadedFace);
              // mark uploaded font as loaded so UI can render its preview
              loadedFonts.add(fontName);
              customFonts.push(fontName);
              renderCustomFonts();
              selectFont(fontName);
              isDropdownOpen = false;
              dropdownMenu.classList.remove('open');
              dropdownButton.classList.remove('open');
            }).catch(err => {
              console.error('Error loading font:', err);
            });
          };
          reader.readAsDataURL(file);
        }
      });
      
      fileInput.value = '';
    });

    function loadGoogleFont(fontName) {
      if (!loadedFonts.has(fontName)) {
        const link = document.createElement('link');
        link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;700&display=swap`;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
        loadedFonts.add(fontName);
      }
    }

    function selectFont(fontName) {
          selectedFont = fontName;
          // persist selection
          try { localStorage.setItem('font', fontName); } catch (e) {}
          FontIndicator.textContent = fontName;
          FontIndicator.style.fontFamily = fontName;
          // apply via ChangeVars so all UI updates (colors retained)
          ChangeVars(localStorage.getItem('textcolor'), localStorage.getItem('background'), fontName);
          // Update selected state
          document.querySelectorAll('.font-item').forEach(item => {
            item.classList.toggle('selected', item.getAttribute('data-font') === fontName);
          });
    }

    function renderGoogleFonts(fonts) {
      if (fonts.length === 0) {
        googleFontList.innerHTML = '<div class="empty-state">No fonts found</div>';
        return;
      }

      googleFontList.innerHTML = fonts.map(function(font) {
        return '<button class="font-item ' + (font === selectedFont ? 'selected' : '') + '" data-font="' + font + '">' +
          '<span style="font-family: ' + (loadedFonts.has(font) ? font : 'inherit') + '">' + font + '</span>' +
          '<svg class="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
            '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />' +
          '</svg>' +
        '</button>';
      }).join('');

      // Add event listeners
      googleFontList.querySelectorAll('.font-item').forEach(item => {
        const fontName = item.getAttribute('data-font');
        
        // Load font on hover
        item.addEventListener('mouseenter', () => {
          loadGoogleFont(fontName);
          setTimeout(() => {
            item.querySelector('span').style.fontFamily = fontName;
          }, 100);
        });

        // Select font on click
        item.addEventListener('click', () => {
          loadGoogleFont(fontName);
          selectFont(fontName);
          isDropdownOpen = false;
          dropdownMenu.classList.remove('open');
          dropdownButton.classList.remove('open');
        });
      });
    }

    function renderCustomFonts() {
      if (customFonts.length === 0) {
        customFontList.innerHTML = '<div class="empty-state">No custom fonts uploaded yet</div>';
        return;
      }

      customFontList.innerHTML = customFonts.map(function(font) {
        return '<button class="font-item custom-font-item ' + (font === selectedFont ? 'selected' : '') + '" data-font="' + font + '">' +
          '<span style="font-family: ' + font + '">' + font + '</span>' +
          '<div style="display: flex; align-items: center; gap: 0.5rem;">' +
            '<svg class="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
              '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />' +
            '</svg>' +
            '<button class="remove-font" data-font="' + font + '">' +
              '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
                '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />' +
              '</svg>' +
            '</button>' +
          '</div>' +
        '</button>';
      }).join('');

      // Add event listeners
      customFontList.querySelectorAll('.font-item').forEach(item => {
        const fontName = item.getAttribute('data-font');
        
        item.addEventListener('click', (e) => {
          if (!e.target.closest('.remove-font')) {
            selectFont(fontName);
            isDropdownOpen = false;
            dropdownMenu.classList.remove('open');
            dropdownButton.classList.remove('open');
          }
        });
      });

      // Remove font buttons
      customFontList.querySelectorAll('.remove-font').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const fontName = btn.getAttribute('data-font');
          customFonts = customFonts.filter(f => f !== fontName);
          
          if (selectedFont === fontName) {
            selectFont('HelveticaNeue-Medium');
          }
          
          renderCustomFonts();
        });
      });
    }












