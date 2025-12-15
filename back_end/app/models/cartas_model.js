function CartasDAO(connection){
    this._connection = connection;
}

CartasDAO.prototype.getCartas = function(callback){
    this._connection.query('SELECT * FROM cartas', callback); 
}

CartasDAO.prototype.getCartaPorId = function(idCard, callback){
    this._connection.query('SELECT * FROM cartas WHERE idCard = ?', [idCard], callback); 
}

CartasDAO.prototype.getPersonagemPorId = function(idCard, callback) {
    const sql = `
        SELECT c.*, cp.*
        FROM cartas c
        JOIN cartaspersonagens cp ON c.idCard = cp.idCard
        WHERE c.idCard = ? AND c.char_hab = 1
    `;
    this._connection.query(sql, [idCard], callback); 
};

CartasDAO.prototype.getHabilidadePorId = function(idCard, callback) {
    const sql = `
        SELECT c.*, ch.*
        FROM cartas c
        JOIN cartashabilidades ch ON c.idCard = ch.idCard
        WHERE c.idCard = ? AND c.char_hab = 0
    `;
    this._connection.query(sql, [idCard], callback); 
};

CartasDAO.prototype.getTodosPersonagens = function(callback){
    const sql = `
        SELECT c.*, cp.*
        FROM cartas c
        JOIN cartaspersonagens cp ON c.idCard = cp.idCard
        WHERE c.char_hab = 1
        ORDER BY c.nome ASC
    `;
    this._connection.query(sql, callback); 
};

CartasDAO.prototype.getTodasHabilidades = function(callback){
    const sql = `
        SELECT c.*, ch.*
        FROM cartas c
        JOIN cartashabilidades ch ON c.idCard = ch.idCard
        WHERE c.char_hab = 0
        ORDER BY c.nome ASC
    `;
    this._connection.query(sql, callback); 
};


// =================================================================
// Parte Administrativa
// =================================================================

// ADCIONANDO CARTAS

// 1. Adicionar Cartas Base na tabela 'cartas'
CartasDAO.prototype.adicionarCartaBase = function(dadosCarta, callback) {
    const sql = 'INSERT INTO cartas SET ?'; 
    this._connection.query(sql, dadosCarta, callback); 
};

// 2. Adicionar Detalhes do Personagem na tabela 'cartaspersonagens'
CartasDAO.prototype.adicionarDetalhesPersonagem = function(detalhesPersonagem, callback) {
    const sql = 'INSERT INTO cartaspersonagens SET ?'; 
    this._connection.query(sql, detalhesPersonagem, callback);
};

// 3. Adicionar Detalhes da Habilidade na tabela 'cartashabilidades'
CartasDAO.prototype.adicionarDetalhesHabilidade = function(detalhesHabilidade, callback) {
    const sql = 'INSERT INTO cartashabilidades SET ?'; 
    this._connection.query(sql, detalhesHabilidade, callback);
};

// EDITANDO CARTAS

// 1. Atualiza os campos na tabela 'cartas'
CartasDAO.prototype.atualizarCartaBase = function(idCard, dadosCarta, callback) {
    // Atualiza os dados na tabela 'cartas'
    const sql = 'UPDATE cartas SET ? WHERE idCard = ?'; 
    this._connection.query(sql, [dadosCarta, idCard], callback); 
};

// 2. Atualiza os campos na tabela 'cartaspersonagens'
CartasDAO.prototype.atualizarDetalhesPersonagem = function(idCard, detalhesPersonagem, callback) {
    // Atualiza os detalhes específicos do Personagem
    const sql = 'UPDATE cartaspersonagens SET ? WHERE idCard = ?'; 
    this._connection.query(sql, [detalhesPersonagem, idCard], callback);
};

// 3. Atualiza os campos na tabela 'cartashabilidades'
CartasDAO.prototype.atualizarDetalhesHabilidade = function(idCard, detalhesHabilidade, callback) {
    // Atualiza os detalhes específicos da Habilidade
    const sql = 'UPDATE cartashabilidades SET ? WHERE idCard = ?'; 
    this._connection.query(sql, [detalhesHabilidade, idCard], callback);
};

CartasDAO.prototype.deletarCarta = function(idCard, callback) {
    const sql = 'DELETE FROM cartas WHERE idCard = ?'; 
    this._connection.query(sql, [idCard], callback);
};

module.exports = function(){
    return CartasDAO;
}