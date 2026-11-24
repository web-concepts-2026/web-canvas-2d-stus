# web-canvas-2d-stus


# Design 

FSM general design 
State Object with OnClick() method
States: 
  EXPLORE
  DRAW 
  ERASE == DRAW with white color 
  PLACE_STAMP

Objects stack 
IObject has Draw() method. 
stack<IObject>





# Implementation steps
0. Research canvas 
1. Visual part(without canvas)
2. Button logic e.g. swapping between states 
3. DRAW functionality
4. ERASE, CLEAR, UNDO functionality 
5. EXPLORE functionality