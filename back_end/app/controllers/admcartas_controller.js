// Arquivo: app/controllers/admcartas_controller.js

const upload = require('../../config/upload_config');
// Você deve garantir que 'upload_config' exporte o middleware Multer

const getCartasModel = (app, connection) => {
    // Retorna a instância do Model
    return new app.app.models.cartas_model(connection);
};

// =================================================================
// 1. ADIÇÃO (POST) - Integração com Multer
// =================================================================

// 💡 Função auxiliar para processar o upload e executar a inserção
const addCartaGenerico = function (app, req, res, charHab, detalhesModelFn, detalhesCreator) {

    // Processa o upload do campo 'figura'
    upload.single('figura')(req, res, (err) => {

        if (err) {
            // Erro do Multer (ex: arquivo muito grande, tipo errado)
            return res.status(400).json({ msg: 'Erro no upload da figura.', error: err.message });
        }

        const dadosForm = req.body;
        // Caminho da imagem (ex: /uploads/figura-123.png) ou null
        const figuraPath = req.file ? '/uploads/' + req.file.filename : dadosForm.figura || null;

        const connection = app.database.dbconnection();
        const cartasModel = getCartasModel(app, connection); // INSTÂNCIA DO MODEL CRIADA AQUI

        const dadosCarta = {
            nome: dadosForm.nome,
            figura: figuraPath, // 👈 Usa o caminho do arquivo (ou o valor antigo/default)
            tipo: dadosForm.tipo,
            numserie: dadosForm.numserie,
            criadoPorAdm: dadosForm.criadoPorAdm,
            char_hab: charHab
        };

        // PASSO 1: Adicionar Carta Base
        cartasModel.adicionarCartaBase(dadosCarta, function (error, result) {
            if (error) {
                return res.status(500).json({ msg: 'Erro na inserção da carta base', error: error.sqlMessage });
            }

            const novoId = result.insertId;

            // PASSO 2: Preparar e inserir detalhes específicos (Personagem ou Habilidade)
            const detalhes = detalhesCreator(novoId, dadosForm);

            // Chamada ao método do Model usando .call(instância, argumentos...)
            detalhesModelFn.call(cartasModel, detalhes, function (errorDetalhes) {
                if (errorDetalhes) {
                    // ⚠️ Lógica de ROLLBACK seria ideal aqui para deletar a carta base
                    return res.status(500).json({ msg: `Erro na inserção dos detalhes.`, error: errorDetalhes.sqlMessage });
                }

                res.status(201).json({ msg: `${charHab === 1 ? 'Personagem' : 'Habilidade'} adicionada com sucesso!`, id: novoId });
            });
        });
    });
};

// --- Funções de Criação de Detalhes ---
const createPersonagemDetails = (idCard, dadosForm) => ({
    idCard: idCard,
    vida: dadosForm.vida,
    move: dadosForm.move,
    PF: dadosForm.pf,
    PM: dadosForm.pm,
    alcance: dadosForm.alcance,
    DC: dadosForm.dc,
    DA: dadosForm.da,
    DM: dadosForm.dm
});

const createHabilidadeDetails = (idCard, dadosForm) => ({
    idCard: idCard,
    restricao: dadosForm.restricao,
    texto: dadosForm.texto,
});

// Adcionando Personagem
module.exports.addPersonagem = function (app, req, res) {
    // CORREÇÃO: Passa a referência do método do Model (adicionarDetalhesPersonagem) 
    const detalhesFn = app.app.models.cartas_model.prototype.adicionarDetalhesPersonagem;
    addCartaGenerico(app, req, res, 1, detalhesFn, createPersonagemDetails);
};

// Adcionando Habilidade
module.exports.addHabilidade = function (app, req, res) {
    // CORREÇÃO: Passa a referência do método do Model (adicionarDetalhesHabilidade)
    const detalhesFn = app.app.models.cartas_model.prototype.adicionarDetalhesHabilidade;
    addCartaGenerico(app, req, res, 0, detalhesFn, createHabilidadeDetails);
};


// =================================================================
// 2. EDIÇÃO (PUT -> Agora POST nas Rotas) - Integração com Multer
// =================================================================

// 💡 Função auxiliar para processar o upload e executar a edição
const editCartaGenerico = function (app, req, res, detalhesModelFn, detalhesCreator) {

    const idCard = req.params.id;

    // Processa o upload do campo 'figura'
    upload.single('figura')(req, res, (err) => {

        if (err) {
            return res.status(400).json({ msg: 'Erro no upload da figura.', error: err.message });
        }

        const dadosForm = req.body;
        
        // --- LÓGICA FINAL DE DEFINIÇÃO DO CAMINHO DA IMAGEM ---
        let figuraPath = null;
        
        if (req.file) {
            // Caso 1: Novo arquivo enviado. Usa o novo path do Multer.
            figuraPath = '/uploads/' + req.file.filename;
        } else if (dadosForm.figura && typeof dadosForm.figura === 'string') {
            // Caso 2: Nenhum arquivo novo, mas o path antigo foi enviado no body. Usa o path antigo.
            figuraPath = dadosForm.figura;
        }
        // -----------------------------------------------------------

        const connection = app.database.dbconnection();
        const cartasModel = getCartasModel(app, connection);

        const dadosCarta = {
            nome: dadosForm.nome,
            tipo: dadosForm.tipo,
            numserie: dadosForm.numserie,
            criadoPorAdm: dadosForm.criadoPorAdm
        };

        // Inclui a figura APENAS se o caminho foi definido (novo arquivo ou path antigo válido)
        if (figuraPath) {
            dadosCarta.figura = figuraPath;
        }

        const detalhes = detalhesCreator(idCard, dadosForm);

        // PASSO 1: Atualizar Carta Base
        cartasModel.atualizarCartaBase(idCard, dadosCarta, function (error) {
            if (error) {
                return res.status(500).json({ msg: 'Erro ao atualizar carta base', error: error.sqlMessage });
            }

            // PASSO 2: Atualizar Detalhes
            detalhesModelFn.call(cartasModel, idCard, detalhes, function (errorDetalhes) {
                if (errorDetalhes) {
                    return res.status(500).json({ msg: 'Erro ao atualizar detalhes.', error: errorDetalhes.sqlMessage });
                }

                res.status(200).json({ msg: `Carta ID ${idCard} editada com sucesso!` });
            });
        });
    });
};

// Editando Personagem
module.exports.editPersonagem = function (app, req, res) {
    // CORREÇÃO: Passa a referência do método do Model
    const detalhesFn = app.app.models.cartas_model.prototype.atualizarDetalhesPersonagem;
    editCartaGenerico(app, req, res, detalhesFn, (idCard, dadosForm) => ({
        vida: dadosForm.vida,
        move: dadosForm.move,
        PF: dadosForm.pf,
        PM: dadosForm.pm,
        alcance: dadosForm.alcance,
        DC: dadosForm.dc,
        DA: dadosForm.da,
        DM: dadosForm.dm
    }));
};

// Editando Habilidade
module.exports.editHabilidade = function (app, req, res) {
    // CORREÇÃO: Passa a referência do método do Model
    const detalhesFn = app.app.models.cartas_model.prototype.atualizarDetalhesHabilidade;
    editCartaGenerico(app, req, res, detalhesFn, (idCard, dadosForm) => ({
        restricao: dadosForm.restricao,
        texto: dadosForm.texto,
    }));
};

// =================================================================
// 3. EXCLUSÃO (DELETE) - Mantém a lógica existente
// =================================================================

// 💡 Lógica de exclusão mantém-se simples, mas você pode querer deletar o arquivo do disco aqui!
module.exports.deleteCarta = function (app, req, res) {
    const idCard = req.params.id;
    const connection = app.database.dbconnection();
    const cartasModel = getCartasModel(app, connection);

    // 💡 Para ser completo, antes de deletar a linha, você deveria buscar
    // o caminho da 'figura' e usar 'fs.unlink' para deletar o arquivo do disco.

    cartasModel.deletarCarta(idCard, function (error, result) {
        if (error) {
            res.status(500).json({ msg: 'Erro ao deletar carta', error: error.sqlMessage });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ msg: `Carta ID ${idCard} não encontrado ou já deletado.` });
        } else {
            res.status(200).json({ msg: `Carta ID ${idCard} deletado com sucesso.` });
        }
    });
};