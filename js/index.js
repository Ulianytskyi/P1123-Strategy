console.clear();
const $id = (function(id) { return document.getElementById(id); });
const $class = (function(className) { return document.querySelector(className); });
const $$class = (function(className) { return document.querySelectorAll(className); });
const dc = (function(tag) { return document.createElement(tag); });
const ach = (function(parent, child) { return parent.appendChild(child); });

// ----------------------------------------------------------------------------------

// Get a reference to the 'container' element and initialize some variables
const container = $id('container');
let objCounter = Math.floor(window.innerWidth / 50);
let arrayObjects = [];

// Function to get random coordinates for objects
function getRandomCoords() {
  let coords = [];
  let x = Math.floor(Math.random() * Math.floor(innerWidth - 50)) + 40;
  let y = Math.floor(Math.random() * Math.floor(innerHeight - 50)) + 40;
  coords.push(x, y);
  return coords;
}

// Create initial objects and add them to the container
function createObjects(objCounter) {
  for (let i = 0; i < objCounter; i++) {
    const coords = getRandomCoords();
    const obj = dc('div');
    obj.className = 'object';
    obj.dataset.xy = `${coords[0]}-${coords[1]}`;
    obj.style.left = coords[0] + 'px';
    obj.style.top = coords[1] + 'px';
    arrayObjects.push(obj);
    ach(container, obj);
  }
}

createObjects(objCounter);
let x1, y1, x2, y2, rectW, rectH, oneObj;
let isMoving = false;

// Event listener for mouse down
container.addEventListener('mousedown', (event) => {

  if (oneObj == null && event.target.className == 'object') {
    oneObj = event.target;
  }
  
  x1 = event.clientX;
  y1 = event.clientY;

  // Check if left mouse button is clicked and deselect objects if needed
  if (event.button === 0) {
    deselectObjects();
  }

  // Create a rectangle when not already present
  if (!container.contains($class('.rect'))) {
    const rectangle = dc('div');
    ach(container, rectangle);
    rectangle.className = 'rect';
    rectangle.style.left = x1 + 'px';
    rectangle.style.top = y1 + 'px';
  }

  isMoving = true;
});

// Event listener for mouse move
container.addEventListener('mousemove', (event) => {
  x2 = event.clientX;
  y2 = event.clientY;

  if (isMoving) {
    // Calculate rectangle dimensions and adjust position based on mouse movement
    rectW = x2 - x1;
    rectH = y2 - y1;

    if (rectW < 0) {
      $class('.rect').style.left = x2 + 'px';
      $class('.rect').style.width = -rectW + 'px';
    } else {
      $class('.rect').style.left = x1 + 'px';
      $class('.rect').style.width = rectW + 'px';
    }

    if (rectH < 0) {
      $class('.rect').style.top = y2 + 'px';
      $class('.rect').style.height = -rectH + 'px';
    } else {
      $class('.rect').style.top = y1 + 'px';
      $class('.rect').style.height = rectH + 'px';
    }
  }
});

// Event listener for mouse up
container.addEventListener('mouseup', (ev) => {
  isMoving = false;

  // Remove the rectangle if present
  if (container.contains($class('.rect'))) {
    container.removeChild($class('.rect'));
  }

  // Select objects based on the drawn rectangle
  if (x1 < x2 && y1 < y2) {
    $$class('.object').forEach(object => {
      let pos = takeCoords(object.dataset.xy);
      if ( pos.x > x1 && pos.x < x2 && pos.y > y1 && pos.y < y2) {
        object.classList.add('selected');
      }
    });
  }

  if (x1 < x2 && y1 > y2) {
    $$class('.object').forEach(object => {
      let pos = takeCoords(object.dataset.xy);
      if ( pos.x > x1 && pos.x < x2 && pos.y < y1 && pos.y > y2) {
        object.classList.add('selected');
      }
    });
  }

  if (x1 > x2 && y1 > y2) {
    $$class('.object').forEach(object => {
      let pos = takeCoords(object.dataset.xy);
      if ( pos.x < x1 && pos.x > x2 && pos.y < y1 && pos.y > y2) {
        object.classList.add('selected');
      }
    });
  }

  if (x1 > x2 && y1 < y2) {
    $$class('.object').forEach(object => {
      let pos = takeCoords(object.dataset.xy);
      if ( pos.x < x1 && pos.x > x2 && pos.y > y1 && pos.y < y2) {
        object.classList.add('selected');
      }
    });
  }

  // Select object by one click
  if (oneObj != null) {
    oneObj.classList.add('selected');
    oneObj = null;
  }
  
});

// Function to extract coordinates from object's dataset
function takeCoords(objectDatasetXY) {
  let coords = objectDatasetXY.split('-');
  let x = parseInt(coords[0]);
  let y = parseInt(coords[1]);
  return { x, y };
}

// Function to deselect objects
function deselectObjects() {
  $$class('.object').forEach(object => {
    if (object.classList.contains('selected')) {
      object.classList.remove('selected');
    }
  });
}

// Event listener for right-click context menu
container.addEventListener('contextmenu', (event) => {
  event.preventDefault();

  let destX = event.clientX;
  let destY = event.clientY;

  // Check if multiple objects are selected
  $$class('.selected').forEach(object => {
    let pos = takeCoords(object.dataset.xy);

    if (pos.x < destX && pos.y < destY) {
      console.log('\\>');
    }

    console.log(event.target);



    // Update object's dataset
    object.dataset.xy = `${destX}-${destY}`;
    // Animate object's movement
    moveAnimation(object, destX, destY);
  });

  // Deselect objects after the operation
  deselectObjects();
});


// Function to animate object's movement
function moveAnimation(object, destX, destY) {
  gsap.to(object, {
    left: destX + 'px',
    top: destY + 'px',
    duration: 1,
    ease: 'none',
  });
}