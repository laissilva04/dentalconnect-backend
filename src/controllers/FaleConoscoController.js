const express = require("express");
const router = express.Router();
const supabase = require('../config/supabaseClient');

require('dotenv').config();


router.post("/", async (req, res) => {
    const { nome, email, telefone, mensagem } = req.body;

    if (!nome || !email || !mensagem) {
        return res.status(400).json({ error: "Nome, email e mensagem são obrigatórios." });
    }

    const telefoneInt = telefone ? parseInt(telefone, 10) : null;
    if (telefone && isNaN(telefoneInt)) {
        return res.status(400).json({ error: "Telefone deve ser um número válido." });
    }

    try {
        // Usar a instância correta do Supabase client
        const { data, error } = await supabase
            .from("mensagens") 
            .insert([
                {
                    nome: nome,
                    email: email,
                    telefone: telefoneInt,
                    mensagem: mensagem,
                }
            ])
            .select();

        if (error) {
            console.error("Erro ao inserir mensagem no Supabase:", error);
            return res.status(500).json({ error: "Erro ao enviar mensagem.", details: error.message });
        }

        res.status(201).json({ success: true, message: "Mensagem enviada com sucesso!", data: data });
    } catch (err) {
        console.error("Erro inesperado no servidor:", err);
        res.status(500).json({ error: "Erro inesperado no servidor.", details: err.message });
    }
});

module.exports = router;

