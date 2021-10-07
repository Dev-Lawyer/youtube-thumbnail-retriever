const app = require("../app");
const route = require("../routes/youtube-thumbnail");

app.use("/api/", route);

module.exports = app;