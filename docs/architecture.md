# BarberHubAPI - Arquitetura e Diagrama

## 📋 Resumo

O **BarberHubAPI** é uma API REST desenvolvida em **TypeScript** com **Express.js**, utilizando uma arquitetura modular baseada em **Domain-Driven Design (DDD)** com **Clean Architecture**. O projeto implementa padrões SOLID, injeção de dependência via **TSyringe** e persistência de dados com **Prisma** em **PostgreSQL**.

---

## 🏗️ Análise da Arquitetura

### 1. **Stack Tecnológico**

```
Frontend (CORS) ← → Express.js (HTTP Server)
                       ↓
                   Middleware Layer
                   (Auth, Error Handler)
                       ↓
                   Routing Layer
                       ↓
                   Controllers
                       ↓
                   Services (Business Logic)
                       ↓
                   Repositories (Data Access)
                       ↓
                   Prisma ORM
                       ↓
                   PostgreSQL Database
```

**Dependências Principais:**
- **Express 5.2.1**: Framework web
- **Prisma 7.3.0**: ORM e migrações de banco
- **TSyringe 4.10.0**: Injeção de dependência
- **JWT**: Autenticação (jsonwebtoken 9.0.3)
- **Bcrypt**: Hash de senhas
- **Zod**: Validação de schemas
- **Biome**: Linting e formatação

---

### 2. **Estrutura de Diretórios**

```
src/
├── @types/                    # Type definitions customizadas
├── config/                    # Configurações globais
│   └── env/                  # Variáveis de ambiente
├── modules/                   # Módulos de domínio (Feature modules)
│   ├── User/                 # Autenticação e gerencimento de usuários
│   ├── BarberShop/           # Gerencimento de barbearias
│   ├── Barber/               # Gerencimento de barbeiros
│   ├── Schedule/             # Agendamentos
│   └── Service/              # Serviços de barbearia
├── shared/                    # Código compartilhado
│   ├── container/            # DI Container (TSyringe)
│   ├── errors/               # Tratamento de erros
│   ├── infra/                # Infraestrutura
│   │   └── http/
│   │       ├── server.ts     # Inicialização servidor
│   │       ├── app.ts        # Configuração Express
│   │       ├── routes/       # Rotas agregadas
│   │       └── middleware/
│   ├── prisma/               # Client Prisma
│   └── test/                 # Utilitários de teste
└── utils/                     # Funções utilitárias
```

---

### 3. **Padrão de Módulo (Feature Module)**

Cada módulo segue o padrão **modular**: User, BarberShop, Barber, Schedule, Service

```
Module/
├── dtos/                      # Data Transfer Objects
│   └── request/response DTOs
├── infra/                     # Infraestrutura do módulo
│   ├── http/
│   │   ├── controllers/       # Handlers de requisições HTTP
│   │   └── routes/            # Definição de rotas
│   └── prisma/
│       └── repositories/      # Implementação Prisma
├── mapper/                    # Mappers (Entity ↔ DTO)
├── repositories/              # Interfaces de repositórios (abstrações)
└── services/                  # Use cases / Business logic
    ├── service1/
    ├── service2/
    └── ...
```

---

### 4. **Fluxo de Requisição**

```
HTTP Request
    ↓
Express Middleware (CORS, JSON Parser)
    ↓
Route Handler (appRoutes)
    ↓
Controller (ex: ListBarberShopsController)
    ↓
Service/Use Case (ex: ListBarberShopsService)
    ↓
Repository (ex: BarberShopPrismaRepository)
    ↓
Prisma Client
    ↓
PostgreSQL
    ↓
Response (JSON)
```

---

### 5. **Módulos Principais**

| Módulo | Responsabilidade | Serviços |
|--------|------------------|----------|
| **User** | Autenticação, autorização, admin | registerClient, login, createAdmin, deleteAdmin, listAdmins |
| **BarberShop** | CRUD de barbearias, endereço, horários | createBarberShop, listBarberShops, getBarberShop, deleteBarberShop, listWithPagination |
| **Barber** | Gerencimento de barbeiros | createBarber, updateBarber, deleteBarber, setBarberAvailability, assignServices, createBarberBlock |
| **Schedule** | Agendamentos de clientes | createSchedule, cancelSchedule, updateScheduleStatus, listSchedulesByClient/Barber/BarberShop |
| **Service** | Serviços oferecidos pela barbearia | createService, updateService, deleteService, listServices |

---

### 6. **Banco de Dados - Entidades Principais**

```
BarberShop (Central)
├── BarberShopImage          # Galeria e logos
├── BarberShopOpeningHours   # Horários de funcionamento
├── User                      # Usuários ligados à barbearia
├── Barber                    # Barbeiros
├── Service                   # Serviços
├── Schedule                  # Agendamentos
└── Rating                    # Avaliações

User
├── Client                    # Extensão para cliente
└── Barber                    # Extensão para barbeiro

Barber
├── BarberService             # Serviços que oferece
├── BarberAvailability        # Disponibilidade semanal
└── BarberBlock               # Bloqueios de tempo

Schedule
├── Client
├── Barber
├── Service
└── BarberShop
```

## Padrões de Design Implementados

1. **Repository Pattern**: Abstração da camada de dados
2. **Service Layer**: Lógica de negócio concentrada
3. **DTO (Data Transfer Object)**: Separação entre entidade e transferência
4. **Dependency Injection**: Desacoplamento e testabilidade
5. **Factory Pattern**: Criação de instâncias via container
6. **Error Handling**: Middleware centralizado
7. **Mapper Pattern**: Transformação Entity ↔ DTO
8. **Strategy Pattern**: Diferentes implementações de repositórios

---
