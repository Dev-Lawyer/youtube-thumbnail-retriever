const app = require("./app");
const routes = require("./routes/routes");
app.use("/", routes);
app.listen(3000, function() {
    console.log("Server started. Go to http://localhost:3000/");
});