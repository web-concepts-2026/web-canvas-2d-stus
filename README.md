# web-canvas-2d-stus


To run this assignment just open index.html. 

# Short overview 

My assignment is a simple web paint app, you can choose your size and color in buttons at a green box. Buttons on the left in a red rectangle are what you can do with your canvas, Draw, Erase, Stamp are for changing type of drawing you do, here is a short explanation for each of them:
1. Draw just draws on mouse click according to your mouse movements, it uses size and color from respective buttons
2. Erase is the same as draw but with background color
3. Stamp places a predefined object on a screen, in our case Yin-Yang symbol

Also I have Undo and Clear button, clear button clears all screen to it's initial condition. Undo, undoes your previous drawing/Stamp/Clear

# Design

For implementing this project I used following ideas: 

1. Stack of all drawn objects(list in javascript), so Undo is just stack.pop() all elements of stack should have a Draw() method.
2. State machine for drawing, in it I detect mouse input and perform drawing depending on it.  
3. 2 state machines for controlling what type of paint I should use(Draw vs Erase, CanvasState) and what I am doing now (Draw vs Stamp, CanvasState), I change them in event listeners for buttons 
4. ResiseCanvas, during testing I found out that my application was not working when I change dimensions of a screen so I added this function and eventListener to make correct changes to it, fortunately my object model works fine and ReDraw() method of shapeStack is displaying correct drawings. 

# Minor info 

- In lineShape, line 65, I have ctx.lineTo(x0 + 0.01, y0) because this API needs a small difference to draw dot
- Stamp could've been an Image loaded from folder but I decided to just draw it by hand.
- Design of an app is not extremly beautiful because I cannot create good design and it was easier to test css with different colors symbolising different blocks(canvas was green originally) 