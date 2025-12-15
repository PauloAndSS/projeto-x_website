module.exports = function (app) {
    //adcionar

    app.post('/decks/add', function (req, res) {
        app.app.controllers.admdecks_controller.addDeck(app, req, res);
    });

    //editar

    app.put('/decks/edit/:id', function (req, res) {
        app.app.controllers.admdecks_controller.editDeck(app, req, res);
    });

    //deletar

    app.delete('/decks/delete/:id', function (req, res) {
        app.app.controllers.admdecks_controller.deleteDeck(app, req, res);
    });

    // =================================================================
    // Manipulação das cartas do deck
    // =================================================================

    //add cartas

    app.post('/decks/:id/list/addCarta', function(req,res){
        app.app.controllers.admdecks_controller.adicionarCartasAoDeck(app,req,res);
    });

    //uptade quantidades

    app.put('/decks/:id/list/updateCartaQuant', function(req,res){
        app.app.controllers.admdecks_controller.atualizarQuantidadeCarta(app,req,res);
    });

    //deletar carta do deck

    app.delete('/decks/:id/list/delete/:idCarta', function(req,res){
        app.app.controllers.admdecks_controller.deletarCartaDoDeck(app,req,res);
    });
}