const canvas = document.getElementById("myCanvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const groundHeight = 50;
const g = 1; // Adjusted gravity for a more realistic feel
const airResistance = 0.01; // Added air resistance
const wind = 0.05; // Horizontal wind affecting the balloon

// Objects
const mouse = {
    x: 0,
    y: 0,
    isMouseDown: false,
};

const balloon = {
    x: canvas.width / 2 - 25,
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
    drop: {
        width: 200,
        height: 50,
        x: canvas.width - 200 - 10,
        y: 10 + 30 + 50 + 60,
        color: 'lightgray',
        text: {
            x: canvas.width - 190 - 10,
            y: 25 + 20 + 50 + 70,
            text: "Aruncă mingea",
            font: "bold 14px Ubuntu",
            color: "black",
        },
        slider: {
            x: canvas.width - 190 - 10 + 90,
            y: 25 + 50 + 60 + 50,
            size: 0,
            color: 'blue',
        },
        bar: {
            x: canvas.width - 200 + 20,
            y: 40 + 15 + 50 + 70,
            width: 200 - 60,
            height: 20,
            color: 'gray',
        },
    },
};

const ball = {
    isFalling: false,
    x: balloon.x + balloon.width / 2,
    y: balloon.y + balloon.height,
    size: 10,
    color: 'black',
    vx: balloon.vx,
    vy: balloon.vy,
    dropped: false,
    bounceFactor: -0.6, // Added bounce effect
}

let cameraY = 0;
let lastTimestamp = 0;
let time = 0;

// Animation 
function animate(timestamp) {
    requestAnimationFrame(animate);

    if (!lastTimestamp) {
        lastTimestamp = timestamp;
    }
    const deltaTime = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;


    // Calculate the camera's position based on the balloon's position
    if (!ball.isFalling) {
        cameraY = canvas.height / 2 - balloon.y;
    } else {
        cameraY = canvas.height / 2 - ball.y;
    }

    // Define a minimum camera position to stop following the balloon
    const minCameraY = canvas.height - groundHeight;
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
    drawRec({
        x: balloon.x > 0 ? balloon.x % canvas.width : canvas.width - (Math.abs(balloon.x) % canvas.width),
        y: balloon.y + cameraY,
        width: balloon.width,
        height: balloon.height,
        color: balloon.color
    });

    if (ball.isFalling) {
        if (ball.dropped) {
            ball.x = balloon.x + balloon.width / 2
            ball.y = balloon.y + 10
            ball.vy = 0
            ball.vx = balloon.vx
            ball.dropped = false
            time = 0
        }

         time += deltaTime;
        ball.y = ball.y + (ball.vy * time) + (0.5 * g * time * time);

       
        if (ball.y >= 0) {
            ball.y = 0
            ball.vx = 0
        drawCirle({
            x: ball.x > 0 ? ball.x % canvas.width : canvas.width - (Math.abs(ball.x) % canvas.width),
            y: ball.y + canvas.height - groundHeight,
            size: ball.size,
            color: ball.color
        })
        } else {
        drawCirle({
            x: ball.x > 0 ? ball.x % canvas.width : canvas.width - (Math.abs(ball.x) % canvas.width),
            y: ball.y + cameraY,
            size: ball.size,
            color: ball.color
        })
        }

        // Apply air resistance
        ball.vx -= airResistance * ball.vx;

        ball.x += ball.vx;
        
        if (Math.abs(ball.vx) < 0.01) {
            ball.vx = 0;
        }
    }
    

    drawContainer(sliderConfig.container);
    drawContainer(sliderConfig.horizontal);
    drawContainer(sliderConfig.drop)

    updateBalloonPosition();

}

animate();

// Functions 


function touchingBall(object) {
    const x = object.x;
    const y = (object.y + cameraY);

    if (
        mouse.x > x &&
        mouse.x < x + object.width &&
        mouse.y > y &&
        mouse.y < y + object.height
    ) {
        return true;
    }
    return false;
}

function touchingRectangle(object) {
    if (mouse.x > object.x - 10 && 
        mouse.x < object.x + object.width + 10 && 
        mouse.y > object.y -10 && 
        mouse.y < object.y + object.height + 10) 
    {
        return true
    }
    return false
}

function updateBalloonPosition() {
    // Update balloon velocity based on sliders
    balloon.vy = -parseFloat(sliderConfig.container.value);
    balloon.vx = parseFloat(sliderConfig.horizontal.value);

    // Apply gravity
    balloon.vy += g;

    // Check if balloon reaches top and reset
    if (balloon.y >= -55 && balloon.vy > 0) {
        balloon.y = -50;
        sliderConfig.container.slider.x = canvas.width - 10 - 100;
        sliderConfig.container.value = 1;
        sliderConfig.container.text.text = "Vy a balonului: 0.00";

        sliderConfig.horizontal.slider.x = canvas.width - 10 - 100;
        sliderConfig.horizontal.value = 0;
        sliderConfig.horizontal.text.text = "Vx a balonului: 0.00";
    } else {
        balloon.y += balloon.vy;
        balloon.x += balloon.vx;
    }
}

function drawContainer(container) {
    try {
        drawRec(container);
        drawRec(container.bar);
        drawCirle(container.slider);
        drawText(container.text);  
    } catch (error) {
        
    }
    
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
    c.closePath()
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
    value = Math.min(Math.max(value, inMin), inMax);
    const normalized = (value - inMin) / (inMax - inMin);
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

canvas.addEventListener('mousemove', () => {
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
    } else if (!ball.isFalling && touchingBall(balloon) && mouse.isMouseDown) {
        ball.dropped = true
        ball.isFalling = true;
    } else if (touchingRectangle(sliderConfig.drop.bar) && mouse.isMouseDown && !ball.isFalling) {
        ball.dropped = true
        ball.isFalling = true
        console.log('clicked')
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