import express from 'express';

const app = express();

app.get("/", (req, res) =>{
    return res.json("Salve Mundo - NLW04!")
});

app.post("/", (req, res) => {
    // Recebeu os dados para salvar
    return res.json({message: "Os dados foram salvos com sucesso!"});
});

app.listen(3333, () => console.log("Servidor funcionando!"));