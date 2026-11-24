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
3. Collor + size logic 
4. DRAW functionality
5. ERASE, CLEAR, UNDO functionality 
6. EXPLORE functionality