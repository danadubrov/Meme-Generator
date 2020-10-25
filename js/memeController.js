'use strict';

var gCanvas;
var gCtx;

var gStartMouseX;
var gStartMouseY;
var gIsDrag = false;

function onInit() {
    renderGallery();
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    loadSavesMemes();
}

function drawMeme() {
    const meme = getMeme();
    drawImg();

    meme.lines.forEach(line => {
        const txt = line.txt;
        const y = line.y;
        const x = line.x;
        const fontSize = line.size;
        const fontFamily = line.font;
        const align = line.align;
        const color = line.color;

        drawText(txt, x, y, fontSize, fontFamily, align, color);
    });
}

function drawImg() {
    const meme = getMeme();
    const imgId = meme.selectedImgId;
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
    showLineFocus()
}

function onSelectImg(imgId) {
    selectImg(imgId);
    drawMeme();
    showLineFocus()
    showEditor();
}

function onFontSize(dif) {
    changeFontSize(dif);
    drawMeme();
    showLineFocus()
}

function onFontFamily(font) {
    changeFontFamily(font);
    drawMeme();
    showLineFocus()
}

function onMoveLine(dif) {
    moveLine(dif);
    drawMeme();
    showLineFocus()
}

function onSetAlignment(align) {
    setAlignment(align);
    drawMeme();
    showLineFocus()
}

function onSwitchLine() {
    switchLine();
    drawMeme();
    showLineFocus()
    inputFocus();
}

function onAddLine() {
    addLine(gCanvas.width, gCanvas.height);
    drawMeme();
    showLineFocus()
    inputFocus();
}

function onDeleteLine() {
    deleteLine();
    drawMeme();
    showLineFocus()
    inputFocus();
}

function onChangeColor(color) {
    changeColor(color);
    drawMeme();
    showLineFocus()
}

function showLineFocus() {
    const meme = getMeme();
    const line = meme.lines[meme.selectedLineIdx];
    const focusHeight = line.size + 20;
    const y = line.y - 10;

    gCtx.beginPath()
    gCtx.rect(5, y, gCanvas.width - 10, focusHeight)
    gCtx.strokeStyle = 'rgba(255, 152, 38)';
    gCtx.lineWidth = '4';
    gCtx.stroke()
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
    document.querySelector('#gallery-container').innerHTML = strHTMLs.join('');
}

function renderMemes() {
    showGallery();
    const memes = getSavedMemes();
    if (!memes[0]) {
        document.querySelector('.msg').style.display = 'block';
        document.querySelector('#gallery-container').innerHTML = '';
        return;
    }
    const strHTMLs = memes.map(meme => {
        return `
        <div>
        <a href="${meme}" download="myimage"><img src="${meme}"></a>
        </div>
    `
    });
    document.querySelector('#gallery-container').innerHTML = strHTMLs.join('');
}

function showGallery() {
    setFilter('');
    document.querySelector('.msg').style.display = 'none';
    renderGallery();
    document.querySelector('.search').style.display = 'block';
    document.querySelector('.editor').style.display = 'none';
    document.querySelector('.gallery').style.display = 'flex';
    document.body.classList.remove('menu-open');
    document.querySelector('.nav-gallery').classList.add('active');
    document.querySelector('.nav-memes').classList.remove('active');
}

function showMemes() {
    renderMemes();
    document.querySelector('.search').style.display = 'none';
    document.querySelector('.editor').style.display = 'none';
    document.querySelector('.gallery').style.display = 'flex';
    document.body.classList.remove('menu-open');
    document.querySelector('.nav-memes').classList.add('active');
    document.querySelector('.nav-gallery').classList.remove('active');
}

function showEditor() {
    window.addEventListener('resize', function () {
        resizeCanvas();
    })

    document.querySelector('.nav-gallery').classList.remove('active');
    document.querySelector('.editor').style.display = 'flex';
    document.querySelector('.gallery').style.display = 'none';
    resizeCanvas();
    inputFocus();
}

function inputFocus() {
    const meme = getMeme();
    const txt = meme.lines[meme.selectedLineIdx].txt;
    document.querySelector('[name=meme-text]').value = txt;
    document.querySelector('[name=meme-text]').focus();
}

function toggleMenu() {
    document.body.classList.toggle('menu-open');
}

function downloadCanvas(elLink) {
    drawMeme();
    var imgContent = gCanvas.toDataURL('image/jpeg');
    elLink.href = imgContent
}

function onSetFilter(filterBy) {
    setFilter(filterBy);
    renderGallery();
}

function onSaveMeme() {
    drawMeme();
    var imgContent = gCanvas.toDataURL('image/jpeg');
    saveMeme(imgContent);
    showMemes();
}

function onSelectLine(ev) {
    const x = ev.offsetX;
    const y = ev.offsetY;
    const meme = getMeme();

    const lineIdx = meme.lines.findIndex(line => {
        return (x > (line.x - gCtx.measureText(line.txt).width / 2) && x < (line.x + gCtx.measureText(line.txt).width / 2) && y > line.y && y < (line.y + line.size))
    })
    console.log(lineIdx);

    if (lineIdx >= 0) {
        gStartMouseX = ev.offsetX;
        gStartMouseY = ev.offsetY;
        gIsDrag = true;
        switchLine(lineIdx);
        drawMeme();
        showLineFocus();
    };
}

function onDrag(ev){
    if(!gIsDrag) return;
    console.log('dragging')

    var currMouseX = ev.offsetX;
    var currMouseY = ev.offsetY;

    var disX = currMouseX - gStartMouseX;
    var disY = currMouseY - gStartMouseY;

    moveLine(disX,disY);
    drawMeme();
    showLineFocus();

    gStartMouseX = currMouseX;
    gStartMouseY = currMouseY;
}

function onStopDrag(){
    gIsDrag = false;
}