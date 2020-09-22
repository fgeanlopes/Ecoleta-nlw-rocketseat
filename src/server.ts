import express from "express";
const app = express();
app.get('/users', (resquest, response)=>{
    console.log("Listagem de usuários");

    response.json([
        "Gean",
        "Pedro",
        "Maria",
        "Bruna",
        "Leticia",
    ])
});
app.listen(3333);