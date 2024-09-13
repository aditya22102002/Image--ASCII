const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
let cellSize = 5;
const image1 = new Image();
image1.src = '';

const resolution = document.getElementById('resolution');
const image = document.getElementById('image');
resolution.addEventListener('change', (e) => {
    cellSize = parseInt(e.target.value);
    document.querySelectorAll('div label')[0].innerHTML =
        'Resolution ' + cellSize;
    init();
});
image.addEventListener('change', (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener(
        'load',
        () => {
            image1.src = reader.result;
        },
        false
    );

    if (file) {
        image1.src = reader.readAsDataURL(file);
    }
    init();
});

function mapSymbol(avg) {
    if (avg > 240) return '@';
    else if (avg > 220) return '$';
    else if (avg > 180) return '#';
    else if (avg > 160) return '%';
    else if (avg > 140) return 'W';
    else if (avg > 120) return 'l';
    else if (avg > 100) return 'c';
    else if (avg > 80) return '+';
    else if (avg > 60) return '_';
    else if (avg > 40) return '.';
    else return '';
}

function init() {
    if (image1.height) {
        ctx.drawImage(image1, 0, 0);
        draw();
    }
    image1.addEventListener('load', () => {
        canvas.width = image1.width;
        canvas.height = image1.height;
        ctx.drawImage(image1, 0, 0);

        draw();
    });
}

function draw() {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let imageCellArray = [];
    for (let i = 0; i < canvas.height; i += cellSize) {
        for (let j = 0; j < canvas.width; j += cellSize) {
            let posX = j * 4;
            let posY = i * 4;
            let pos = posY * canvas.width + posX;
            let alpha = pixels.data[pos + 3];
            let red = pixels.data[pos];
            let green = pixels.data[pos + 1];
            let blue = pixels.data[pos + 2];
            let avg = (red + green + blue) / 3;
            let col = 'rgb(' + red + ',' + green + ',' + blue + ')';
            imageCellArray.push([j, i, mapSymbol(avg), col]);
        }
    }
    // console.log(imageCellArray);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageCellArray.length; i++) {
        ctx.fillStyle = imageCellArray[i][3];
        ctx.fillText(
            imageCellArray[i][2],
            imageCellArray[i][0],
            imageCellArray[i][1]
        );
    }
}

init();
