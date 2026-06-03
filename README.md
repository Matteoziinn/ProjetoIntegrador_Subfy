# 📦 Subfy — Gerenciador de Assinaturas

> Aplicação web full-stack para gerenciamento de assinaturas digitais, com alertas automáticos de vencimento por e-mail.

---

## 📌 Sobre o Projeto

O **Subfy** é um sistema de controle de assinaturas desenvolvido como projeto acadêmico no curso de **Análise e Desenvolvimento de Sistemas**. A aplicação permite que o usuário cadastre, visualize, edite e cancele suas assinaturas digitais (como Netflix, Spotify, etc.), recebendo notificações automáticas por e-mail antes do vencimento.

---

## 🛠️ Tecnologias Utilizadas

### Backend
| Tecnologia | Versão | Função |
|---|---|---|
| Java | 17 | Linguagem principal |
| Spring Boot | 3.5.13 | Framework web |
| Spring Security | 6.5.9 | Autenticação e autorização |
| Spring Data JPA | 3.5.10 | Persistência de dados |
| Spring Mail | 3.5.13 | Envio de e-mails |
| PostgreSQL | - | Banco de dados relacional |
| JWT (jjwt) | 0.9.1 | Tokens de autenticação |
| Lombok | 1.18.44 | Redução de boilerplate |
| Maven | - | Gerenciador de dependências |

### Frontend
| Tecnologia | Versão | Função |
|---|---|---|
| React | 19.2.5 | Biblioteca de interface |
| React Router DOM | 7.14.1 | Navegação entre páginas |
| Axios | 1.15.0 | Requisições HTTP |
| Lucide React | 1.9.0 | Ícones |
| React Icons | 5.6.0 | Biblioteca de ícones adicional |

---

## 📁 Estrutura do Projeto

```
Subfy/
├── _subfy/subfy/                        # Backend (Spring Boot)
│   ├── src/main/java/com/subfy/
│   │   ├── controller/
│   │   │   ├── AuthController.java      # Login e cadastro
│   │   │   ├── SubscriptionController.java  # CRUD de assinaturas
│   │   │   ├── UserController.java      # Dados do usuário
│   │   │   └── NotificationController.java  # Notificações manuais
│   │   ├── entity/
│   │   │   ├── User.java                # Entidade usuário
│   │   │   └── Subscription.java        # Entidade assinatura
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   └── SubscriptionRepository.java
│   │   ├── security/
│   │   │   ├── JwtUtil.java             # Geração e validação de tokens
│   │   │   ├── JwtFilter.java           # Filtro de autenticação
│   │   │   └── SecurityConfig.java      # Configuração de segurança
│   │   └── service/
│   │       ├── EmailService.java        # Envio de e-mails HTML
│   │       └── NotificationScheduler.java  # Agendador diário (08h)
│   └── src/main/resources/
│       └── application.properties       # Configurações (não incluso no repositório)
│
└── subfy-front/                         # Frontend (React)
    └── src/
        ├── App.js                       # Rotas da aplicação
        ├── Login.js                     # Tela de login
        ├── Register.js                  # Tela de cadastro
        ├── Dashboard.js                 # Painel principal
        ├── Subscriptions.js             # Lista de assinaturas
        ├── Plans.js                     # Planos disponíveis
        ├── Profile.js                   # Perfil do usuário
        ├── Layout.js                    # Layout compartilhado
        ├── NotificationSystem.js        # Sistema de notificações
        └── ProtectedRoute.js            # Proteção de rotas autenticadas
```

---

## ⚙️ Pré-requisitos

Instale os itens abaixo antes de rodar o projeto:

- **Java 17 (JDK)** → https://www.oracle.com/java/technologies/downloads/
- **Maven** → https://maven.apache.org/download.cgi
- **Node.js** → https://nodejs.org/
- **PostgreSQL** → https://www.postgresql.org/download/

---

## 🗄️ Configuração do Banco de Dados

1. Instale o PostgreSQL e anote a senha definida durante a instalação.
2. Abra o **pgAdmin** ou o **psql** e execute:

```sql
CREATE DATABASE subfy;
```

---

## 🔧 Configuração do application.properties

Crie o arquivo `application.properties` dentro de:

```
_subfy/subfy/src/main/resources/
```

Com o seguinte conteúdo (substitua os valores pelos seus):

```properties
# ===============================
# BANCO DE DADOS (PostgreSQL)
# ===============================
spring.datasource.url=jdbc:postgresql://localhost:5432/subfy
spring.datasource.username=postgres
spring.datasource.password=SUA_SENHA_AQUI

spring.datasource.driver-class-name=org.postgresql.Driver

# ===============================
# JPA / HIBERNATE
# ===============================
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# ===============================
# SERVIDOR
# ===============================
server.port=8080

# ===============================
# JWT
# ===============================
jwt.secret=subfySecretKey123456789
jwt.expiration=86400000

# ===============================
# EMAIL (Gmail)
# ===============================
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=SEU_EMAIL@gmail.com
spring.mail.password=SUA_SENHA_DE_APP_GMAIL
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

> **Senha de app do Gmail:** Conta Google → Segurança → Verificação em duas etapas → Senhas de app

---

## 🚀 Como Rodar

### 1. Iniciar o PostgreSQL
Certifique-se de que o serviço do PostgreSQL está ativo.

### 2. Rodar o Backend

Abra um terminal e execute:

```bash
cd _subfy/subfy
mvn spring-boot:run
```

Aguarde até aparecer `Started SubfyApplication` no console.

### 3. Rodar o Frontend

Abra um **segundo terminal** e execute:

```bash
cd subfy-front
npm install
npm start
```

### 4. Acessar a Aplicação

Abra o navegador em:

```
http://localhost:3000
```

---

## 🌐 Portas Utilizadas

| Porta | Serviço |
|---|---|
| `:3000` | Frontend React |
| `:8080` | Backend Spring Boot (API REST) |
| `:5432` | PostgreSQL |

---

## 🔗 Endpoints da API

| Método | Endpoint | Descrição | Autenticação |
|---|---|---|---|
| POST | `/auth/register` | Cadastro de usuário | Não |
| POST | `/auth/login` | Login (retorna JWT) | Não |
| GET | `/subscriptions` | Listar todas as assinaturas | Sim |
| GET | `/subscriptions/{email}` | Listar assinaturas por usuário | Sim |
| POST | `/subscriptions` | Criar nova assinatura | Sim |
| PUT | `/subscriptions/{id}` | Atualizar assinatura | Sim |
| DELETE | `/subscriptions/{id}` | Deletar assinatura | Sim |

---

## 📧 Sistema de Notificações

O Subfy envia e-mails automáticos de alerta de vencimento todos os dias às **08:00**. O e-mail é disparado quando uma assinatura vence em:

- **3 dias**
- **1 dia**
- **Hoje (0 dias)**

Assinaturas com status `CANCELADA` ou sem e-mail vinculado são ignoradas.

---

## 🖥️ Telas da Aplicação

| Rota | Tela |
|---|---|
| `/` | Login |
| `/register` | Cadastro |
| `/dashboard` | Painel principal |
| `/subscriptions` | Gerenciar assinaturas |
| `/plans` | Planos disponíveis |
| `/profile` | Perfil do usuário |

---

## 👤 Autor

Desenvolvido por **Matteo Scaetano** como projeto acadêmico do curso de Análise e Desenvolvimento de Sistemas.
