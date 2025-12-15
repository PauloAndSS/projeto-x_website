-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 15/12/2025 às 05:02
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `projeto_x`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `adm`
--

CREATE TABLE `adm` (
  `nomeAdm` varchar(100) NOT NULL,
  `senha` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `adm`
--

INSERT INTO `adm` (`nomeAdm`, `senha`) VALUES
('pauloandss', 'a4c50f6fb88fbfe4f14d843ea3ab7224');

-- --------------------------------------------------------

--
-- Estrutura para tabela `cartas`
--

CREATE TABLE `cartas` (
  `idCard` int(11) NOT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `figura` varchar(255) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `numserie` int(11) DEFAULT NULL,
  `criadoPorAdm` varchar(100) DEFAULT NULL,
  `char_hab` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `cartas`
--

INSERT INTO `cartas` (`idCard`, `nome`, `figura`, `tipo`, `numserie`, `criadoPorAdm`, `char_hab`) VALUES
(2, 'Contra-Ataque', '/img/teste.png', 'Habilidade Desencadeada', 234, 'pauloandss', 0),
(3, 'Corrida mortal', '/uploads/figura-1765512854721-406351023.jpg', 'Habilidade de velocidade', 234, 'pauloandss', 0),
(4, 'Elfa magica', '/uploads/figura-1765513862216-396758865.jpg', 'Elfo Arqueiro Lendário', 245, 'pauloandss', 1),
(5, 'magin', '/uploads/figura-1765534079291-181963445.jpg', 'Rei', 3123, 'pauloandss', 1),
(6, 'efrain', '/uploads/figura-1765534157099-94722828.jpg', 'orc', 234, 'pauloandss', 1),
(7, 'Poder de fogo', '/uploads/figura-1765536029949-570296558.jpg', 'magia ativa', 2147483647, 'pauloandss', 0);

-- --------------------------------------------------------

--
-- Estrutura para tabela `cartashabilidades`
--

CREATE TABLE `cartashabilidades` (
  `idCard` int(11) NOT NULL,
  `restricao` varchar(100) DEFAULT NULL,
  `texto` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `cartashabilidades`
--

INSERT INTO `cartashabilidades` (`idCard`, `restricao`, `texto`) VALUES
(2, 'Guerreiro, Monge, Ladino, Bárbaro.', 'Sempre que sofrer um ataque corpo a corpo role 1D6, se tirar 4 ou mais realiza um contra ataque simples e imediato'),
(3, 'Monges', 'use e ganhe + 2 de move'),
(7, 'magos', 'de dano em area');

-- --------------------------------------------------------

--
-- Estrutura para tabela `cartaspersonagens`
--

CREATE TABLE `cartaspersonagens` (
  `idCard` int(11) NOT NULL,
  `vida` int(11) DEFAULT NULL,
  `move` int(11) DEFAULT NULL,
  `PF` int(11) DEFAULT NULL,
  `PM` int(11) DEFAULT NULL,
  `alcance` int(11) DEFAULT NULL,
  `DC` int(11) DEFAULT NULL,
  `DA` int(11) DEFAULT NULL,
  `DM` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `cartaspersonagens`
--

INSERT INTO `cartaspersonagens` (`idCard`, `vida`, `move`, `PF`, `PM`, `alcance`, `DC`, `DA`, `DM`) VALUES
(4, 10, 4, 4, 0, 6, 2, 3, 4),
(6, 10, 3, 4, 0, 5, 5, 4, 2);

-- --------------------------------------------------------

--
-- Estrutura para tabela `decks`
--

CREATE TABLE `decks` (
  `idDeck` int(11) NOT NULL,
  `Nome` varchar(100) NOT NULL,
  `userId` int(11) NOT NULL,
  `idCard_main` int(11) DEFAULT NULL,
  `timeStamp` date DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `decks`
--

INSERT INTO `decks` (`idDeck`, `Nome`, `userId`, `idCard_main`, `timeStamp`) VALUES
(1, 'Teste Deck', 1, NULL, '2025-12-05');

-- --------------------------------------------------------

--
-- Estrutura para tabela `itemdeck`
--

CREATE TABLE `itemdeck` (
  `idCard` int(11) NOT NULL,
  `idDeck` int(11) NOT NULL,
  `quant` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `itemdeck`
--

INSERT INTO `itemdeck` (`idCard`, `idDeck`, `quant`) VALUES
(2, 1, 2);

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `idUser` int(11) NOT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `senha` varchar(100) DEFAULT NULL,
  `photoUser` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`idUser`, `nome`, `senha`, `photoUser`, `email`) VALUES
(1, 'test', '12345678', NULL, 'test@gmail.com'),
(2, 'test1', '1234', NULL, 'test1@gmail.com'),
(3, 'test2', '1234', NULL, 'test2@gmail.com'),
(4, 'test3', '123123', NULL, 'test3@gmail.com');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `adm`
--
ALTER TABLE `adm`
  ADD PRIMARY KEY (`nomeAdm`);

--
-- Índices de tabela `cartas`
--
ALTER TABLE `cartas`
  ADD PRIMARY KEY (`idCard`),
  ADD KEY `criadoPorAdm` (`criadoPorAdm`);

--
-- Índices de tabela `cartashabilidades`
--
ALTER TABLE `cartashabilidades`
  ADD PRIMARY KEY (`idCard`);

--
-- Índices de tabela `cartaspersonagens`
--
ALTER TABLE `cartaspersonagens`
  ADD PRIMARY KEY (`idCard`);

--
-- Índices de tabela `decks`
--
ALTER TABLE `decks`
  ADD PRIMARY KEY (`idDeck`),
  ADD KEY `userId` (`userId`),
  ADD KEY `decks_mcfk_1` (`idCard_main`);

--
-- Índices de tabela `itemdeck`
--
ALTER TABLE `itemdeck`
  ADD PRIMARY KEY (`idCard`,`idDeck`),
  ADD KEY `itemdeck_ibfk_2` (`idDeck`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`idUser`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `cartas`
--
ALTER TABLE `cartas`
  MODIFY `idCard` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `decks`
--
ALTER TABLE `decks`
  MODIFY `idDeck` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `idUser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `cartas`
--
ALTER TABLE `cartas`
  ADD CONSTRAINT `cartas_ibfk_1` FOREIGN KEY (`criadoPorAdm`) REFERENCES `adm` (`nomeAdm`);

--
-- Restrições para tabelas `cartashabilidades`
--
ALTER TABLE `cartashabilidades`
  ADD CONSTRAINT `cartashabilidades_ibfk_1` FOREIGN KEY (`idCard`) REFERENCES `cartas` (`idCard`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `cartaspersonagens`
--
ALTER TABLE `cartaspersonagens`
  ADD CONSTRAINT `cartaspersonagens_ibfk_1` FOREIGN KEY (`idCard`) REFERENCES `cartas` (`idCard`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `decks`
--
ALTER TABLE `decks`
  ADD CONSTRAINT `decks_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `usuarios` (`idUser`),
  ADD CONSTRAINT `decks_mcfk_1` FOREIGN KEY (`idCard_main`) REFERENCES `cartas` (`idCard`);

--
-- Restrições para tabelas `itemdeck`
--
ALTER TABLE `itemdeck`
  ADD CONSTRAINT `itemdeck_ibfk_1` FOREIGN KEY (`idCard`) REFERENCES `cartas` (`idCard`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `itemdeck_ibfk_2` FOREIGN KEY (`idDeck`) REFERENCES `decks` (`idDeck`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
