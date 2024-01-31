class Button{
    constructor(inX, inY, inDiameter){
        this.posX = inX;
        this.posY = inY;
        this.diameter = inDiameter;
    }

    clickedOn(){
        if(dist(mouseX, mouseY, this.posX, this.posY) <= this.diameter / 2){
            return true;
        }
        else
            return false;
    }
}