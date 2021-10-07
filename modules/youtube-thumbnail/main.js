module.exports = {
    getBadge: function(text) {
        return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100" height="20">
          <g font-family="Verdana,DejaVu Sans,Geneva,sans-serif" font-size="11">
            <text x="0" y="14">${text}</text>
          </g>
          </svg>`;
    }
}