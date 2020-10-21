var gImgs = [{ id: 1, url: 'img/1.jpg' }, { id: 2, url: 'img/2.jpg' }];

var gMeme = {
    selectedImgId: 2,
    selectedLineIdx: 0,

    lines: [
        {
            txt: '',
            size: 55,
            align: 'center',
            color: 'white'
        }
    ]
}


function getImgUrl() {
    var id = gMeme.selectedImgId;
    var img = gImgs.find(img => id === img.id);
    return img.url;
}

function getTxt() {
    return gMeme.lines[gMeme.selectedLineIdx].txt;
}

function changeTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt;
}

function selectImg(imgId) {
    gMeme.selectedImgId = imgId;
}