var mysql = require('mysql')

var connMySQL = () => {
    console.log('conectando db')
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'projeto_x'}
    )
}

module.exports = () => {
    return connMySQL; 
}