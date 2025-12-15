const app = require('./config/server');

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor Express rodando na porta ${port}`);
  console.log(`Acesso: http://localhost:${port}`);
});

module.exports = app;