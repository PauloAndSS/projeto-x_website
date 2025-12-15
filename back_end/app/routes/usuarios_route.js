module.exports = function (app) {
    // Validação de email: POST /validarEmail
    app.post('/validarEmail', function (req, res) {
        app.app.controllers.usuarios_controller.validarEmail(app, req, res);
    });

    // Validação de nome de usuário: POST /validarNome
    app.post('/validarNome', function (req, res) {
        app.app.controllers.usuarios_controller.validarNome(app, req, res);
    });
    
    // Cadastro de novo usuário: POST /cadastrar
    app.post('/cadastrar', function (req, res) {
        app.app.controllers.usuarios_controller.cadastrar(app, req, res);
    });

    // Login de usuário: POST /login
    app.post('/login', function (req, res) {
        app.app.controllers.usuarios_controller.login(app, req, res);
    });

    // Visualizar Perfil (apenas nome, email, foto): GET /perfil/:id
    app.get('/perfil/:id',function(req,res){
        app.app.controllers.usuarios_controller.getPerfil(app, req, res);
    });

    // (A rota DELETE para exclusão do perfil deve ser adicionada separadamente)
    app.post('/perfil/edit', function (req, res) {
        app.app.controllers.usuarios_controller.editarPerfil(app, req, res);
    });
}