/*
      Esse módulo faz as operações necessárias para baixarmos as informações do YouTube e popularmos 
      o nosso template. 

      Basicamente é feita uma chamada para a função getYTThumbnail com um parâmetro, que é o videoID. 

      Peço desculpas a todos, mas tirei como parâmetro o channelId, pois caso contrário todos poderiam
      utilizar essa API e os limites de tráfego no servidor poderiam ficar comprometidos. Acabei deixando
      o channelID "hardcoded" abaixo, mas em princípio você pode deixá-lo como parâmetro também
      
      Sugiro e incentivo que criem a mesma estrutura no seu próprio servidor 😃

      Com o ID do vídeo, filtramos o resultado acima até conseguir achar a correspondência.
*/

const https = require('https');
const request = require('request');
const channelId = "UCPmM6RAkfC0CY2gGudIhWQA";
let videoTitle = "";
let videoViews = "";
let videoPublishedDate;

// vamos exportar a função que baixa o XML do YouTube
module.exports = {
    getYTThumbnail
}

/*
    Esta função baixa o XML do YouTube e usa as informações de vídeo para montar
    o SVG que irá mostrar o resultado final que buscamos. Note que como temos que fazer
    uma solicitação ao servidor do YouTube e aguardar a resposta, não teremos os dados
    de imediato. Nesses casos, usamos uma "Promise" que simplesmente faz um pedido ao servidor
    e tenta retornar com o resultado. Se o resultado volta, aí damos andamento aos demais passos.

    No nosso caso específico, exportamos essa função que retorna uma "Promise" aqui e é importada
    lá na route (routes/youtube-thumbnail.js). Na route, ele chama essa função aqui que foi exportada
    tratando como uma Promise: faz a chamada e aguarda o resultado (com o .then()). Se a Promise retornar 
    com sucesso, ele envia os dados para a reposta com res.send(). Caso contrário, teremos um erro.
*/
function getYTThumbnail(videoId) {
    return new Promise((resolve, reject) => {
        https.get('https://www.youtube.com/feeds/videos.xml?channel_id=' + channelId, (res) => {
            let data = '';
            let finalxml = '';
            if (res.statusCode == 200) {
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        getXMLData(data, videoId);
                        // Precisamos fazer o request abaixo para baixar a imagem do YouTube e convertê-la para base64, já que o Markdown não 
                        // está aceitando a imagem por URL simples
                        request.get({ url: "https://i.ytimg.com/vi/" + videoId + "/mqdefault.jpg", encoding: null }, (err, res, body) => {
                            if (!err) {
                                const type = res.headers["content-type"];
                                const prefix = "data:" + type + ";base64,";
                                const base64 = body.toString('base64');
                                const videoThumbnail = prefix + base64;
                                finalxml = `
                      <svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width="250" height="220" viewBox="0 0 250 220" fill="none" id="svgfile">
                        <style>
                          @import url('https://fonts.googleapis.com/css2?family=Roboto');
                        </style>
                        <defs>
                          <clipPath id="image-clip">
                            <use xlink:href="#rect"/>
                          </clipPath>
                        </defs>
                        <!-- Retângulo container -->
                        <rect id="rect" height="100%" width="100%" fill="#F9F9F9" />
                        <!-- Thumbnail -->
                        <g>
                          <image href="${videoThumbnail}" id="videoThumbnail" height="140" width="250"/>
                        </g>
                        <!-- Título do vídeo -->
                        <g transform="translate(0, 135)">
                          <!-- 
                            Usamos aqui uma tag foreignObject pois ela possibilita que usemos CSS
                            dentro do SVG (usamos o estilo para esse id #videoTitle na parte de 
                            cima deste arquivo ☝️)
                          -->
                          <foreignObject width="95%" height="100%">
                            <style>
                            /*
                              Abaixo importamos a fonte utilizada no texto e definimos um 
                              estilo para o título do vídeo, que além do estilo do texto
                              devem também ser cortado na segunda linha se a ultrapassar
                            */
                            body{
                              margin:0;
                            }
                            #videoTitle{
                              color:#1a1a03;
                              font-family:Roboto, Arial, sans-serif;
                              font-weight:600;
                              font-size:15px;      
                              overflow: hidden;
                              text-overflow: ellipsis;
                              display: -webkit-box;
                              -webkit-line-clamp: 2; 
                              -webkit-box-orient: vertical;
                            }
                          </style>
                            <body xmlns="http://www.w3.org/1999/xhtml">
                            <p id="videoTitle">
                              ${videoTitle}
                            </p>
                            </body>
                          </foreignObject>
                        </g>
                        <!-- Data e visualizações -->
                        <g transform="translate(0, 210)">
                          <text fill="#606060" font-family="Roboto, Arial, sans-serif" font-weight="400" font-size="13px" id="viewsNDate">
                            ${videoViews} views • ${videoPublishedDate}
                          </text>
                        </g>
                    </svg>
                    `;
                                resolve(finalxml);
                            }
                        });

                    } catch (e) {
                        reject(e.message);
                    }
                });
            }
        }).on('error', (err) => {
            console.log("Error: " + err.message);
        });
    });
}

/*
        Esta é a função principal, que baixa as informações do YouTube 

        Basicamente o XML é baixado e:
        (i) a função procura por cada registro (marcada no XML como uma "entry");
        (ii) em cada entry, procuramos pela tag yt:videoId;
        (iii) se essa videoId for igual à videoId que recebemos neste arquivo, significa que a entrada 
        corresponde ao vídeo correto. 

        E só.
*/
function getXMLData(xmlString, videoId) {
    var DOMParser = new(require('xmldom')).DOMParser;
    var xml = DOMParser.parseFromString(xmlString);
    var entries = xml.getElementsByTagName("entry");
    var found = false;
    for (var i = 0; i < entries.length && !found; i++) {
        var entry = entries[i];
        var currentVideoId = entry.getElementsByTagName("yt:videoId");
        if (currentVideoId[0].childNodes[0].nodeValue == videoId) { // Encontramos o vídeo!
            videoTitle = entry.getElementsByTagName("title")[0].childNodes[0].nodeValue;
            var mediagroup = entry.getElementsByTagName("media:group")[0];
            var mediacommunity = mediagroup.getElementsByTagName("media:community")[0];
            var mediastats = mediacommunity.getElementsByTagName("media:statistics")[0];
            videoViews = mediastats.getAttribute('views');
            videoPublishedDate = formatDate(entry.getElementsByTagName("published")[0].childNodes[0].nodeValue);
            found = true;
        }
    }
}
/*
  Função que serve para formatar uma data recebida no formato UTC (e.g. 2020-05-25T04:00:00Z)
  Para uma data mais amigável para leitura humana.

  Código original acessado em https://css-tricks.com/how-to-convert-a-date-string-into-a-human-readable-format/

  Note que para locale pt-BR não conseguimos formatar a data "long" corretamente
*/
function formatDate(dateString) {
    const options = {
        year: "numeric",
        month: "short",
        day: "numeric"
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}