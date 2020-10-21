var gCanvas;
var gCtx;

function onInit() {
    renderGallery();
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    drawMeme()
}

function drawMeme() {
    const meme = getMeme();
    drawImg();
    showFocus();

    meme.lines.forEach(line => {
        const txt = line.txt;
        const y = line.y;
        const fontSize = line.size;
        const fontFamily = line.font;
        const align = line.align;

        drawText(txt, 250, y, fontSize, fontFamily, align);
    });
}

function drawImg() {
    const meme = getMeme();
    const imgId = meme.selectedImgId;
    console.log(imgId);
    var elImg = document.querySelector(`.${imgId}`);
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);
}

function drawText(txt, x, y, fontSize, fontFamily, align) {
    gCtx.textBaseline = "top";
    gCtx.strokeStyle = 'black';
    gCtx.fillStyle = 'white';
    gCtx.lineWidth = '2';
    gCtx.font = `${fontSize}px ${fontFamily}`;
    gCtx.textAlign = align;
    gCtx.fillText(txt, x, y);
    gCtx.strokeText(txt, x, y);
}

function onChangeTxt() {
    const txt = document.querySelector('[name=meme-text]').value;
    changeTxt(txt);
    drawMeme();
}

function onSelectImg(imgId) {
    selectImg(imgId);
    drawMeme();
}

function onFontSize(dif) {
    changeFontSize(dif);
    drawMeme();
}

function onFontFamily(font) {
    changeFontFamily(font);
    drawMeme();
}

function onMoveLine(dif) {
    moveLine(dif);
    drawMeme();
}

function onSetAlignment(align) {
    setAlignment(align);
    drawMeme();
}

function onSwitchLine() {
    switchLine();
    drawMeme();
    document.querySelector('[name=meme-text]').value = '';
}

function onAddLine() {
    addLine();
    drawMeme();
}

function showFocus() {
    const meme = getMeme();
    const line = meme.lines[meme.selectedLineIdx];
    const focusHeight = line.size + 20;
    const y = line.y - 10;

    gCtx.beginPath()
    gCtx.rect(5, y, gCanvas.width - 10, focusHeight)
    gCtx.strokeStyle = 'white';
    // gCtx.lineWidth = '4';
    // gCtx.stroke()
    gCtx.fillStyle = "rgba(0, 0, 0, 0.4)";
    gCtx.fill();
}

function renderGallery() {
    const imgs = getImgs();
    const strHTMLs = imgs.map(img => {
        return `
            <div onclick="onSelectImg('${img.id}')">
            <img class="${img.id}" src= ${img.url} alt="">
            </div>
    `
    });
    document.querySelector('.grid-container').innerHTML = strHTMLs.join('');
}
