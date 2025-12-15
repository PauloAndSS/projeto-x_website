const bcrypt = require('bcrypt');
const upload = require('../../config/upload_config'); // 👈 Importe o Multer para lidar com o upload

/**
 * Função auxiliar para instanciar o Model de Usuários.
 */
const getUsuariosModel = (app, connection) => {
    return new app.app.models.usuarios_model(connection);
};

// 💡 Função auxiliar para executar a atualização e tratar a resposta (usada em editarPerfil)
function executarAtualizacao(model, idUser, novosDados, res) {
    model.atualizarPerfil(idUser, novosDados, function(error, result) {
        if (error) {
            console.error('Erro ao atualizar perfil:', error);
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ msg: 'Nome ou email já está em uso.', error: error.sqlMessage });
            }
            return res.status(500).json({ msg: 'Erro ao atualizar perfil.', error: error.sqlMessage });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: `Usuário ID ${idUser} não encontrado.` });
        }
        
        res.status(200).json({ msg: 'Perfil atualizado com sucesso!' });
    });
}

// =================================================================
// 🚀 1. VALIDAÇÕES E CADASTRO (COM MULTER)
// =================================================================

module.exports.validarEmail = function(app, req, res) {
    const { email } = req.body;
    const connection = app.database.dbconnection();
    const model = getUsuariosModel(app, connection);

    model.getUsuarioPorEmail(email, function(error, result) {
        if (error) return res.status(500).json({ msg: 'Erro de validação.', error: error.sqlMessage });

        if (result.length > 0) {
            return res.status(200).json({ valido: false, msg: 'Email já cadastrado.' });
        }
        res.status(200).json({ valido: true, msg: 'Email disponível.' });
    });
};

module.exports.validarNome = function(app, req, res) {
    const { nome } = req.body;
    const connection = app.database.dbconnection();
    const model = getUsuariosModel(app, connection);

    model.getUsuarioPorNome(nome, function(error, result) {
        if (error) return res.status(500).json({ msg: 'Erro de validação.', error: error.sqlMessage });

        if (result.length > 0) {
            return res.status(200).json({ valido: false, msg: 'Nome de usuário já existente.' });
        }
        res.status(200).json({ valido: true, msg: 'Nome de usuário disponível.' });
    });
};

module.exports.cadastrar = function(app, req, res) {
    
    // Processa o upload do campo 'photoUser'
    upload.single('photoUser')(req, res, (err) => {
        
        if (err) {
            return res.status(400).json({ msg: 'Erro no upload da imagem de perfil.', error: err.message });
        }

        const dadosForm = req.body;
        const photoPath = req.file ? '/uploads/' + req.file.filename : null; 
        
        if (!dadosForm.nome || !dadosForm.email || !dadosForm.senha) {
            return res.status(400).json({ msg: 'Dados incompletos (nome, email, senha são obrigatórios).' });
        }

        const connection = app.database.dbconnection();
        const model = getUsuariosModel(app, connection);
        
        const dadosParaModel = {
            nome: dadosForm.nome,
            email: dadosForm.email,
            senha: dadosForm.senha, // Será hasheada no DAO
            photoUser: photoPath      
        };

        model.cadastrarUsuario(dadosParaModel, function(error, result) {
            if (error) {
                console.error('Erro ao cadastrar:', error);
                return res.status(500).json({ msg: 'Erro ao cadastrar usuário.', error: error.sqlMessage });
            }
            res.status(201).json({ msg: 'Usuário cadastrado com sucesso!', id: result.insertId });
        });
    });
};

// =================================================================
// 🚀 2. LOGIN E PERFIL (GET)
// =================================================================

module.exports.login = function(app, req, res) {
    const { email, senha } = req.body;
    const connection = app.database.dbconnection();
    const model = getUsuariosModel(app, connection);

    model.getUsuarioPorEmail(email, function(error, result) {
        if (error) return res.status(500).json({ msg: 'Erro no login.', error: error.sqlMessage });
        
        const usuario = result[0];

        if (!usuario) {
            return res.status(401).json({ auth: false, msg: 'Email ou senha inválidos.' });
        }
        
        bcrypt.compare(senha, usuario.senha, function(err, match) {
            if (err) return res.status(500).json({ msg: 'Erro na comparação de senha.' });

            if (match) {
                const { idUser, nome, email, photoUser } = usuario;
                // Nota: O resultado do getUsuarioPorEmail precisa ter a senha para bcrypt.compare
                res.status(200).json({ auth: true, msg: 'Login bem-sucedido.', usuario: { idUser, nome, email, photoUser } });
            } else {
                res.status(401).json({ auth: false, msg: 'Email ou senha inválidos.' });
            }
        });
    });
};

module.exports.getPerfil = function(app, req, res) {
    const idUser = req.params.id;
    const connection = app.database.dbconnection();
    const model = getUsuariosModel(app, connection);

    model.getUsuarioPorId(idUser, function(error, result) {
        if (error) return res.status(500).json({ msg: 'Erro ao buscar perfil.', error: error.sqlMessage });
        
        if (result.length === 0) {
            return res.status(404).json({ msg: `Usuário ID ${idUser} não encontrado.` });
        }
        
        res.status(200).json({ perfil: result[0] });
    });
};

// =================================================================
// 🚀 3. EDIÇÃO E DELEÇÃO (COM MULTER E CORREÇÕES)
// =================================================================

module.exports.editarPerfil = function(app, req, res) {
    
    // Processa o upload do campo 'photoUser'
    upload.single('photoUser')(req, res, (err) => {
        
        if (err) {
            return res.status(400).json({ msg: 'Erro no upload da nova imagem de perfil.', error: err.message });
        }

        const idUser = req.body.idUser;
        const dadosForm = req.body;
        
        if (!idUser) {
            return res.status(400).json({ msg: 'ID do usuário ausente para edição.' });
        }

        const connection = app.database.dbconnection();
        const model = getUsuariosModel(app, connection);
        
        const photoPath = req.file ? '/uploads/' + req.file.filename : dadosForm.photoUser; 

        // Prepara o objeto de atualização
        let novosDados = { 
            nome: dadosForm.nome, 
            email: dadosForm.email
        };
        
        // Adiciona a foto SOMENTE se o campo for fornecido (novo upload ou string vazia)
        if (photoPath !== undefined) {
             novosDados.photoUser = photoPath;
        }

        // Remove campos undefined/nulos/vazios
        Object.keys(novosDados).forEach(key => {
            if (novosDados[key] === undefined || novosDados[key] === null || novosDados[key] === '') {
                delete novosDados[key];
            }
        });

        executarAtualizacao(model, idUser, novosDados, res);
    });
};


module.exports.deletarUsuario = function(app, req, res) {
    const idUser = req.params.id; 
    
    if (!idUser) {
        return res.status(400).json({ msg: 'ID do usuário ausente para exclusão.' });
    }

    const connection = app.database.dbconnection();
    const model = getUsuariosModel(app, connection);
    
    // Antes de deletar no banco, é ideal buscar o caminho da foto para deletar o arquivo do disco.

    model.deletarUsuario(idUser, function(error, result) {
        if (error) {
            console.error('Erro ao deletar usuário:', error);
            return res.status(500).json({ msg: 'Erro na exclusão do usuário.', error: error.sqlMessage || error.message });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: `Usuário ID ${idUser} não encontrado.` });
        }
        
        res.status(200).json({ msg: `Usuário ID ${idUser} deletado com sucesso.` });
    });
};