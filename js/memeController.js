var gCanvas;
var gCtx;

function onInit() {
    renderGallery();
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
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
        const color = line.color;

        drawText(txt, gCanvas.width / 2, y, fontSize, fontFamily, align, color);
    });
}

function drawImg() {
    const meme = getMeme();
    const imgId = meme.selectedImgId;
    console.log(imgId);
    var elImg = document.querySelector(`.${imgId}`);
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);
}

function drawText(txt, x, y, fontSize, fontFamily, align, color) {
    gCtx.textBaseline = "top";
    gCtx.strokeStyle = 'black';
    gCtx.fillStyle = color;
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
    showEditor();
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
    addLine(gCanvas.width, gCanvas.height);
    drawMeme();
    document.querySelector('[name=meme-text]').value = '';
}

function onDeleteLine() {
    deleteLine();
    drawMeme();
}

function onChangeColor(color) {
    console.log('color changed');
    changeColor(color);
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
    gCtx.fillStyle = "rgba(250, 250, 250, 0.4)";
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

function showGallery() {
    document.querySelector('.editor').style.display = 'none';
    document.querySelector('.gallery').style.display = 'block';
    document.body.classList.remove('menu-open');
}

function showEditor() {
    document.querySelector('.editor').style.display = 'flex';
    document.querySelector('.gallery').style.display = 'none';
    resizeCanvas();
    changeLinePos(gCanvas.width, gCanvas.height);
    drawMeme();
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    console.log(elContainer);
    // Note: changing the canvas dimension this way clears the canvas
    gCanvas.width = elContainer.offsetWidth // show width & height in CSS
    gCanvas.height = elContainer.offsetHeight
}

function toggleMenu() {
    document.body.classList.toggle('menu-open');
}