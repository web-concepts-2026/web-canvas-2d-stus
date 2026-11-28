
const draw_btn = document.querySelector(".draw")
const erase_btn = document.querySelector(".erase")
const undo_btn = document.querySelector(".undo")
const clear_btn = document.querySelector(".clear")
const stamp_btn = document.querySelector(".stamp")


const color = document.getElementById("color_picker")
const volume = document.getElementById("volume")


const canvas = document.querySelector(".canvas canvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width = canvas.clientWidth;
ctx.canvas.height = canvas.clientHeight;

ctx.lineCap = 'round'
ctx.lineJoin = 'round'


const CanvasState = {
    DRAW : "draw",
    STAMP : "stamp"
}

let canvasState = CanvasState.DRAW

const DRAW_TYPE = {
        DRAW: "draw",
        ERASE: "erase"
    }

let currentType = DRAW_TYPE.DRAW


const stateMachine = state()


// [(x1,y1),(x2,y2),(x3,y3),...,(xn,yn),] => [(x1,y1),(x2,y2),(x3,y3),...,(xn,yn),(x,y)] + draw (xn,yn -> x, y)

let line_shape = (x,y) => {
    return {    
        points : [[x,y]],
        color : currentType == DRAW_TYPE.DRAW ? color.value : "white",
        volume : volume.value,
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

            for (let i = 1; i < this.points.length; i++) {
                let x1 = this.points[i][0]
                let y1 = this.points[i][1]

                ctx.lineTo(x1,y1)
            }
            ctx.stroke()
        }
    }
}

let create_ying_yan = (x,y) => {
    return {
        Draw() {
            
            function circle(y, radius, color) {
                ctx.beginPath();
                ctx.fillStyle = color;
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.fill();
            }

            let radius = 50;
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


function SetDraw() {
    canvasState = CanvasState.DRAW
    currentType = DRAW_TYPE.DRAW
}

function SetErase() {
    canvasState = CanvasState.DRAW
    currentType = DRAW_TYPE.ERASE
}

function SetUndo() {
    shape_stack.UndoShape();
}

function SetClear() {
    shape_stack.Clear();
}

function SetStampMode() {
    canvasState = CanvasState.STAMP;
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
function state() {
    const STATE = {
        IDLE: "idle",
        DRAW: "draw",
    }

    let currentState = STATE.IDLE;

    return {
        next: (event) => {
            if (canvasState == CanvasState.STAMP && event.type == "mousedown"){
                shape_stack.AddShape(create_ying_yan(event.offsetX, event.offsetY))
                return
            }
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
stamp_btn.addEventListener("click", () => SetStampMode())