class Button{
    constructor(inX, inY, inDiameter, buttonType){
        this.posX = inX;
        this.posY = inY;
        this.diameter = inDiameter;
        // to be a string of either: "shuffle, edit, save, copy"
        this.buttonType = buttonType;   
    }

    clickedOn(){
        if(dist(mouseX, mouseY, this.posX, this.posY) <= this.diameter / 2){
            return true;
        }
        else
            return false;
    }

    drawButton(){
        noStroke();

        if(this.buttonType === "scramble"){
            fill(255, 0, 0);
            circle(this.posX, this.posY, this.diameter);

            stroke(255,255,255);
            
            strokeWeight(this.diameter/12);
            let lineLength = this.diameter * 0.6;
            let triDiv = 10;
            // Will adjust the parts that are covered by the triangles by 5 degrees to have clean lines.
            let arcGap = 20;    
            angleMode(DEGREES);
            
            // Bottom arc arrow
            push();
            translate(this.posX, this.posY);
            noFill();
            arc(0,0, lineLength, lineLength, arcGap + 5, 180-arcGap);            
            translate(lineLength /2, tan(arcGap) * lineLength /2);
            rotate(-45);
            fill(255,255,255);
            triangle(-lineLength/triDiv, -lineLength/triDiv, 0, 0, -lineLength/triDiv, lineLength/triDiv);
            pop();

            // Top Arc Arrow
            push();
            translate(this.posX, this.posY);
            noFill();
            arc(0,0, lineLength, lineLength, 180 + arcGap + 5, -arcGap);            
            translate(-lineLength /2, -(tan(arcGap) * lineLength /2));
            rotate(135);
            fill(255,255,255);
            triangle(-lineLength/triDiv, -lineLength/triDiv, 0, 0, -lineLength/triDiv, lineLength/triDiv);
            pop();
            

        }

    }
}