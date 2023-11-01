const canvas = document.getElementById("myCanvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const groundHeight = 50;
const g = 1;

// Objects
const mouse = {
    x: 0,
    y: 0,
    isMouseDown: false,
};

const balloon = {
    x: 200,
    y: -50,
    vx: 0,
    vy: 0,
    width: 50,
    height: 50,
    color: 'orange',
    vspeed: 0,
};

const sliderConfig = {
    container: {
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
            color: 'lightblue',
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
    },
    horizontal: {
        width: 200,
        height: 50,
        x: canvas.width - 200 - 10,
        y: 10 + 20 + 50,
        color: 'lightgray',
        bar: {
            x: canvas.width - 200 - 10,
            y: 40 + 20 + 50,
            width: 200,
            height: 10,
            color: 'lightblue',
        },
        slider: {
            x: canvas.width - 100 - 10,
            y: 45 + 20 + 50,
            size: 20,
            color: 'blue',
        },
        text: {
            x: canvas.width - 190 - 10,
            y: 25 + 20 + 50,
            text: "Vx a balonului: 0.00",
            font: "bold 14px Ubuntu",
            color: "black",
        },
        value: 0,
        min: canvas.width - 200 - 10 + 5 + 20 / 2,
        max: canvas.width - 200 - 10 + 200 - 20 / 2 - 5,
        minValue: -5,
        maxValue: 5,
    },
};

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
    drawRec({ x: balloon.x % canvas.width, y: balloon.y + cameraY, width: balloon.width, height: balloon.height, color: balloon.color });
    drawContainer(sliderConfig.container);
    drawContainer(sliderConfig.horizontal);

    updateBalloonPosition();
}

animate();

// Functions 
function updateBalloonPosition() {
    balloon.vy = -parseFloat(sliderConfig.container.value);
    balloon.vy += g;
    if (balloon.y >= -55 && balloon.vy > 0) {
        balloon.y = -50;
        sliderConfig.container.slider.x = canvas.width - 10 - 100;
        sliderConfig.container.value = 1;
        sliderConfig.container.text.text = "Vy a balonului: 1.00"

        sliderConfig.horizontal.slider.x = canvas.width - 10 - 100;
        sliderConfig.horizontal.value = 0;
        sliderConfig.horizontal.text.text = "Vy a balonului: 0.00"
    } else {
        balloon.y += balloon.vy;
    }

    if (balloon.y < -50) {
        balloon.vx = parseFloat(sliderConfig.horizontal.value)
        balloon.x += balloon.vx;
    }
}

function drawContainer(container) {
    drawRec(container);
    drawRec(container.bar);
    drawCirle(container.slider);
    drawText(container.text);
}

function touchingObject(object) {
    if (
        mouse.x > object.x - 10 &&
        mouse.x < object.x + object.size + 10 &&
        mouse.y > object.y - 10 &&
        mouse.y < object.y + object.size + 10
    ) {
        return true;
    } else {
        return false;
    }
}

function drawCirle(circle) {
    c.beginPath();
    c.arc(circle.x, circle.y, circle.size / 2, 0, Math.PI * 2, false);
    c.fillStyle = circle.color;
    c.fill();
}

function drawRec(object) {
    c.beginPath();
    c.fillStyle = object.color;
    c.fillRect(object.x, object.y, object.width, object.height);
    c.closePath();
}

function drawText(object) {
    c.font = object.font;
    c.fillStyle = object.color;
    c.fillText(object.text, object.x, object.y);
}

function lerp(value, inMin, inMax, outMin, outMax) {
    // Ensure the value is within the input range
    value = Math.min(Math.max(value, inMin), inMax);

    // Calculate the normalized position within the input range
    const normalized = (value - inMin) / (inMax - inMin);

    // Calculate the output value within the output range
    return outMin + normalized * (outMax - outMin);
}

function calculateValue(container, axis) {
    const axisLabel = axis === "x" ? "x" : "y";
    container.value = lerp(container.slider.x, container.min, container.max, container.minValue, container.maxValue).toFixed(2);
    container.text.text = `V${axisLabel} a balonului: ${container.value}`;
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

canvas.addEventListener("mousemove", () => {
    if (touchingObject(sliderConfig.container.slider) && mouse.isMouseDown) {
        if (sliderConfig.container.slider.x > sliderConfig.container.max + 5) {
            sliderConfig.container.slider.x = sliderConfig.container.max;
        } else if (sliderConfig.container.slider.x < sliderConfig.container.min - 5) {
            sliderConfig.container.slider.x = sliderConfig.container.min;
        } else {
            sliderConfig.container.slider.x = mouse.x;
        }
        calculateValue(sliderConfig.container, 'y');
    } else if (touchingObject(sliderConfig.horizontal.slider) && mouse.isMouseDown) {
        if (sliderConfig.horizontal.slider.x > sliderConfig.horizontal.max + 5) {
            sliderConfig.horizontal.slider.x = sliderConfig.horizontal.max;
        } else if (sliderConfig.horizontal.slider.x < sliderConfig.horizontal.min - 5) {
            sliderConfig.horizontal.slider.x = sliderConfig.horizontal.min;
        } else {
            sliderConfig.horizontal.slider.x = mouse.x;
        }
        calculateValue(sliderConfig.horizontal, 'x');
    }
});

canvas.addEventListener('dblclick', () => {
    if (touchingObject(sliderConfig.container.slider)) {
        sliderConfig.container.slider.x = canvas.width - 100 - 10;
        calculateValue(sliderConfig.container, 'y');
    } else if (touchingObject(sliderConfig.horizontal.slider)) {
        sliderConfig.horizontal.slider.x = canvas.width - 100 - 10;
        calculateValue(sliderConfig.horizontal, 'x');
    }
});