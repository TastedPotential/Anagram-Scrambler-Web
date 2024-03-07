class Button{
    constructor(inX, inY, inDiameter, buttonType){
        this.posX = inX;
        this.posY = inY;
        this.diameter = inDiameter;
        // to be a string of either: "shuffle, edit, save, copy"
        this.buttonType = buttonType;
        this.startedClickOnThis = false;
    }

    clickedOn(){
        if(dist(mouseX, mouseY, this.posX, this.posY) <= this.diameter / 2){
            return true;
        }
        else{
            return false;
        }
            
    }

    drawButton(){
        noStroke();
        if(this.buttonType === "scramble"){
            fill(227, 45, 45);
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
        if(this.buttonType === "edit"){
            /*
            fill(47, 47, 214);
            circle(this.posX, this.posY, this.diameter);
            fill(255);
            textAlign(CENTER, CENTER);
            textSize(this.diameter * 0.85);
            text("E", this.posX, this.posY - this.diameter/10);
            */
            fill(47, 47, 214);
            circle(this.posX, this.posY, this.diameter);
            fill(255);
            angleMode(DEGREES);
            push();
            translate(this.posX, this.posY);
            rectMode(CENTER);
            rotate(315);
            rect(0,0, this.diameter * .52, this.diameter * .15);
            triangle(-this.diameter * .44, 0, -this.diameter * .30, this.diameter * .075, -this.diameter * .30, -this.diameter * .075);
            rect(this.diameter * .358, 0, this.diameter * .12, this.diameter * .15, 0, this.diameter * .05, this.diameter * .05, 0);
            stroke(47, 47, 214);
            strokeWeight(this.diameter/35);
            // graphite line
            line(-this.diameter * .37, this.diameter * .075, -this.diameter * .37, -this.diameter * .075);

            // mid line
            //line(-this.diameter * .25, 0, this.diameter * .25, 0);

            strokeWeight(this.diameter/40);
            // double mid lines
            //line(-this.diameter * .25, this.diameter * .0325, this.diameter * .25, this.diameter * .0325);
            //line(-this.diameter * .25, -this.diameter * .0325, this.diameter * .25, -this.diameter * .0325);
            pop();

            
        }
        if(this.buttonType === "save"){
            fill(116, 50, 191);
            circle(this.posX, this.posY, this.diameter);
            fill(255);
            push();
            translate(this.posX, this.posY);
            angleMode(DEGREES);
            rotate(270);
            rectMode(CENTER);
            rect(this.diameter * .10, 0, this.diameter * .60, this.diameter * .15);
            triangle(-this.diameter * .28, 0, -this.diameter * .08, this.diameter * .20, -this.diameter * .08   , -this.diameter * .20);
            stroke(255);
            strokeWeight(this.diameter/20);
            line(-this.diameter * .35, this.diameter * .20, -this.diameter * .35, -this.diameter * .20,);
            pop();

        }
    }
}