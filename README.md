# 📅 Agendamento API

Uma API RESTful robusta desenvolvida para gerenciamento de agendamentos em clínicas. Construída com as melhores práticas de backend, a API permite o cadastro de clientes, serviços, regras rígidas de negócio para agendamentos e transições seguras de status por administradores.

## 🚀 Tecnologias

Este projeto foi construído utilizando as seguintes tecnologias:

- **[Node.js](https://nodejs.org/en/)** com **[TypeScript](https://www.typescriptlang.org/)**
- **[Express](https://expressjs.com/)** (Framework Web)
- **[TypeORM](https://typeorm.io/)** (ORM para banco de dados)
- **[PostgreSQL](https://www.postgresql.org/)** (Banco de dados relacional via Docker)
- **[Zod](https://zod.dev/)** (Validação e tipagem de dados)
- **[Argon2](https://github.com/ranisalt/node-argon2)** (Hashing de senhas)
- **[JSON Web Token (JWT)](https://jwt.io/)** (Autenticação)
- **[Vitest](https://vitest.dev/)** & **[Supertest](https://github.com/ladjs/supertest)** (Testes de integração)
- **[Swagger](https://swagger.io/)** (Documentação interativa da API)

---

## ⚙️ Pré-requisitos

Antes de começar, você vai precisar ter instalado na sua máquina as seguintes ferramentas:
- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org/en/) (versão 20 ou superior)
- [pnpm](https://pnpm.io/) (Gerenciador de pacotes)
- [Docker](https://www.docker.com/) e Docker Compose

---

## 🛠️ Configuração e Instalação

1. **Clone este repositório**
```bash
git clone https://github.com/seu-usuario/agendamento-api.git
cd agendamento-api
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Configure as Variáveis de Ambiente**
Crie um arquivo `.env` na raiz do projeto baseado no seu `.env.example` (ou adicione as variáveis abaixo):
```env
DB_HOST=localhost
DB_PORT=5433
DB_USER=admin
DB_PASS=admin_password_segura
DB_NAME=agendamento_clinica
JWT_SECRET=sua_chave_secreta_aqui
```

4. **Inicie o Banco de Dados com Docker**
```bash
docker-compose up -d
```

5. **Execute as Migrations**
Para criar as tabelas estruturadas no banco de dados:
```bash
pnpm run migration:run
```

6. **Inicie a Aplicação**
```bash
pnpm run dev
```

A API estará rodando na porta `http://localhost:3000`.

---

## 📖 Documentação da API (Swagger)

A documentação interativa de todas as rotas, regras e *payloads* necessários pode ser acessada facilmente via Swagger.

Com a aplicação rodando, acesse em seu navegador:
👉 **[http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

---

## 🧪 Testes

A API possui uma suíte completa de testes de integração, rodando de forma isolada com banco de dados limpo a cada execução.

Para rodar os testes:
```bash
pnpm run test
```

---

## 🏛️ Estrutura de Rotas e Permissões

- **`CLIENT`**: Permissão base. Pode se cadastrar, atualizar o próprio perfil, listar serviços, criar e cancelar os **próprios** agendamentos.
- **`ADMIN`**: Acesso total. Pode confirmar e completar agendamentos, criar e deletar serviços, visualizar todos os clientes e listar todos os agendamentos da clínica.

*(Para detalhes de cada rota e métodos, consulte a documentação do Swagger).*
