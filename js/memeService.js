'use strict';

const STORAGE_KEY = 'MEMES';

var gImgs = [
    { id: 'img1', url: 'imgs/img1.jpg', keywords: ['man', 'trump'] },
    { id: 'img2', url: 'imgs/img2.jpg', keywords: ['animal', 'cute', 'dog'] },
    { id: 'img3', url: 'imgs/img3.jpg', keywords: ['animal', 'cute', 'baby', 'sleep', 'dog'] },
    { id: 'img4', url: 'imgs/img4.jpg', keywords: ['animal', 'cute', 'sleep'] },
    { id: 'img5', url: 'imgs/img5.jpg', keywords: ['baby'] },
    { id: 'img6', url: 'imgs/img6.jpg', keywords: ['man', 'obama'] },
    { id: 'img7', url: 'imgs/img7.jpg', keywords: ['baby', 'funny', 'cute'] },
    { id: 'img8', url: 'imgs/img8.jpg', keywords: ['man', 'tell me more'] },
    { id: 'img9', url: 'imgs/img9.jpg', keywords: ['baby', 'evil', 'funny'] },
    { id: 'img10', url: 'imgs/img10.jpg', keywords: ['man', 'funny'] },
    { id: 'img11', url: 'imgs/img11.jpg', keywords: ['man'] },
    { id: 'img12', url: 'imgs/img12.jpg', keywords: ['man'] },
    { id: 'img13', url: 'imgs/img13.jpg', keywords: ['man', 'cheers'] },
    { id: 'img14', url: 'imgs/img14.jpg', keywords: ['man', 'what if i told'] },
    { id: 'img15', url: 'imgs/img15.jpg', keywords: ['man', 'one does not simply'] },
    { id: 'img16', url: 'imgs/img16.jpg', keywords: ['man'] },
    { id: 'img17', url: 'imgs/img17.jpg', keywords: ['man', 'putin'] },
    { id: 'img18', url: 'imgs/img18.jpg', keywords: ['toy story'] },
];

var gMeme = {
    selectedImgId: 'img2',
    selectedLineIdx: 1,

    lines: [
        {
            txt: 'line1',
            size: 40,
            align: 'center',
            color: 'white',
            font: 'IMPACT',
            x: 250,
            y: 50
        },
        {
            txt: 'line2',
            size: 40,
            align: 'center',
            color: 'white',
            font: 'IMPACT',
            x: 250,
            y: 400
        }
    ]
}

var gSavedMemes = [];

var gFilterBy = ''


function setFilter(filterBy) {
    gFilterBy = filterBy;
}

function getImgs() {
    if (gFilterBy === '') return gImgs;

    return gImgs.filter(hasKeyword);
}

function hasKeyword(image) {
    for (var i = 0; i < image.keywords.length; i++) {
        if (image.keywords[i].startsWith(gFilterBy)) return true;
    }
}

function getMeme() {
    return gMeme;
}

function loadSavesMemes() {
    gSavedMemes = loadFromStorage(STORAGE_KEY);
    if (!gSavedMemes) gSavedMemes = [];
}

function getSavedMemes() {
    return gSavedMemes;
}

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

// function moveLine(dif) {
//     gMeme.lines[gMeme.selectedLineIdx].y += dif;
// }

function moveLine(disX,disY) {
    gMeme.lines[gMeme.selectedLineIdx].x += disX;
    gMeme.lines[gMeme.selectedLineIdx].y += disY;
}


function setAlignment(align) {
    gMeme.lines[gMeme.selectedLineIdx].align = align;
}


function switchLine(idx) {
    gMeme.selectedLineIdx = idx;
    return;

    // if (gMeme.selectedLineIdx === gMeme.lines.length - 1) {
    //     gMeme.selectedLineIdx = 0;
    //     return;
    // }
    // gMeme.selectedLineIdx++;
}

function addLine(width, height) {
    var line = {
        txt: '',
        size: 55,
        align: 'center',
        color: 'white',
        font: 'IMPACT',
        x: width / 2,
        y: height / 2
    };

    gMeme.lines.push(line);
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function deleteLine() {
    if (gMeme.lines.length === 1) {
        gMeme.lines[0].txt = '';
        return;
    }
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
    console.log(gMeme.lines);
    gMeme.selectedLineIdx = 0;
}

function changeColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color;
}

function changeLinePos(width, height) {
    gMeme.lines[0].x = width / 2;

    if (gMeme.lines.length === 1) return;
    gMeme.lines[1].x = width / 2;
    gMeme.lines[1].y = height - 100;
}

function saveMeme(imgContent) {
    gSavedMemes.push(imgContent);
    saveToStorage(STORAGE_KEY, gSavedMemes);
}
