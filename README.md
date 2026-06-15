# PlantãoMed

O **PlantãoMed** é uma aplicação web desenvolvida para auxiliar no gerenciamento de médicos, plantões hospitalares e candidaturas. O sistema permite que administradores cadastrem médicos e plantões, enquanto médicos autenticados podem se candidatar aos plantões disponíveis.

O projeto foi desenvolvido com **React** no frontend e **Node.js com Express** no backend. Os dados agora são persistidos em um banco de dados **MySQL**, provido através de um contêiner **Docker**.

---

## Funcionalidades

### Autenticação

* Login com e-mail e senha;
* Validação de campos obrigatórios;
* Controle de sessão com Context API e `localStorage`;
* Logout funcional;
* Proteção de rotas;
* Redirecionamento de usuários não autenticados;
* Controle de acesso de acordo com o perfil do usuário.

### Perfis de acesso

#### Administrador

O administrador possui acesso a:

* Dashboard;
* Gerenciamento de médicos;
* Gerenciamento de plantões;
* Consulta de todas as candidaturas;
* Aprovação e rejeição de candidaturas;
* Relatório de candidaturas.

#### Médico

O médico possui acesso a:

* Dashboard;
* Cadastro de candidatura;
* Consulta das próprias candidaturas;
* Cancelamento de candidaturas pendentes;
* Relatório de suas candidaturas.

O médico não possui acesso às telas de gerenciamento de médicos e plantões.

---

## CRUDs implementados

### CRUD de médicos

Executado pelo administrador.

* **Create:** cadastra um médico e cria automaticamente seu usuário de acesso;
* **Read:** lista os médicos cadastrados;
* **Update:** altera nome, e-mail, especialidade, telefone e, opcionalmente, a senha;
* **Delete:** exclui o médico e seu usuário de acesso.

Ao cadastrar um médico, o sistema cria dois registros relacionados:

```text
Medicos
└── id

Usuarios
└── medicoId
```

O campo `medicoId` permite identificar o cadastro relacionado ao usuário autenticado.

#### Regras

* E-mail deve ser único;
* Telefone deve ser único;
* Telefone deve possuir 10 ou 11 números;
* Senha inicial deve possuir pelo menos seis caracteres;
* Senha e confirmação devem ser iguais;
* A senha não é exibida pela API;
* Um médico com candidaturas vinculadas não pode ser excluído;
* Ao editar o médico, deixar os campos de senha vazios mantém a senha atual.

---

### CRUD de plantões

Executado pelo administrador.

* **Create:** cadastra um plantão;
* **Read:** lista os plantões;
* **Update:** altera data, horário, valor e status;
* **Delete:** exclui um plantão.

#### Dados de um plantão

```text
id
data
horario
valor
status
```

#### Status disponíveis

```text
Disponível
Preenchido
Cancelado
```

#### Regras

* Não podem existir dois plantões com a mesma data e horário;
* O valor não pode ser negativo;
* Um plantão com candidaturas vinculadas não pode ser excluído;
* Plantões preenchidos ou cancelados não aceitam novas candidaturas.

---

### CRUD de candidaturas

As operações são divididas entre médico e administrador.

* **Create:** o médico se candidata a um plantão disponível;
* **Read:** o médico consulta suas candidaturas e o administrador consulta todas;
* **Update:** o administrador aprova ou rejeita uma candidatura;
* **Delete:** o médico cancela uma candidatura pendente.

#### Dados de uma candidatura

```text
id
medicoId
plantaoId
dataCandidatura
status
```

#### Status disponíveis

```text
Pendente
Aprovada
Rejeitada
```

#### Regras

* O médico e o plantão precisam existir;
* O plantão precisa estar disponível;
* O mesmo médico não pode se candidatar duas vezes ao mesmo plantão;
* Vários médicos podem se candidatar ao mesmo plantão;
* Apenas uma candidatura pode ser aprovada;
* Ao aprovar uma candidatura:

  * a candidatura escolhida recebe o status `Aprovada`;
  * as demais candidaturas pendentes do mesmo plantão recebem o status `Rejeitada`;
  * o plantão recebe o status `Preenchido`;
* Apenas candidaturas pendentes podem ser canceladas;
* Candidaturas já analisadas não podem ser alteradas novamente.

---

## Relatório com JOIN

O sistema possui uma tela de relatório que relaciona três entidades:

```text
Candidatura + Médico + Plantão
```

O backend disponibiliza os dados por meio da rota:

```text
GET /api/relatorios/candidaturas
```

O JOIN é realizado no React utilizando `map()` e `find()`:

```javascript
const relatorio = candidaturas.map((candidatura) => {
  const medico = medicos.find(
    (item) =>
      Number(item.id) ===
      Number(candidatura.medicoId)
  );

  const plantao = plantoes.find(
    (item) =>
      Number(item.id) ===
      Number(candidatura.plantaoId)
  );

  return {
    ...candidatura,
    medico: medico?.nome,
    especialidade: medico?.especialidade,
    dataPlantao: plantao?.data,
    horarioPlantao: plantao?.horario,
    valorPlantao: plantao?.valor
  };
});
```

O relatório apresenta:

* Médico;
* Especialidade;
* Data do plantão;
* Horário;
* Valor;
* Data da candidatura;
* Status.

O administrador visualiza todas as candidaturas. O médico visualiza somente as candidaturas relacionadas ao seu `medicoId`.

---

## Tecnologias utilizadas

### Frontend

* React;
* Vite;
* React Router DOM;
* Axios;
* Context API;
* LocalStorage;
* JavaScript;
* HTML;
* CSS.

### Backend

* Node.js;
* Express;
* CORS;
* Nodemon;
* JavaScript;
* MySQL (banco de dados relacional);
* Docker e Docker Compose (orquestração do banco de dados).

---

## Arquitetura

O projeto utiliza uma organização inspirada no padrão MVC.

```text
PlantaoMed/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── initDb.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── medicoController.js
│   │   │   ├── plantaoController.js
│   │   │   ├── candidaturaController.js
│   │   │   └── relatorioController.js
│   │   │
│   │   ├── models/
│   │   │   ├── usuarioModel.js
│   │   │   ├── medicoModel.js
│   │   │   ├── plantaoModel.js
│   │   │   ├── candidaturaModel.js
│   │   │   └── relatorioModel.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── medicoRoutes.js
│   │   │   ├── plantaoRoutes.js
│   │   │   ├── candidaturaRoutes.js
│   │   │   └── relatorioRoutes.js
│   │   │
│   │   └── server.js
│   │
│   ├── .env
│   └── package.json
│
├── docker-compose.yml
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── FormMedico.jsx
    │   │   ├── FormPlantao.jsx
    │   │   ├── FormCandidatura.jsx
    │   │   ├── Layout.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── Tabela.jsx
    │   │
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   │
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Medicos.jsx
    │   │   ├── Plantoes.jsx
    │   │   ├── Candidaturas.jsx
    │   │   └── Relatorio.jsx
    │   │
    │   ├── services/
    │   │   └── api.js
    │   │
    │   ├── App.jsx
    │   └── main.jsx
    │
    └── package.json
```

---

## Rotas da API

### Autenticação

| Método | Rota               | Descrição         |
| ------ | ------------------ | ----------------- |
| POST   | `/api/auth/login`  | Realiza o login   |
| POST   | `/api/auth/logout` | Finaliza a sessão |

### Médicos

| Método | Rota               | Descrição                 |
| ------ | ------------------ | ------------------------- |
| GET    | `/api/medicos`     | Lista os médicos          |
| POST   | `/api/medicos`     | Cadastra médico e usuário |
| PUT    | `/api/medicos/:id` | Atualiza médico e usuário |
| DELETE | `/api/medicos/:id` | Exclui médico e usuário   |

### Plantões

| Método | Rota                | Descrição           |
| ------ | ------------------- | ------------------- |
| GET    | `/api/plantoes`     | Lista os plantões   |
| POST   | `/api/plantoes`     | Cadastra um plantão |
| PUT    | `/api/plantoes/:id` | Atualiza um plantão |
| DELETE | `/api/plantoes/:id` | Exclui um plantão   |

### Candidaturas

| Método | Rota                    | Descrição                         |
| ------ | ----------------------- | --------------------------------- |
| GET    | `/api/candidaturas`     | Lista as candidaturas             |
| POST   | `/api/candidaturas`     | Cadastra uma candidatura          |
| PUT    | `/api/candidaturas/:id` | Aprova ou rejeita uma candidatura |
| DELETE | `/api/candidaturas/:id` | Cancela uma candidatura pendente  |

### Relatório

| Método | Rota                           | Descrição                                |
| ------ | ------------------------------ | ---------------------------------------- |
| GET    | `/api/relatorios/candidaturas` | Retorna os dados utilizados no relatório |

---

## Como executar o projeto

### Pré-requisitos

Antes de iniciar, é necessário possuir:

* Node.js;
* npm;
* Git;
* Docker e Docker Compose (para subir o banco de dados).

### Clonar o repositório

```bash
git clone https://github.com/LuizDev1/PlantaoMed.git
cd PlantaoMed
```

### Inicializar o Banco de Dados (MySQL)

Na raiz do projeto, inicie o container Docker:

```bash
docker-compose up -d
```
O banco de dados estará acessível localmente na porta `3306`. A aplicação criará automaticamente as tabelas e a estrutura do banco na primeira execução do backend.

### Instalar o backend

```bash
cd backend
npm install
```

*(Opcional) Edite o arquivo `.env` dentro da pasta `backend` se precisar modificar as credenciais do banco.*

### Executar o backend

```bash
npm run dev
```

O backend será iniciado em:

```text
http://localhost:3001
```

### Instalar o frontend

Abra outro terminal:

```bash
cd frontend
npm install
```

### Executar o frontend

```bash
npm run dev
```

O frontend será iniciado em:

```text
http://localhost:5173
```

É necessário manter o backend e o frontend executando simultaneamente.

---

## Usuários de teste

Nesta versão com MySQL, as tabelas estarão inicialmente vazias na primeira execução. No entanto, o backend já está configurado para **criar automaticamente um usuário administrador padrão** assim que for iniciado, dispensando qualquer inserção manual.

Exemplo de login inicial esperado na aplicação:
```text
E-mail: admin@plantaomed.com
Senha: 123456
```

Novos usuários do tipo médico serão criados automaticamente através do sistema quando o administrador cadastrar um novo médico.

---

## Persistência

Os dados são armazenados localmente utilizando o banco de dados relacional **MySQL**.
A comunicação com o banco é realizada usando a biblioteca `mysql2/promise` do Node.js, com queries SQL nativas assíncronas espalhadas pelos arquivos da camada de Models.

O pool de conexões é configurado no arquivo `backend/src/config/db.js` utilizando os parâmetros providos pelas variáveis de ambiente (`.env`).

---

## Requisitos acadêmicos atendidos

### Sistema de login

* Tela de login;
* Validação de campos;
* Context API;
* LocalStorage;
* Controle de sessão;
* Logout;
* Proteção de rotas.

### Três CRUDs

* Médicos;
* Plantões;
* Candidaturas.

### Relatório com JOIN

* Relacionamento entre candidaturas, médicos e plantões;
* Uso de `map()` e `find()`;
* Exibição clara dos dados relacionados;
* Componente reutilizável de tabela.

---

## Fluxo de branches

O projeto utiliza o seguinte fluxo:

```text
feature/*
    ↓ Pull Request
develop
    ↓ Pull Request
main
```

Principais branches utilizadas durante o desenvolvimento:

```text
feature/autenticacao
feature/layout-dashboard
feature/medicos
feature/plantoes
feature/candidaturas
feature/relatorios
feature/login-medicos
feature/implementacao-mysql
```

A branch `main` contém a versão estável. A branch `develop` é utilizada para integração das funcionalidades.

---

## Segurança

Este projeto foi desenvolvido para fins acadêmicos.

Na implementação atual:

* não há criptografia de senha;
* não há autenticação por JWT;
* a proteção principal de rotas é feita no frontend;

Em uma versão destinada à produção, seria necessário implementar:

* criptografia de senhas com bcrypt;
* autenticação com JWT ou sessão no servidor;
* middleware de autorização;
* validações adicionais mais rigorosas de input;
* HTTPS;
* recuperação e alteração segura de senha.

---

## Build do frontend

Para verificar se o frontend pode ser compilado:

```bash
cd frontend
npm run build
```

Os arquivos de produção serão gerados na pasta:

```text
frontend/dist
```

---

## Equipe

- Felipe Alcântara Santos Ribeiro
- Talles Henrique Pacheco de Queiroz
- Yuri Guerra
- Miguel Luís Ferreira de Paula
- Luíz Fernando Gomes de Almeida

---

Desenvolvido como projeto acadêmico · UCB · 2026
