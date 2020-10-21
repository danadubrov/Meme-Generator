'use strict';

const gImgNumber = 17;
var gImgs = [];

createImgs();

var gMeme = {
    selectedImgId: 'img2',
    selectedLineIdx: 1,

    lines: [
        {
            txt: 'hav hav',
            size: 55,
            align: 'center',
            color: 'white',
            font: 'IMPACT',
            x: 250,
            y: 50
        },
        {
            txt: 'miew',
            size: 55,
            align: 'center',
            color: 'white',
            font: 'IMPACT',
            x: 250,
            y: 400
        }
    ]
}


function getMeme() {
    return gMeme;
}

// function getImgUrl() {
//     var id = gMeme.selectedImgId;
//     var img = gImgs.find(img => id === img.id);
//     return img.url;
// }


function changeTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt;
}

function selectImg(imgId) {
    gMeme.selectedImgId = imgId;
}

function changeFontSize(dif) {
    gMeme.lines[gMeme.selectedLineIdx].size += dif;
}

function changeFontFamily(font) {
    gMeme.lines[gMeme.selectedLineIdx].font = font;
}

function moveLine(dif) {
    gMeme.lines[gMeme.selectedLineIdx].y += dif;
}


function setAlignment(align) {
    gMeme.lines[gMeme.selectedLineIdx].align = align;
}


function switchLine() {
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) {
        gMeme.selectedLineIdx = 0;
        return;
    }
    gMeme.selectedLineIdx++;
}

function addLine() {
    var line = {
        txt: '',
        size: 55,
        align: 'center',
        color: 'white',
        font: 'IMPACT',
        x: 250,
        y: 250
    };

    gMeme.lines.push(line);
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function createImgs() {
    for (var i = 1; i <= gImgNumber; i++) {
        gImgs.push(createImg(i));
    }
}

function createImg(i) {
    return { id: `img${i}`, url: `imgs/img${i}.jpg` };
}

function getImgs() {
    return gImgs;
}