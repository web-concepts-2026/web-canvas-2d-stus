const canvas = document.querySelector(".my-canvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = 480;
ctx.canvas.height = 320;

ctx.lineWidth = 4;
ctx.strokeStyle = "red"
ctx.lineCap = "round"
//
// ctx.strokeRect(75, 140, 150, 110);
//
// ctx.strokeStyle = "blue"
// ctx.beginPath();
// ctx.moveTo(50, 140);
// ctx.lineTo(150, 60);
// ctx.lineTo(250, 140);
// ctx.closePath();
// ctx.stroke();

let lastX = undefined;
let lastY = undefined;

function onDraw(x, y) {
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke()

    lastX = x;
    lastY = y;
}

function onIdle(x, y) {
    lastX = x;
    lastY = y;
}

const stateMachine = state(onDraw, onIdle)

canvas.addEventListener("mousemove", function (event) {
    stateMachine.next(event)
});
canvas.addEventListener("mousedown", function (event) {
    stateMachine.next(event)
});
canvas.addEventListener("mouseup", function (event) {
    stateMachine.next(event)
});

window.addEventListener("mouseup", function (event) {
    stateMachine.next(event)
});

function state(onDraw, onIdle) {
    const STATE = {
        IDLE: "idle",
        DRAW: "draw",
    }

    let currentState = STATE.IDLE;

    return {
        next: (event) => {
            switch(event.type) {
                case "mousemove":
                    if (currentState === STATE.IDLE) {
                        onIdle(event.offsetX, event.offsetY);
                    } else if (currentState === STATE.DRAW) {
                        onDraw(event.offsetX, event.offsetY);
                    }
                    break;
                case "mouseup":
                    if (currentState === STATE.DRAW) {
                        currentState = STATE.IDLE;
                    }
                    break;
                case "mousedown":
                    if (currentState === STATE.IDLE) {
                        currentState = STATE.DRAW;
                    }
                    break;
            }
        }
    }
}