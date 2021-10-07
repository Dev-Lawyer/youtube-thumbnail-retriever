const express = require('express');
const app = express();
const port = 3000;

/**
 * View counter variable
 * @type {number}
 */
let counter = 0;

/**
 * Return SVG code for image with text "Hits: $i"
 *
 * @param {string} text - text to be placed
 * @returns {string}
 */
function getBadge(text) {
    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="20">
             <g font-family="Verdana,DejaVu Sans,Geneva,sans-serif" font-size="11">
              <text x="0" y="14">${text}</text>
             </g>
            </svg>`;
}

app.get('/', (req, res, next) => {
    res.header('Pragma', 'no-cache');
    res.header('Content-Type', 'image/svg+xml');
    res.header('Expires', '0');
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.send(getBadge(`Hits: ${++counter}`));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});