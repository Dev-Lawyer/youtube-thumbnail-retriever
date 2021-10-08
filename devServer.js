/*
   Este arquivo permite rodarmos o nosso programa de forma local.

   Para fazer isso, digite no terminal dentro da pasta deste programa:]

   npm run dev

   Após, basta acessar o programa no endereço http://localhost:3000/ 
   de qualquer navegador.

*/

const app = require("./app");
const routes = require("./routes/routes");
app.use("/", routes);
app.listen(3000, function() {
    console.log("Server started. Go to http://localhost:3000/");
});