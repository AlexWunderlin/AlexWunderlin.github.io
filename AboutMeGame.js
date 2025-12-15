let canvas;
let ctx;

//Constants
const maxHeight = -5000;
const minHeight = 600;
const maxLeft = 0;
const maxRight = 2400;

//Game Vars
let x = 300;
let y = -300;
let ySpeed = 0;
let xSpeed = 0;
let playerSize = 400;

//User Input Tracking
let userInput = {
    mouseDown: false,
}

//Image Assets
let playerImage = new Image();
playerImage.src = "ProfileImage.png";
let spikeImage = new Image();
spikeImage.src = "Spike.png";
let background = new Image();
background.src = "Background.jpg";
let dirt = new Image();
dirt.src = "TerrainDirt.png";
let grass = new Image();
grass.src = "TerrainGrass.png";

//Textures
let metal = [new Image(), new Image(), new Image(), new Image()];
metal[0].src = "TerrainMetal1.png";
metal[1].src = "TerrainMetal2.png";
metal[2].src = "TerrainMetal2.png";
metal[3].src = "TerrainMetal1.png";

let terrain = [];
let hazards = [];

hazards[0] = {
    x: 850,
    y: 275,
    size: 25,
    texture: spikeImage
}

terrain[0] = {
    left: 50,
    right: 600,
    bottom: null,
    top: 325,
    texture: metal
}
terrain[1] = {
    left: 600,
    right: 2350,
    bottom: null,
    top: 275,
    texture: metal
}
terrain[2] = {
    left: 400,
    right: 500,
    bottom: 275,
    top: 225,
    texture: metal
}
terrain[3] = {
    left: 200,
    right: 300,
    bottom: 225,
    top: 175,
    texture: metal
}
terrain[4] = {
    left: 0,
    right: 50,
    bottom: null,
    top: 75,
    texture: metal
}
terrain[5] = {
    left: 2350,
    right: 2400,
    bottom: null,
    top: 75,
    texture: metal
}

const startAboutMeGame = async () => {

    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    canvas.onkeydown = (e) => {
        let key = e.key.toUpperCase();
        userInput[key] = true;
    }
    canvas.onkeyup = (e) => {
        let key = e.key.toUpperCase();
        userInput[key] = false;
    }
    canvas.onmousedown = (e) => {
        userInput.mouseDown = true;
    }
    canvas.onmouseup = (e) => {
        userInput.mouseUp = false;
    }

    while(!userInput.mouseDown) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        render()
        ctx.font = "75px Monospace";
        ctx.fillStyle = "White";
        ctx.fillText("Hi,", 550, 250);
        ctx.font = "50px Monospace";
        ctx.fillText("I'm Alex Wunderlin", 550, 350);
        ctx.fillText("[Click to start]", 555, 425);
        await wait(50);
    }
    await playAboutMeGame()

    x = 5

    while(true){

        ctx.font = "75px Monospace";
        ctx.fillStyle = "Yellow";
        ctx.fillText("Profile game in development", 0, y);

        y += x;
        if(y >= 400 || y <= 200){
            x = x * -1;
        }

        await wait(50);
    }
}

const playAboutMeGame = async () => {
    while(playerSize > 50){
        playerSize -= 5;
        render()
        await wait(5);
    }
    while(true){

        if(userInput["A"] && xSpeed > -10){
            xSpeed -= 2;
        }

        if(userInput["D"] && xSpeed < 10){
            xSpeed += 2;
        }

        if(!userInput["A"] && !userInput["D"] && xSpeed !== 0){
            xSpeed += xSpeed > 0 ? -1 : 1;
        }

        y++;
        if(userInput["W"] && playerColliding()){
            ySpeed = -12;
        }
        y--;

        x += xSpeed;
        if(playerColliding()){
            while (playerColliding()){
                x -= xSpeed/Math.abs(xSpeed);
            }
            xSpeed = 0;
        }

        y += ySpeed++;
        if(playerColliding()){
            ySpeed = ySpeed/Math.abs(ySpeed);
            while (playerColliding()){
                y -= ySpeed;
            }
            ySpeed = 0;
        }

        if(playerTouchingHazard()){
            x = 300;
            y = 300;
        }

        render()
        ctx.font = "25px Monospace";
        ctx.fillStyle = "Yellow";
        ctx.fillText("Profile game in development, [WASD] to move", 25, 575);

        await wait(25);
    }
}

const wait = (time) => {
    return new Promise((r) => setTimeout(r, time));
}

const drawPoint = (x, y, size) => {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2); // Circle with radius 2
    ctx.fillStyle = "white";
    ctx.fill();
}

const drawTerrain = () => {
    for(let i = 0; i < terrain.length; i++){
        drawTerrainPart(terrain[i]);
    }
}

const drawHazards = () => {
    for(let i = 0; i < hazards.length; i++){
        drawHazard(hazards[i]);
    }
}

const drawPlayer = () => {
    if(x < 600){
        ctx.drawImage(playerImage, x - playerSize/2, 300 - playerSize/2, playerSize, playerSize);
    }else if(x > maxRight - 600){
        ctx.drawImage(playerImage, (1200 - maxRight + x) - playerSize/2, 300 - playerSize/2, playerSize, playerSize);
    }else{
        ctx.drawImage(playerImage, 600 - playerSize/2, 300 - playerSize/2, playerSize, playerSize);

    }
    //ctx.drawImage(playerImage, x - playerSize/2, y - playerSize/2, playerSize, playerSize);
}

const drawTerrainPart = (part) => {
    let index = 0;
    if(part.top !== null){
        for(let g = part.top; g < (part.bottom !== null ? part.bottom : minHeight); g += 50){
            for(let i = part.left; i < part.right; i += 50){
                if(x < 600){
                    ctx.drawImage(part.texture[(Math.floor(i/50) % Math.sqrt(part.texture.length)) + Math.sqrt(part.texture.length) * (Math.floor(g/50) % Math.sqrt(part.texture.length))], i, g-y+300, 50, 50);
                }else if(x > maxRight - 600){
                    ctx.drawImage(part.texture[(Math.floor(i/50) % Math.sqrt(part.texture.length)) + Math.sqrt(part.texture.length) * (Math.floor(g/50) % Math.sqrt(part.texture.length))], (1200 - maxRight + i), g-y+300, 50, 50);
                }else{
                    ctx.drawImage(part.texture[(Math.floor(i/50) % Math.sqrt(part.texture.length)) + Math.sqrt(part.texture.length) * (Math.floor(g/50) % Math.sqrt(part.texture.length))], i-x+600, g-y+300, 50, 50);
                }

                if(index > Math.sqrt(part.texture.length)){
                    index = 0;
                }
            }
        }
    }
}

const drawHazard = (part) => {
    if(x < 600){
        ctx.drawImage(part.texture, part.x - part.size/2, part.y-y+300 - part.size, part.size, part.size);
    }else if(x > maxRight - 600){
        ctx.drawImage(part.texture, (1200 - maxRight + part.x) - part.size/2, part.y-y+300 - part.size, part.size, part.size);
    }else{
        ctx.drawImage(part.texture, part.x-x+600 - part.size/2, part.y-y+300 - part.size, part.size, part.size);
    }
}

const playerColliding = () => {
    let colliding = false;
    for (let i = 0; i < terrain.length; i++){
        let part = terrain[i];
        if(part.top !== null){
            if(part.bottom !== null){
                colliding = (x + 25 > part.left && !(x + 25 > part.right) || x - 25 < part.right && !(x - 25 < part.left)) && (y + 25 > part.top && !(y + 25 > part.bottom) || y - 25 < part.bottom && !(y - 25 < part.top));
            }else{
                colliding = (x + 25 > part.left && !(x + 25 > part.right) || x - 25 < part.right && !(x - 25 < part.left)) && (y + 25 > part.top);
            }
        }

        if(colliding){
            return true;
        }
    }
    return false;
}

const playerTouchingHazard = () => {
    let colliding = false;
    for (let i = 0; i < hazards.length; i++){
        let part = hazards[i];
        colliding = Math.sqrt(Math.pow(x - part.x, 2) + Math.pow(y - part.y, 2)) < part.size/2 + playerSize/2;

        if(colliding){
            return true;
        }
    }
    return false;
}

const render = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    drawTerrain();
    drawHazards();
    drawPlayer();
}