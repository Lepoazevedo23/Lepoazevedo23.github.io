const fs = require("fs");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Rota para registrar as vendas
app.post("/pagamento", (req, res) => {
    console.log("Pedido recebido:", req.body);

    fs.appendFile("vendas.json", JSON.stringify(req.body, null, 2) + ",\n", (err) => {
        if (err) {
            console.error("Erro ao salvar venda:", err);
            return res.status(500).send({ mensagem: "Erro ao salvar venda" });
        }
        res.status(200).send({ mensagem: "Compra processada com sucesso!" });
    });
});

// 📌 Rota para visualizar vendas no navegador
app.get("/vendas", (req, res) => {
    fs.readFile("vendas.json", "utf8", (err, data) => {
        if (err) return res.status(500).send("Erro ao carregar vendas.");
        res.send("<pre>" + data + "</pre>");
    });
});

// Servir os arquivos estáticos (HTML, CSS e JS)
app.use(express.static(__dirname));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
