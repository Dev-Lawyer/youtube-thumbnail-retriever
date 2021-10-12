/*
    Esta é uma rota para o módulo do youtube-thumbnail. Ele traz métodos
    para buscar ou enviar dados. No caso, ele tem aqui um método "get", que
    permite que uma solicitação seja feito ao programa em um endereço como
    "www.seuservidor.com/api/youtube-thumbnail/?channelId=id_do_canal&videoId=id_do_video" 
    e com isso a função get faz uma chamada para a função "getYTThumbnail", que foi
    importada ali do outro arquivo em modules/youtube-thumbnail/main.js
*/
const ytthumbnail = require("express").Router();
const mainfunctions = require("../modules/youtube-thumbnail/main");

let counter = 0;

ytthumbnail.get('/youtube-thumbnail', (req, res, next) => {
    res.header('Pragma', 'no-cache');
    res.header('Content-Type', 'image/svg+xml');
    res.header('Expires', '0');
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    mainfunctions.getYTThumbnail(req.query.channelId, req.query.videoId).then(result => {
        res.send(result);
    }).catch(error => {
        console.log(`Erro: ${error}`);
    });
});

module.exports = ytthumbnail;