module.exports = function(app){
    app.get('/cartas', function(req,res){
        app.app.controllers.cartas_controller.todascartas(app,req,res);
    });
    
    app.get('/cartas/personagens', function(req,res){
        app.app.controllers.cartas_controller.personagens(app,req,res);
    });
    
    app.get('/cartas/personagens/:id', function(req,res){
        app.app.controllers.cartas_controller.personagem(app,req,res);
    });

    app.get('/cartas/habilidades', function(req,res){
        app.app.controllers.cartas_controller.habilidades(app,req,res);
    });

    app.get('/cartas/habilidades/:id', function(req,res){
        app.app.controllers.cartas_controller.habilidade(app,req,res);
    });
}