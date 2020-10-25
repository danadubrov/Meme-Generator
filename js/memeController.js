'use strict';

const STICKER_SIZE = 80;
var gCanvas;
var gCtx;

var gStartMouseX;
var gStartMouseY;
var gDrag = {
    isDrag: false,
    isLine: false,
    isSticker: false
}

function onInit() {
    renderGallery();
    gCanvas = document.querySelector('#my-canvas');
    gCtx = gCanvas.getContext('2d');
    loadSavesMemes();
    renderKeywords();

    gCanvas.addEventListener("touchmove", ev => {
        ev.preventDefault();
        ev.stopImmediatePropagation();
    }, true);
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
        const stroke = line.stroke;

        drawText(txt, x, y, fontSize, fontFamily, align, color, stroke);
    });

    meme.stickers.forEach(sticker => {
        gCtx.drawImage(sticker.el, sticker.x, sticker.y, STICKER_SIZE, STICKER_SIZE);
    })
}

function drawImg() {
    const meme = getMeme();
    const imgId = meme.selectedImgId;
    var elImg = document.querySelector(`.${imgId}`);
    gCtx.drawImage(elImg, 0, 0, gCanvas.width, gCanvas.height);
}

function drawText(txt, x, y, fontSize, fontFamily, align, color, stroke) {
    gCtx.textBaseline = "top";
    gCtx.strokeStyle = stroke;
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
    document.querySelector('.keywords').style.display = 'none';
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
    document.querySelector('.keywords').style.display = 'block';
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
    renderKeywords();
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

    const stickerIdx = meme.stickers.findIndex(sticker => {
        return (x > sticker.x && x < (sticker.x + STICKER_SIZE) && y > sticker.y && y < (sticker.y + STICKER_SIZE))
    })
    console.log(stickerIdx)
    if (lineIdx >= 0 || stickerIdx >= 0) {
        gStartMouseX = ev.offsetX;
        gStartMouseY = ev.offsetY;
        gDrag.isDrag = true;
        if (lineIdx >= 0) {
            gDrag.isLine = true;
            switchLine(lineIdx);
        }
        if (stickerIdx >= 0) {
            gDrag.isSticker = true;
            selectSticker(stickerIdx);
        }
        drawMeme();
        showLineFocus();
    }
}

function onDrag(ev) {
    if (!gDrag.isDrag) return;
    console.log('dragging')

    var currMouseX = ev.offsetX;
    var currMouseY = ev.offsetY;

    var disX = currMouseX - gStartMouseX;
    var disY = currMouseY - gStartMouseY;

    if (gDrag.isSticker) moveSticker(disX, disY);
    if (gDrag.isLine) moveLine(disX, disY);
    drawMeme();
    showLineFocus();

    gStartMouseX = currMouseX;
    gStartMouseY = currMouseY;
}

function onStopDrag() {
    gDrag.isDrag = false;
    gDrag.isLine = false;
    gDrag.isSticker = false;
}

function onDrawSticker(el) {
    gCtx.drawImage(el, gCanvas.width / 2, gCanvas.height / 2, STICKER_SIZE, STICKER_SIZE);
    addSticker(el, gCanvas.width / 2, gCanvas.height / 2, STICKER_SIZE);
    console.log(el.src)
}

function renderKeywords() {
    const keywords = getKeywords();
    const strHTMLs = keywords.map(keyword => {
        var size = (keyword.count > 25) ? 60 : keyword.count * 3;
        return `
            <span style="font-size:${size}px;" onclick="onSetFilter('${keyword.word}')"> ${keyword.word}  </span>
    `
    });
    document.querySelector('.keywords').innerHTML = strHTMLs.join('');
}