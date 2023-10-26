export function  getSignProperties(signText, ownQuestionSign, answerSign, canvasRef, prefFontSize) {
    let shrinkFactor = 1;
    let textLen = signText.length;
    let signHeight = 1.1 * Math.pow(textLen, 1 / 2.5) / 1.9;
    let signWidth = Math.pow(textLen, 1 / 2.5) / 1.5;
    let signColor = "#880088"

    if (ownQuestionSign) {
        const canvasWidth = canvasRef.current.offsetWidth
        signHeight = 3.8
        signWidth = Math.min(5, 2.3 + canvasWidth / 300)

    }

    if (answerSign) {
        signColor = "#552255"
        const canvasWidth = canvasRef.current.offsetWidth;
        const maxHeight = 4.5;
        const maxWidth = 1.8 + canvasWidth / 200;
        if (signHeight > maxHeight) {
            shrinkFactor = shrinkFactor * signHeight / maxHeight;
            signHeight = maxHeight;
        }
        if (signWidth > maxWidth) {
            shrinkFactor = shrinkFactor * signWidth / maxWidth;
            signWidth = maxWidth;
        }
        shrinkFactor = Math.pow(shrinkFactor, 1 / 2.2)
    }

    return [signHeight, signWidth, signColor, prefFontSize / shrinkFactor];
}
 