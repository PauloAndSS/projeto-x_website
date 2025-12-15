const getDecksModel = (app, connection) => {
    return new app.app.models.decks_model(connection);
};

module.exports.todosDecks = function (app, req, res) {
    const connection = app.database.dbconnection();
    const decksModel = getDecksModel(app, connection);

    decksModel.getTodosDecks(function (error, result) {
        if (error) {
            console.error('Erro ao buscar todos os decks:', error);
            res.status(500).json({ msg: 'Erro interno do servidor', error: error.sqlMessage || error.message });
        } else {
            res.status(200).json({ decks: result });
        }
    });
};

module.exports.deck = function (app, req, res) {
    const idDeck = req.params.id;
    const connection = app.database.dbconnection();
    const decksModel = getDecksModel(app, connection);

    decksModel.getDeckPorId(idDeck, function (error, resultDeck) {
        if (error) {
            res.status(500).json({ msg: 'Erro ao buscar deck', error: error.sqlMessage });
        } else if (resultDeck.length === 0) {
            res.status(404).json({ msg: `Deck ID ${idDeck} não encontrado.` });
        } else {
            res.status(200).json({ deck: resultDeck[0] });
        }
    });
};

module.exports.listarCartasDeck = function (app, req, res) {
    const idDeck = req.params.id;
    const connection = app.database.dbconnection();
    const decksModel = getDecksModel(app, connection);

    // PASSO 1: Verificar se o Deck ID existe
    decksModel.getDeckPorId(idDeck, function (errorDeck, resultDeck) {
        if (errorDeck) {
            console.error('Erro ao buscar deck base:', errorDeck);
            res.status(500).json({ msg: 'Erro interno ao verificar deck', error: errorDeck.sqlMessage || errorDeck.message });
        }else if (resultDeck.length === 0) {
            res.status(404).json({
                msg: `Deck ID ${idDeck} não encontrado.`,
                cartas: null
            });
        }else{
            decksModel.getCartasDoDeck(idDeck, function (errorCartas, resultCartas) {
            if (errorCartas) {
                console.error('Erro ao buscar cartas do deck:', errorCartas);
                res.status(500).json({ msg: 'Erro interno ao listar cartas', error: errorCartas.sqlMessage || errorCartas.message });
            }else if (resultCartas.length === 0) {
                res.status(200).json({
                    deckId: idDeck,
                    msg: `Deck ID ${idDeck} existe, mas está vazio.`,
                    cartas: []
                });
            } else {
                res.status(200).json({
                    deckId: idDeck,
                    cartas: resultCartas
                });
            }
        });
        }
    });
};