const getDecksModel = (app, connection) => {
    return new app.app.models.decks_model(connection);
};

//Adcionando Deck
module.exports.addDeck = function (app, req, res) {
    const dadosForm = req.body;
    const connection = app.database.dbconnection();
    const decksModel = getDecksModel(app, connection);

    const dadosDeck = {
        nome: dadosForm.nome,
        idCard_main: dadosForm.descricao,
        idUsuario: dadosForm.idUsuario
    };

    decksModel.adicionarDeckBase(dadosDeck, function (error, result) {
        if (error) {
            console.error('Erro ao adicionar deck base:', error);
            res.status(500).json({ msg: 'Erro na criação do deck base', error: error.sqlMessage || error.message });
        } else {
            res.status(201).json({ msg: 'Deck base criado com sucesso!', id: result.id });
        }
    });
};

//Editando Deck
module.exports.editDeck = function (app, req, res) {
    const idDeck = req.params.id;
    const dadosForm = req.body;
    const connection = app.database.dbconnection();
    const decksModel = getDecksModel(app, connection);

    const dadosDeck = {
        nome: dadosForm.nome,
        idCard_main: dadosForm.idCard_main
    };

    decksModel.atualizarDeckBase(idDeck, dadosDeck, function (error, result) {
        if (error) {
            console.error('Erro ao editar deck:', error);
            res.status(500).json({ msg: 'Erro na atualização do deck', error: error.sqlMessage || error.message });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ msg: `Deck ID ${idDeck} não encontrado.` });
        } else {
            res.status(200).json({ msg: `Deck ID ${idDeck} atualizado com sucesso!` });
        }
    });
};

//Deletando Deck
module.exports.deleteDeck = function (app, req, res) {
    const idDeck = req.params.id;
    const connection = app.database.dbconnection();
    const decksModel = getDecksModel(app, connection);

    decksModel.deletarDeck(idDeck, function (error, result) {
        if (error) {
            console.error('Erro ao deletar deck:', error);
            res.status(500).json({ msg: 'Erro na exclusão do deck', error: error.sqlMessage || error.message });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ msg: `Deck ID ${idDeck} não encontrado ou já deletado.` });
        } else {
            res.status(200).json({ msg: `Deck ID ${idDeck} deletado com sucesso.` });
        }
    });
};

// =================================================================
// Manipulação das cartas do deck
// =================================================================
module.exports.adicionarCartasAoDeck = function (app, req, res) {
    const idDeck = req.params.id;
    const { idCard, Quant } = req.body;

    if (!idCard || !Quant || Quant <= 0) {
        return res.status(400).json({ msg: 'É necessário fornecer idCard e Quantidade (maior que zero).' });
    }

    const connection = app.database.dbconnection();
    const decksModel = getDecksModel(app, connection);

    decksModel.adicionarCartaAoDeck(idDeck, idCard, Quant, function (error, result) {
        if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                res.status(409).json({ msg: `A Carta ID ${idCard} já existe no Deck ID ${idDeck}. Use PUT para atualizar a quantidade.`, error: error.sqlMessage });
            } else {
                res.status(500).json({ msg: 'Erro ao adicionar carta ao deck.', error: error.sqlMessage });
            }
        } else {
            res.status(201).json({ msg: `Carta ID ${idCard} adicionada ao Deck ID ${idDeck} com quantidade ${Quant}.` });
        }
    });
};

module.exports.atualizarQuantidadeCarta = function (app, req, res) {
    const idDeck = req.params.id;
    const { idCard, Quant } = req.body;

    if (!idCard || typeof Quant !== 'number' || Quant < 0) {
        res.status(400).json({ msg: 'É necessário fornecer idCard e Quantidade (maior ou igual a zero).' });
    } else {
        const connection = app.database.dbconnection();
        const decksModel = getDecksModel(app, connection);

        decksModel.atualizarQuantidade(idDeck, idCard, Quant, function (error, result) {
            if (error) {
                res.status(500).json({ msg: 'Erro ao atualizar quantidade da carta.', error: error.sqlMessage });
            }else if (result.affectedRows === 0) {
                res.status(404).json({ msg: `Carta ID ${idCard} não encontrada no Deck ID ${idDeck}.` });
            }else {
                res.status(200).json({ msg: `Quantidade da Carta ID ${idCard} atualizada para ${Quant} no Deck ID ${idDeck}.` });
            }
        });
    }
};

module.exports.deletarCartaDoDeck = function (app, req, res) {
    const idDeck = req.params.id;
    const idCard = req.params.idCarta;

    const connection = app.database.dbconnection();
    const decksModel = getDecksModel(app, connection);

    decksModel.deletarCartaDoDeck(idDeck, idCard, function (error, result) {
        if (error) {
            res.status(500).json({ msg: 'Erro ao deletar carta do deck.', error: error.sqlMessage });
        }else if (result.affectedRows === 0) {
            res.status(404).json({ msg: `Carta ID ${idCard} não encontrada no Deck ID ${idDeck} para exclusão.` });
        }else{
            res.status(200).json({ msg: `Carta ID ${idCard} removida com sucesso do Deck ID ${idDeck}.` });
        }
    });
};