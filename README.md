# 🏥 PlantãoMed

Plataforma web para gestão de plantões médicos hospitalares.

## Sobre o projeto

O PlantãoMed é uma aplicação web desenvolvida para facilitar a gestão de plantões em ambientes hospitalares. A plataforma permite que administradores publiquem vagas de plantão e gerenciem médicos cadastrados, enquanto médicos podem consultar plantões disponíveis e registrar candidaturas.

## Funcionalidades

- ✅ Autenticação de usuários
- ✅ Gerenciamento de médicos
- ✅ Gerenciamento de plantões
- ✅ Gerenciamento de candidaturas
- ✅ Relatório de candidaturas
- ✅ Controle de acesso por perfil

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | React (SPA) |
| Backend | Node.js + Express |
| Arquitetura | MVC |
| Persistência | JSON |
| Comunicação | REST API |
| Linguagem | JavaScript |

## Como executar

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/plantaomed.git

# Backend
cd backend
npm install
npm start

# Frontend (outro terminal)
cd frontend
npm install
npm run dev
```

## Estrutura do projeto

```
PlantaoMed/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── data/
│   │   │   └── dados.json
│   │   ├── utils/
│   │   └── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── services/
    │   ├── context/
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Equipe

- Felipe Alcântara Santos Ribeiro
- Talles Henrique Pacheco de Queiroz
- Yuri Guerra
- Miguel Luís Ferreira de Paula
- Luíz Fernando Gomes de Almeida

---

Desenvolvido como projeto acadêmico· UCB · 2026
