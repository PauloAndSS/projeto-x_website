// Arquivo: ./config/upload_config.js

const multer = require('multer');
const path = require('path');

// 💡 Definição do armazenamento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Define o caminho onde os arquivos serão salvos.
        // Crie este diretório se ele não existir!
        cb(null, './app/public/uploads'); 
    },
    filename: function (req, file, cb) {
        // Define o nome do arquivo. Usamos a data para garantir que o nome seja único.
        // Exemplo: 'user-1234567890.png'
        const ext = path.extname(file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// 💡 Definição do middleware Multer
const upload = multer({ 
    storage: storage,
    limits: { 
        fileSize: 1024 * 1024 * 20 // Limite de 5MB por arquivo
    },
    fileFilter: (req, file, cb) => {
        // Aceita apenas imagens (JPEG e PNG)
        const allowedMimes = ['image/jpeg', 'image/png'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Tipo de arquivo inválido. Apenas JPG e PNG são permitidos."), false);
        }
    }
});

module.exports = upload;