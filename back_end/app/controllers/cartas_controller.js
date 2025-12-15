const getCartasModel = (app, connection) => {
    // Retorna a instância do Model, usando o nome 'cartas_model' conforme a sua estrutura.
    return new app.app.models.cartas_model(connection);
};

module.exports.todascartas = function(app,req,res){
    const connection = app.database.dbconnection();
    const cartasModel = getCartasModel(app, connection);

    cartasModel.getCartas(function(error, result){
        if (error) {
            console.error('Erro ao buscar notícia:', error);
            res.status(500).json({ msg: 'Erro interno do servidor', error: error.sqlMessage || error.message });
        }else{
            res.status(200).json({ cartas: result });
        }
    });
}

module.exports.habilidade = function(app, req, res) {
    const idCard = req.params.id;
    const connection = app.database.dbconnection();
    const cartasModel = getCartasModel(app, connection);

    cartasModel.getHabilidadePorId(idCard, function(error, result) {
        if (error) {
            res.status(500).json({ msg: 'Erro ao buscar habilidade', error: error.sqlMessage });
        }else if (result.length === 0) {
            res.status(404).json({ msg: `Habilidade ID ${idCard} não encontrada.` });
        }else{
            res.status(200).json({ habilidade: result[0] });
        }
    });
};

module.exports.personagem = function(app, req, res) {
    const idCard = req.params.id;
    const connection = app.database.dbconnection();
    const cartasModel = getCartasModel(app, connection);

    cartasModel.getPersonagemPorId(idCard, function(error, result) {
        if (error) {
            res.status(500).json({ msg: 'Erro ao buscar personagem', error: error.sqlMessage });
        }else if (result.length === 0) {
            res.status(404).json({ msg: `Personagem ID ${idCard} não encontrado.` });
        }else{
            res.status(200).json({ personagem: result[0] });
        }
    });
};

module.exports.personagens = function(app, req, res){
    const connection = app.database.dbconnection();
    const cartasModel = getCartasModel(app, connection);

    cartasModel.getTodosPersonagens(function(error, result){
        if (error) {
            console.error('Erro ao buscar personagens:', error);
            res.status(500).json({ msg: 'Erro interno ao buscar personagens', error: error.sqlMessage || error.message });
        }else{
            res.status(200).json({ personagens: result });
        }
    });
}

module.exports.habilidades = function(app, req, res){
    const connection = app.database.dbconnection();
    const cartasModel = getCartasModel(app, connection);

    cartasModel.getTodasHabilidades(function(error, result){
        if (error) {
            console.error('Erro ao buscar habilidades:', error);
            res.status(500).json({ msg: 'Erro interno ao buscar habilidades', error: error.sqlMessage || error.message });
        }else{
            res.status(200).json({ habilidades: result });
        }
    });
}