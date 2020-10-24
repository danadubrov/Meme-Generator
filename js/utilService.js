'use strict';

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    // Note: changing the canvas dimension this way clears the canvas
    gCanvas.width = elContainer.offsetWidth // show width & height in CSS
    gCanvas.height = elContainer.offsetHeight

    changeLinePos(gCanvas.width, gCanvas.height);
    drawMeme();
    showLineFocus();
}
