function DecksDAO(connection){
    this._connection = connection;
}

DecksDAO.prototype.getTodosDecks = function(callback) {
    const sql = 'SELECT * FROM decks ORDER BY nome ASC';
    this._connection.query(sql, callback); 
};

DecksDAO.prototype.getDeckPorId = function(idDeck, callback) {
    const sql = 'SELECT * FROM decks WHERE idDeck = ?'; 
    this._connection.query(sql, [idDeck], callback); 
};

DecksDAO.prototype.getCartasDoDeck = function(idDeck, callback) {
    const sql = `
        SELECT 
            c.*, 
            id.Quant FROM cartas c
        JOIN itemdeck id ON c.idCard = id.idCard
        WHERE id.idDeck = ?
        ORDER BY c.nome ASC
    `;

    this._connection.query(sql, [idDeck], callback);
};

// =================================================================
// Parte Administrativa
// =================================================================

DecksDAO.prototype.adicionarDeckBase = function(dadosDeck, callback) {
    this._connection.query('INSERT INTO decks SET ?', dadosDeck, (error, result) => {
        if (error){
            callback(error);
        }else{
            const idDeck = result.insertId;
            callback(null, { id: idDeck });
        }
    });
};

DecksDAO.prototype.atualizarDeckBase = function(idDeck, dadosDeck, callback) {
    const sql = 'UPDATE decks SET ? WHERE id = ?'; 
    this._connection.query(sql, [dadosDeck, idDeck], callback);
};

DecksDAO.prototype.deletarDeck = function(idDeck, callback) {
    const sql = 'DELETE FROM decks WHERE id = ?'; 
    this._connection.query(sql, [idDeck], callback);
};

// =================================================================
// Parte Administrativa / Manipulação das cartas do deck
// =================================================================

DecksDAO.prototype.adicionarCartaAoDeck = function(idDeck, idCard, quantidade, callback) {
    const sql = 'INSERT INTO itemdeck (idDeck, idCard, Quant) VALUES (?, ?, ?)';
    this._connection.query(sql, [idDeck, idCard, quantidade], callback);
};

DecksDAO.prototype.atualizarQuantidade = function(idDeck, idCard, novaQuantidade, callback) {
    const sql = 'UPDATE itemdeck SET Quant = ? WHERE idDeck = ? AND idCard = ?';
    this._connection.query(sql, [novaQuantidade, idDeck, idCard], callback);
};

DecksDAO.prototype.deletarCartaDoDeck = function(idDeck, idCard, callback) {
    const sql = 'DELETE FROM itemdeck WHERE idDeck = ? AND idCard = ?';
    this._connection.query(sql, [idDeck, idCard], callback);
};

module.exports = function(){
    return DecksDAO;
}