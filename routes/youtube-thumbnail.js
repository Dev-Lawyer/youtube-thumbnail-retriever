const ytthumbnail = require("express").Router();
const mainfunctions = require("../modules/youtube-thumbnail/main");

let counter = 0;

ytthumbnail.get('/youtube-thumbnail/:videoId', (req, res, next) => {
    res.header('Pragma', 'no-cache');
    res.header('Content-Type', 'image/svg+xml');
    res.header('Expires', '0');
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    mainfunctions.getYTThumbnail(req.params.videoId).then(result => {
        res.send(result);
    }).catch(error => {
        console.log(`Erro: ${error}`);
    });
});

module.exports = ytthumbnail;