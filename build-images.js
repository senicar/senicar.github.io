const fs = require('fs');
const through = require('through2');
const ExifParser = require('exif-parser');
const { src, dest } = require('gulp');
const sizeOf = require('image-size');
const path = require('path');
const sharp = require('sharp');
const child_process = require('child_process');

const images = [];

function readImages() {
    let srcGlobs = ['./src/assets/images/**/*']

    return src(srcGlobs, {base: "./src/assets/images"})
    .pipe(createMetadata())
    .pipe(dest('./thumbs'))
    .on('end', () => {
        createJson();
    });
}

function createMetadata() {
    const stream = through.obj(function(file, encoding, callback) {
        if(file.isNull()) {
            return callback(null, file);
        }

        if(file.isBuffer()) {
            const dimensions = sizeOf(file.path)
            const imgbuffer = fs.readFileSync(file.path);
            const parser = ExifParser.create(imgbuffer);
            const img = parser.parse();
            images.push({
                width: dimensions.width,
                height: dimensions.height,
                filename: path.basename(file.path)
            });

            sharp(file.path)
                .resize({width: 400})
                .toFile(`./src/assets/thumbs/${path.basename(file.path)}`);

            return callback(null, file);
        }
    });

    return stream;
}

function createJson() {
    let itemsTemplates = [];

    for(let index in images) {
        let img = images[index];
        itemsTemplates.push(`{
    "width": "${img.width}px",
    "height": "${img.height}px",
    "src": "${img.filename}"
}`);
    }

    let imagesStream = fs.createWriteStream('./src/assets/images.json');
    imagesStream.write(`[${itemsTemplates.join(',\n')}]`);
    imagesStream.end();
}

//child_process.execSync('rm -f -R src/assets/thumbs/*', {stdio: 'inherit'});

readImages();