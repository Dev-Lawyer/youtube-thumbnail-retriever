const routes = require("express").Router();

const ytthumbnail = require("./youtube-thumbnail");

routes.get("/", async function(req, res) {
    res.send(`Reached home!`);
});

routes.use("/", ytthumbnail);

module.exports = routes;