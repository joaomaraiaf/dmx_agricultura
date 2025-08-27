# DMX - Sistema de Gestão Agrícola

Sistema completo para gestão de talhões e atividades agrícolas com frontend Next.js, backend Node.js e banco PostgreSQL.

## 🚀 Executando com Docker

### Pré-requisitos
- Docker
- Docker Compose

### Instruções

1. **Clone o repositório e navegue até a pasta:**
   ```bash
   cd dmx
   ```

2. **Execute o projeto completo:**
   ```bash
   docker-compose up --build
   ```

3. **Acesse as aplicações:**
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:4000
   - **Banco PostgreSQL:** localhost:5432

### Serviços

- **database**: PostgreSQL 15 com inicialização automática das tabelas
- **backend**: API Node.js 20 com TypeScript
- **frontend**: Aplicação Next.js com React

### Variáveis de Ambiente

O projeto usa as seguintes variáveis (já configuradas no docker-compose.yml):

```env
# Banco de dados
DB_HOST=database
DB_PORT=5432
DB_NAME=dmx_db
DB_USER=dmx_user
DB_PASS=dmx_password

# JWT
JWT_SECRET=supersecret-dev-key
JWT_EXPIRES=24h

# API
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### Comandos Úteis

```bash
# Iniciar todos os serviços
docker-compose up

# Iniciar em background
docker-compose up -d

# Rebuild das imagens
docker-compose up --build

# Parar todos os serviços
docker-compose down

# Ver logs de um serviço específico
docker-compose logs frontend
docker-compose logs backend
docker-compose logs database

# Executar comandos no backend
docker-compose exec backend npm run migrate:latest
```

## 📋 Funcionalidades

- **Autenticação JWT**
- **Gestão de Talhões** (criação, edição, visualização, exclusão)
- **Mapeamento Interativo** com Leaflet
- **Gestão de Atividades Agrícolas**
- **Dashboard com Estatísticas**
- **Interface Responsiva**

## 🛠️ Tecnologias

### Backend
- Node.js 20
- TypeScript
- Express.js
- PostgreSQL
- Knex.js
- JWT
- bcrypt

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Leaflet (mapas)
- Axios

### Infraestrutura
- Docker
- Docker Compose
- PostgreSQL 15