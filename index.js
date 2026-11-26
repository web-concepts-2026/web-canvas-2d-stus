
const draw_btn = document.querySelector(".draw")
const erase_btn = document.querySelector(".erase")
const undo_btn = document.querySelector(".undo")
const clear_btn = document.querySelector(".clear")


const color = document.getElementById("color_picker")
const volume = document.getElementById("volume")


const canvas = document.querySelector(".canvas canvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = canvas.clientWidth;
ctx.canvas.height = canvas.clientHeight;

ctx.lineCap = 'round'
ctx.lineJoin = 'round'




const stateMachine = state(Draw,Idle)


// [(x1,y1),(x2,y2),(x3,y3),...,(xn,yn),] => [(x1,y1),(x2,y2),(x3,y3),...,(xn,yn),(x,y)] + draw (xn,yn -> x, y)

let line_shape = (x,y) => {
    return {    
        points : [[x,y]],
        color : currentType == DRAW_TYPE.DRAW ? color.value : "white",
        volume : volume.value,
        AddPoint(x,y){
            ctx.strokeStyle = this.color
            ctx.lineWidth = this.volume
            lastX = this.points.at(-1)[0]
            lastY = this.points.at(-1)[1]

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
            x0 = this.points[0][0]
            y0 = this.points[0][1]

            ctx.moveTo(x0,y0)

            for (let i = 1; i < this.points.length; i++) {
                x1 = this.points[i][0]
                y1 = this.points[i][1]

                ctx.lineTo(x1,y1)
            }
            ctx.stroke()
        }
    }
}


let shape_stack = {
    stack : [], 
    AddPoint(x, y) {
        if (this.stack.length != 0)this.stack.at(-1).AddPoint(x,y);
    },
    CreateNewShape(x,y) {
        this.stack.push(
            line_shape(x,y)
        )
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
        this.stack = [];
        this.ReDraw();
    }

}

const DRAW_TYPE = {
        DRAW: "draw",
        ERASE: "erase"
    }

let currentType = DRAW_TYPE.DRAW

function SetDraw() {
    console.log("Draw")
    currentType = DRAW_TYPE.DRAW
}

function SetErase() {
    console.log("Erase")
    currentType = DRAW_TYPE.ERASE
}

function SetUndo() {
    console.log("Undo")
    shape_stack.UndoShape();
}

function SetClear() {
    console.log("Clear")
    shape_stack.Clear();
}

function Draw(event, color) {
    x = event.offsetX
    y = event.offsetY

    ctx.strokeStyle = color.value
    ctx.lineWidth = volume.value

    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    lastX = x;
    lastY = y;
}

function Idle(event) {
    lastX = event.offsetX;
    lastY = event.offsetY;    
}
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
})
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
                    if (currentState === STATE.DRAW) {
                        shape_stack.AddPoint(event.offsetX, event.offsetY);
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
                        shape_stack.CreateNewShape(event.offsetX, event.offsetY)
                    }
                    break;
            }
        }
    }
}



draw_btn.addEventListener("click", () => SetDraw())
erase_btn.addEventListener("click", () => SetErase())
undo_btn.addEventListener("click", () => SetUndo())
clear_btn.addEventListener("click", () => SetClear())