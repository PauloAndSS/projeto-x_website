module.exports = function (app) {
    //adcionar

    app.post('/cartas/add/personagem', function (req, res) {
        app.app.controllers.admcartas_controller.addPersonagem(app, req, res);
    });

    app.post('/cartas/add/habilidade', function (req, res) {
        app.app.controllers.admcartas_controller.addHabilidade(app, req, res);
    });

    //editar

    app.post('/cartas/edit/personagem/:id', function (req, res) {
        app.app.controllers.admcartas_controller.editPersonagem(app, req, res);
    });

    app.post('/cartas/edit/habilidade/:id', function (req, res) {
        app.app.controllers.admcartas_controller.editHabilidade(app, req, res);
    });

    //deletar

    app.delete('/cartas/delete/:id', function(req,res){
        app.app.controllers.admcartas_controller.deleteCarta(app,req,res);
    });
}