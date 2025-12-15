// Arquivo: app/models/usuarios_model.js

const bcrypt = require('bcrypt'); // Mantido, pois é usado em cadastrarUsuario

function UsuariosDAO(connection) {
    this._connection = connection;
    this.saltRounds = 10;
}

// =================================================================
// FUNÇÕES DE BUSCA E VALIDAÇÃO
// =================================================================

UsuariosDAO.prototype.getUsuarioPorEmail = function(email, callback) {
    // Para login, o controller precisa do hash da senha, então alteramos para SELECT *
    const sql = 'SELECT * FROM usuarios WHERE email = ?'; 
    this._connection.query(sql, [email], callback);
};

UsuariosDAO.prototype.getUsuarioPorNome = function(nome, callback) {
    const sql = 'SELECT 1 FROM usuarios WHERE nome = ?';
    this._connection.query(sql, [nome], callback);
};

UsuariosDAO.prototype.getUsuarioPorId = function(idUser, callback) {
    // Não retornar a senha
    const sql = 'SELECT idUser, nome, email, photoUser FROM usuarios WHERE idUser = ?'; 
    this._connection.query(sql, [idUser], callback);
};

// =================================================================
// FUNÇÃO DE EDIÇÃO (FALTANDO)
// =================================================================


UsuariosDAO.prototype.atualizarPerfil = function(idUser, novosDados, callback) {
    // Usa SET ? para atualizar múltiplos campos e WHERE para o ID.
    const sql = 'UPDATE usuarios SET ? WHERE idUser = ?'; 
    this._connection.query(sql, [novosDados, idUser], callback);
};

// =================================================================
// FUNÇÕES DE CRIAÇÃO E DELEÇÃO
// =================================================================

UsuariosDAO.prototype.cadastrarUsuario = function(dadosUsuario, callback) {
    // ... (Lógica de Hashing aqui) ...
    bcrypt.hash(dadosUsuario.senha, this.saltRounds, (err, hash) => {
        if (err) return callback(err);

        const dadosComHash = {
            nome: dadosUsuario.nome,
            email: dadosUsuario.senha, // Este deve ser o email
            senha: hash,
            photoUser: dadosUsuario.photoUser || null
        };
        
        const sql = 'INSERT INTO usuarios SET ?';
        this._connection.query(sql, dadosComHash, callback);
    });
};

UsuariosDAO.prototype.deletarUsuario = function(idUser, callback) {
    const sql = 'DELETE FROM usuarios WHERE idUser = ?';
    this._connection.query(sql, [idUser], callback);
};

module.exports = function() {
    return UsuariosDAO;
};