var gCanvas;
var gCtx;

function onInit() {
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    drawMeme()
}

function drawMeme() {
    var img = new Image()
    img.src = getImgUrl();
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        drawText(getTxt(), 250, 225);
    }
}

function drawText(text, x, y) {
    gCtx.strokeStyle = 'black'
    gCtx.fillStyle = 'white'
    gCtx.lineWidth = '2'
    gCtx.font = '55px IMPACT'
    gCtx.textAlign = 'center'
    gCtx.fillText(text, x, y)
    gCtx.strokeText(text, x, y)
}

function onChangeTxt(){
    const txt = document.querySelector('[name=meme-text]').value;
    changeTxt(txt);
    drawMeme();
}

function onSelectImg(imgId){
    selectImg(imgId);
    drawMeme();
}