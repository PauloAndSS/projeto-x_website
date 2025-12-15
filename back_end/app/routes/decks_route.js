module.exports = function(app){
    app.get('/decks/', function(req,res){
        app.app.controllers.decks_controller.todosDecks(app,req,res);
    });

    app.get('/decks/:id', function(req,res){
        app.app.controllers.decks_controller.deck(app,req,res);
    });

    app.get('/decks/:id/list', function(req,res){
        app.app.controllers.decks_controller.listarCartasDeck(app,req,res);
    });
}