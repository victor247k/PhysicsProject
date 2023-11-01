const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("myCanvas"));
const c = /** @type {CanvasRenderingContext2D} */ (canvas.getContext("2d"));

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const groundHeight = 50;

const g = 1;

// objects

const mouse = {
    x: 0,
    y: 0,
    isMouseDown: false
}

const balloon = {
    x: 200,
    y: -50,
    vx: 0,
    vy: 0,
    width: 50,
    height: 50,
    color: 'orange',
    vspeed: 0,
}

// slider for balloon vy

const container = {
    width: 200,
    height: 50,
    x: canvas.width - 200 - 10,
    y: 10,
    color: 'lightgray',
    bar: {
        x: canvas.width - 200 - 10,
        y: 40,
        width: 200,
        height: 10,
        color: 'lightblue'
    },
    slider: {
        x: canvas.width - 100 - 10,
        y: 45,
        size: 20,
        color: 'blue',
    },
    text: {
        x: canvas.width - 190 - 10,
        y: 25,
        text: "Vy a balonului: 0.00",
        font: "bold 14px Ubuntu",
        color: "black",
    },
    value: 1,
    min: canvas.width - 200 - 10 + 5 + 20 / 2,
    max: canvas.width - 200 - 10 + 200 - 20 / 2 - 5,
    minValue: -4,
    maxValue: 6,
}

// Animation 

function animate() {
    requestAnimationFrame(animate);

    // Calculate the camera's position based on the balloon's position
    let cameraY = canvas.height / 2 - balloon.y;

    // Define a minimum camera position to stop following the balloon
    const minCameraY = canvas.height - groundHeight;

    // Ensure the camera position doesn't go below the minimum
    cameraY = Math.max(cameraY, minCameraY);

    // Clear the canvas
    c.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the sky (above the camera's view)
    c.fillStyle = "lightblue";
    c.fillRect(0, 0, canvas.width, cameraY);

    // Draw the grass
    c.fillStyle = "green";
    c.fillRect(0, cameraY, canvas.width, groundHeight);

    // Draw the objects with adjusted positions based on the camera's position
    drawRec({ x: balloon.x, y: balloon.y + cameraY, width: balloon.width, height: balloon.height, color: balloon.color });
    drawContainer(container);

    updateBalloonPosition()

};

animate();

// functions 

function updateBalloonPosition() {
    balloon.vy = -parseFloat(container.value)
    balloon.vy += g;
    if (balloon.y >= -50 && balloon.vy > 0) {
        balloon.y - 50
        container.slider.x = canvas.width - 10 - 100;
    } else {
        balloon.y += balloon.vy;
    }
}

function drawContainer(container) {
    drawRec(container)
    drawRec(container.bar)
    drawCirle(container.slider)
    drawText(container.text)
}

function touchingObject(object) {
    if (mouse.x > object.x - 10 && mouse.x < object.x + object.size + 10 &&
        mouse.y > object.y - 10 && mouse.y < object.y + object.size + 10
    ) {
        return true
    } else return false
}

function drawCirle(circle) {
    c.beginPath()
    c.arc(circle.x, circle.y, circle.size / 2, 0, Math.PI * 2, false);
    c.fillStyle = circle.color
    c.fill()
}

function drawRec(object) {
    c.beginPath()
    c.fillStyle = object.color
    c.fillRect(object.x, object.y, object.width, object.height);
    c.closePath()
}

function drawText(object) {
    c.font = object.font
    c.fillStyle = object.color
    c.fillText(object.text, object.x, object.y)
}

function lerp(value, inMin, inMax, outMin, outMax) {
    // Ensure the value is within the input range
    value = Math.min(Math.max(value, inMin), inMax);

    // Calculate the normalized position within the input range
    const normalized = (value - inMin) / (inMax - inMin);

    // Calculate the output value within the output range
    return outMin + normalized * (outMax - outMin);
}

function calculateValue(container) {
    container.value = lerp(container.slider.x, container.min, container.max, container.minValue, container.maxValue).toFixed(2);
    container.text.text = `Vy a balonului: ${container.value}`;
}

// Event Listeners
canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Add a mousedown event listener
canvas.addEventListener('mousedown', function(e) {
    mouse.isMouseDown = true;
    // You can do something when the mouse button is pressed, e.g., start drawing.
});

// Add a mouseup event listener
canvas.addEventListener('mouseup', function(e) {
    mouse.isMouseDown = false;
    // You can do something when the mouse button is released, e.g., stop drawing.
});


canvas.addEventListener('mousemove', () => {
    if (touchingObject(container.slider) && mouse.isMouseDown) {
        if (container.slider.x > container.max + 5) {
            container.slider.x = container.max;
        } else if (container.slider.x < container.min - 5) {
            container.slider.x = container.min;
        } else {
            container.slider.x = mouse.x;
        }
    }
    calculateValue(container)
});

canvas.addEventListener('dblclick', () => {
    if (touchingObject(container.slider)) {
        container.slider.x = canvas.width - 100 - 10
    }
    calculateValue(container)
})