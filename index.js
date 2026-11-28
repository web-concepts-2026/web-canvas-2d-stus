
const draw_btn = document.querySelector(".draw")
const erase_btn = document.querySelector(".erase")
const undo_btn = document.querySelector(".undo")
const clear_btn = document.querySelector(".clear")
const stamp_btn = document.querySelector(".stamp")


const color = document.getElementById("color_picker")
const size = document.getElementById("size")


const canvas = document.querySelector(".canvas canvas");
const ctx = canvas.getContext("2d");

const CanvasState = {
    DRAW : "draw",
    STAMP : "stamp"
}

let canvasState = CanvasState.DRAW

const DrawType = {
        DRAW: "draw",
        ERASE: "erase"
    }

let currentType = DrawType.DRAW


const stateMachine = state() // this is a state machine for drawing control (mouseup, mousedown, ...)


// Shape stack, shapes and logic with them

// [(x1,y1),(x2,y2),(x3,y3),...,(xn,yn),] => [(x1,y1),(x2,y2),(x3,y3),...,(xn,yn),(x,y)] + draw (xn,yn -> x, y)

let lineShape = (x,y) => {
    
    return {    
        points : [[x,y]],
        color : currentType == DrawType.DRAW ? color.value : "white",
        volume : size.value,
        AddPoint(x,y){
            ctx.strokeStyle = this.color
            ctx.lineWidth = this.volume
            let lastX = this.points.at(-1)[0]
            let lastY = this.points.at(-1)[1]

            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
            this.points.push([x, y])
            
        }, 
        Draw() {
            ctx.strokeStyle = this.color
            ctx.lineWidth = this.volume
            ctx.beginPath()
            let x0 = this.points[0][0]
            let y0 = this.points[0][1]

            ctx.moveTo(x0,y0)
            ctx.lineTo(x0 + 0.01,y0)
            for (let i = 1; i < this.points.length; i++) {
                let x1 = this.points[i][0]
                let y1 = this.points[i][1]

                ctx.lineTo(x1,y1)
            }
            ctx.stroke()
        }
    }
}

let createYingYan = (x,y) => {
    const radius = Math.max(10, Number(size.value));
    return {
        Draw() {
            
            function circle(y, radius, color) {
                ctx.beginPath();
                ctx.fillStyle = color;
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            circle(y, radius * 51/50 , 'black')
            circle(y, radius , 'white')
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(x, y, radius, -Math.PI * .5, Math.PI * .5);
            ctx.fill();
            circle( radius / 2 + y, radius / 2, 'white');
            circle(-radius / 2 + y, radius / 2, 'black');
            circle( radius / 2 + y, radius / 8, 'black');
            circle(-radius / 2 + y, radius / 8, 'white');
                }
    }
}


let shapeStack = {
    stack : [], 
    AddPoint(x, y) {
        if (this.stack.length != 0)this.stack.at(-1).AddPoint(x,y);
    },
    CreateNewShape(x,y) {
        this.stack.push(
            lineShape(x,y)
        )
        this.ReDraw()
    },
    AddShape(shape) {
        this.stack.push(shape);
        this.ReDraw();
    },
    ReDraw() {
        ctx.fillStyle="white"
        ctx.fillRect(0,0,canvas.width, canvas.height)
        for (const shape of this.stack) {   
            shape.Draw();
        }
    },
    UndoShape() {
        this.stack.pop();
        this.ReDraw();
    },
    Clear() {
        if (this.stack.length === 0) return;
        this.AddShape({
            Draw() {
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        });
    }

}

// End 


// State machine for drawing 
function nextEvent(event){
    stateMachine.next(event)
}
canvas.addEventListener("mousemove", (event) => nextEvent(event));
canvas.addEventListener("mousedown", (event) => nextEvent(event));
window.addEventListener("mouseup", (event) => nextEvent(event))

function state() {
    const STATE = {
        IDLE: "idle",
        DRAW: "draw",
    }

    let currentState = STATE.IDLE;

    return {
        next: (event) => {
            if (canvasState == CanvasState.STAMP && event.type == "mousedown"){
                shapeStack.AddShape(createYingYan(event.offsetX, event.offsetY))
                return
            }
            switch(event.type) {
                case "mousemove":
                    if (currentState === STATE.DRAW) {
                        shapeStack.AddPoint(event.offsetX, event.offsetY);
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
                        shapeStack.CreateNewShape(event.offsetX, event.offsetY)
                    }
                    break;
            }
        }
    }
}

// Control Buttons setup  
function SetDraw() {
    canvasState = CanvasState.DRAW
    currentType = DrawType.DRAW
}

function SetErase() {
    canvasState = CanvasState.DRAW
    currentType = DrawType.ERASE
}

function SetUndo() {
    shapeStack.UndoShape();
}

function SetClear() {
    shapeStack.Clear();
}

function SetStampMode() {
    canvasState = CanvasState.STAMP;
}



draw_btn. addEventListener("click", () => SetDraw())
erase_btn.addEventListener("click", () => SetErase())
undo_btn. addEventListener("click", () => SetUndo())
clear_btn.addEventListener("click", () => SetClear())
stamp_btn.addEventListener("click", () => SetStampMode())

// End

// Canvas size check
function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx.lineCap = 'round';   
    ctx.lineJoin = 'round';
    shapeStack.ReDraw();
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);