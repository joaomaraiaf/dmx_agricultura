# Testes Automatizados - Backend DMX

## 📋 Estrutura de Testes

O backend possui testes automatizados para garantir a qualidade e funcionamento correto da API.

### 🧪 Tipos de Testes Implementados

#### 1. Testes de Autenticação (`auth.test.ts`)
- **Registro de usuário**
  - ✅ Criação de usuário com dados válidos
  - ✅ Validação de email duplicado
  - ✅ Validação de campos obrigatórios

- **Login de usuário**
  - ✅ Login com credenciais válidas
  - ✅ Falha com email inexistente
  - ✅ Falha com senha incorreta

- **Validação JWT**
  - ✅ Acesso a rotas protegidas com token válido
  - ✅ Bloqueio sem token
  - ✅ Bloqueio com token inválido

#### 2. Testes CRUD de Talhões (`plots.test.ts`)
- **Criação de talhões**
  - ✅ Criação com dados válidos
  - ✅ Validação de campos obrigatórios
  - ✅ Validação de coordenadas

- **Listagem de talhões**
  - ✅ Listagem por usuário autenticado
  - ✅ Isolamento entre usuários

- **Atualização de talhões**
  - ✅ Atualização de dados
  - ✅ Validação de propriedade (apenas owner)

- **Exclusão de talhões**
  - ✅ Exclusão com sucesso
  - ✅ Validação de propriedade

- **Atividades de talhões**
  - ✅ Criação de atividades
  - ✅ Listagem de atividades por talhão

## 🚀 Executando os Testes

### Pré-requisitos
```bash
# Instalar dependências
npm install
```

### Comandos de Teste

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch (desenvolvimento)
npm run test:watch

# Executar testes com relatório de cobertura
npm run test:coverage

# Executar teste específico
npm test -- auth.test.ts
npm test -- plots.test.ts
```

### 📊 Relatório de Cobertura

Após executar `npm run test:coverage`, será gerado um relatório em:
- **Terminal**: Resumo da cobertura
- **HTML**: `coverage/lcov-report/index.html`

## ⚙️ Configuração

### Jest Configuration (`jest.config.js`)
- **Preset**: `ts-jest` para TypeScript
- **Environment**: `node`
- **Test Match**: Arquivos `*.test.ts` e `*.spec.ts`
- **Coverage**: Coleta de cobertura automática
- **Setup**: Arquivo de configuração global

### Dependências de Teste
- **Jest**: Framework de testes
- **Supertest**: Testes de API HTTP
- **ts-jest**: Suporte TypeScript
- **@types/jest**: Tipos TypeScript para Jest
- **@types/supertest**: Tipos TypeScript para Supertest

## 🗄️ Dados de Teste

### Usuário de Teste (Seed)
```json
{
  "name": "teste",
  "email": "teste@gmail.com",
  "password": "123"
}
```

### Talhão de Teste (Seed)
```json
{
  "name": "Talhão 1",
  "culture": "Soja",
  "coordinates": [[-23.5503,-46.6339],[-23.551,-46.632],[-23.549,-46.6315],[-23.5503,-46.6339]],
  "area": 12.34,
  "point_count": 4
}
```

### Atividade de Teste (Seed)
```json
{
  "activity_name": "Adubação",
  "activity_details": "Aplicado NPK 20-05-20",
  "activity_date": "2025-08-26"
}
```

## 🔧 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com banco**
   ```bash
   # Verificar se PostgreSQL está rodando
   docker-compose up database
   ```

2. **Testes falhando por dados residuais**
   ```bash
   # Limpar banco de teste
   npm run migrate:rollback
   npm run migrate:latest
   ```

3. **Dependências não instaladas**
   ```bash
   # Reinstalar dependências
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📈 Métricas de Qualidade

### Cobertura Mínima Esperada
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

### Arquivos Testados
- ✅ Controllers (auth, plots)
- ✅ Middlewares (authentication)
- ✅ Models (user, plot operations)
- ✅ Routes (protected endpoints)

## 🚀 CI/CD Integration

Os testes podem ser integrados em pipelines de CI/CD:

```yaml
# Exemplo GitHub Actions
- name: Run Tests
  run: |
    npm install
    npm test
    npm run test:coverage
```