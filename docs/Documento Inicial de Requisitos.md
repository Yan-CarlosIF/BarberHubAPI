# Documento Inicial de Requisitos

## BarberHub — Sistema de Gerenciamento de Barbearia

---

## 1. Identificação do Sistema

| Campo                  | Descrição                                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| **Nome do sistema**    | BarberHub                                                                                       |
| **Tipo de sistema**    | Sistema Web, Mobile e API REST para gerenciamento de barbearias                                 |
| **Responsáveis**       | Yan (desenvolvedor principal)                                                                   |
| **Data**               | Julho / 2025                                                                                    |
| **Versão do documento**| 1.0                                                                                             |

---

## 2. Visão Geral do Sistema

O **BarberHub** é um sistema multiplataforma (Web, Mobile e Backend API) cujo objetivo é 
modernizar e centralizar os processos operacionais, administrativos e de atendimento ao 
cliente de barbearias.

A solução permite o gerenciamento completo de agendamentos, clientes, serviços, 
profissionais (barbeiros), disponibilidade de horários e comunicação, oferecendo uma 
experiência moderna e intuitiva tanto para administradores quanto para clientes finais.

O sistema é composto por:

- **Website (Web App)** — desenvolvido com Next.js / React.
- **Aplicativo Mobile (Android e iOS)** — desenvolvido com React Native (Expo).
- **Servidor Backend (API REST)** — desenvolvido com Node.js, Express, Prisma ORM e PostgreSQL.

**Objetivos principais:**

- Facilitar o agendamento de cortes e serviços por clientes.
- Centralizar o gerenciamento da barbearia em uma única plataforma.
- Reduzir falhas manuais (agenda física, erros de horário, conflitos).
- Melhorar a experiência do cliente e a organização interna.
- Criar uma base escalável para futura transformação em SaaS (Software as a Service).

---

## 3. Escopo do Sistema

### 3.1 Website

#### 3.1.1 Landing Page
- Apresentação da barbearia
- Lista de serviços oferecidos com valores e duração
- Apresentação da equipe de barbeiros
- Horários de funcionamento
- Depoimentos de clientes
- Botões de chamada para ação (Agendar agora, Criar conta, Entrar)
- Informações de contato (telefone, WhatsApp, redes sociais, endereço)

#### 3.1.2 Sistema de Autenticação
- Cadastro de usuários (clientes e administradores)
- Login com e-mail e senha
- Recuperação de senha
- Autenticação segura via JWT (Bearer Token)

#### 3.1.3 Área do Cliente (Web)
- Visualização do perfil
- Histórico de agendamentos
- Agendamento de novos cortes (seleção de barbeiro, serviço, data e horário)
- Cancelamento e reagendamento
- Notificações sobre status do agendamento

#### 3.1.4 Área Administrativa (Web)
- Dashboard com métricas
- Visualização da agenda geral
- Gerenciamento de agendamentos (criar, editar, cancelar, alterar status)
- Gerenciamento de clientes
- Gerenciamento de barbeiros/profissionais
- Cadastro e edição de serviços (nome, descrição, preço, duração)
- Definição de horários de funcionamento e disponibilidade dos barbeiros
- Gerenciamento de bloqueios de horário dos barbeiros

### 3.2 Aplicativo Mobile

#### 3.2.1 Funcionalidades do Cliente
- Cadastro e login
- Visualização de serviços
- Seleção de barbeiro
- Seleção de data e horário disponíveis
- Agendamento de cortes
- Cancelamento e reagendamento
- Notificações push (confirmação, lembrete, cancelamento)
- Histórico de serviços

#### 3.2.2 Funcionalidades do Barbeiro
- Login
- Visualização da própria agenda
- Confirmação de atendimento
- Marcar serviço como concluído
- Bloqueio de horários indisponíveis

### 3.3 Backend (API)

#### 3.3.1 Principais Responsabilidades
- Autenticação e autorização (JWT, controle de roles)
- Gerenciamento de usuários (CLIENT, BARBER, ADMIN, SUPER_ADMIN)
- Gerenciamento de barbearias (CRUD)
- Gerenciamento de agendamentos (criação, listagem, atualização de status)
- Controle de disponibilidade e bloqueios dos barbeiros
- Gerenciamento de serviços e associação barbeiro–serviço
- Persistência de dados (PostgreSQL via Prisma ORM)
- Documentação da API (OpenAPI / Scalar)

#### 3.3.2 Entidades Principais
- User (id, name, email, password, role, barberShopId, isActive)
- BarberShop (id, slug, name, description, email, phone, city, street, state, cep)
- Barber (id, userId, barberShopId, specialty)
- Service (id, barberShopId, name, description, price, durationInMinutes, isActive)
- BarberService (id, barberId, serviceId)
- Schedule (id, barberShopId, clientId, barberId, serviceId, date, startTime, endTime, status)
- BarberAvailability (id, barberId, weekDay, startTime, endTime)
- BarberBlock (id, barberId, date, startTime, endTime)

---

## 4. Usuários e Stakeholders

### 4.1 Cliente Final
Usuário que acessa o sistema (web ou mobile) para visualizar serviços, barbeiros disponíveis 
e realizar agendamentos.

**Principais ações:**
- Criar e gerenciar sua conta
- Visualizar serviços, preços e profissionais disponíveis
- Realizar, cancelar ou reagendar agendamentos
- Visualizar histórico de atendimentos
- Receber notificações

### 4.2 Barbeiro / Profissional
Usuário responsável pela execução dos serviços.

**Principais ações:**
- Acessar sua agenda individual
- Visualizar detalhes dos agendamentos
- Confirmar presença do cliente
- Marcar atendimentos como concluídos ou não realizados (NO_SHOW)
- Bloquear horários indisponíveis
- Definir serviços que está apto a realizar

### 4.3 Administrador da Barbearia (ADMIN)
Usuário com controle total sobre a operação de uma barbearia específica.

**Principais ações:**
- Gerenciar clientes, barbeiros e serviços da sua barbearia
- Criar, editar e cancelar agendamentos
- Definir horários de funcionamento e disponibilidade dos barbeiros
- Visualizar métricas e relatórios
- Gerenciar bloqueios de horário

### 4.4 Super Administrador (SUPER_ADMIN)
Usuário responsável pela administração da plataforma como um todo.

**Principais ações:**
- Gerenciar múltiplas barbearias (criar, deletar, listar)
- Criar administradores para cada barbearia
- Acesso completo a todas as funcionalidades

---

## 5. Requisitos Funcionais

### 5.1 Autenticação e Controle de Acesso

| ID     | Requisito                                                                                         | Prioridade |
| ------ | ------------------------------------------------------------------------------------------------- | ---------- |
| RF01   | O sistema deve permitir cadastro de clientes com nome, e-mail, senha, telefone e data de nascimento | Alta       |
| RF02   | O sistema deve permitir login de usuários com e-mail e senha, retornando um token JWT              | Alta       |
| RF03   | O sistema deve possuir controle de acesso baseado em papéis (CLIENT, BARBER, ADMIN, SUPER_ADMIN)   | Alta       |

### 5.2 Gerenciamento de Barbearias e Administradores

| ID     | Requisito                                                                                         | Prioridade |
| ------ | ------------------------------------------------------------------------------------------------- | ---------- |
| RF04   | O SUPER_ADMIN deve poder criar, listar e deletar barbearias                                        | Alta       |
| RF05   | O SUPER_ADMIN deve poder criar administradores vinculados a uma barbearia                          | Alta       |

### 5.3 Gerenciamento de Barbeiros e Serviços

| ID     | Requisito                                                                                         | Prioridade |
| ------ | ------------------------------------------------------------------------------------------------- | ---------- |
| RF06   | O ADMIN deve poder cadastrar, editar e remover barbeiros da sua barbearia                          | Alta       |
| RF07   | O ADMIN deve poder cadastrar, editar, ativar/desativar e remover serviços                          | Alta       |
| RF08   | Cada serviço deve possuir nome, descrição, preço e duração em minutos                              | Alta       |
| RF09   | O sistema deve permitir associar serviços específicos a barbeiros específicos                       | Média      |

### 5.4 Disponibilidade e Bloqueios de Horário

| ID     | Requisito                                                                                         | Prioridade |
| ------ | ------------------------------------------------------------------------------------------------- | ---------- |
| RF10   | O ADMIN deve poder definir a disponibilidade semanal de cada barbeiro (dia da semana, hora início, hora fim) | Alta |
| RF11   | O ADMIN deve poder criar bloqueios de horário para barbeiros (data, hora início, hora fim)          | Alta       |
| RF12   | O cliente deve poder visualizar horários disponíveis em tempo real                                  | Alta       |

### 5.5 Agendamentos

| ID     | Requisito                                                                                         | Prioridade |
| ------ | ------------------------------------------------------------------------------------------------- | ---------- |
| RF13   | O cliente deve poder realizar agendamentos selecionando barbearia, barbeiro, serviço, data e horário | Alta     |
| RF14   | O sistema deve impedir conflitos de horário automaticamente                                         | Alta       |
| RF15   | O cliente deve poder cancelar ou reagendar agendamentos                                             | Alta       |
| RF16   | O ADMIN deve poder criar, editar e cancelar qualquer agendamento                                    | Alta       |
| RF17   | O sistema deve registrar o status do agendamento (SCHEDULED, COMPLETED, CANCELED, NO_SHOW)          | Alta       |
| RF18   | O barbeiro deve poder visualizar apenas seus próprios agendamentos                                  | Média      |
| RF19   | O ADMIN deve poder listar agendamentos por barbearia e por barbeiro                                 | Alta       |

### 5.6 Notificações e Comunicação

| ID     | Requisito                                                                                         | Prioridade |
| ------ | ------------------------------------------------------------------------------------------------- | ---------- |
| RF20   | O sistema deve enviar confirmação de agendamento ao cliente                                         | Média      |
| RF21   | O sistema deve enviar lembretes automáticos antes do horário                                        | Baixa      |
| RF22   | O sistema deve notificar alterações ou cancelamentos                                                | Média      |

### 5.7 Interface e Dashboard

| ID     | Requisito                                                                                         | Prioridade |
| ------ | ------------------------------------------------------------------------------------------------- | ---------- |
| RF23   | A landing page deve exibir serviços, equipe, preços e botões de ação                                | Alta       |
| RF24   | O ADMIN deve poder visualizar métricas de atendimentos no dashboard                                 | Baixa      |

---

## 6. Requisitos Não Funcionais

### 6.1 Usabilidade

| ID     | Requisito                                                                                          |
| ------ | -------------------------------------------------------------------------------------------------- |
| RNF01  | A interface web deve ser responsiva e intuitiva, adaptando-se a diferentes resoluções de tela       |
| RNF02  | O aplicativo mobile deve funcionar em Android (10+) e iOS (14+)                                    |
| RNF03  | O sistema deve fornecer mensagens de erro claras e orientativas ao usuário                          |
| RNF04  | A navegação entre funcionalidades deve exigir no máximo 3 cliques                                   |

### 6.2 Confiabilidade

| ID     | Requisito                                                                                          |
| ------ | -------------------------------------------------------------------------------------------------- |
| RNF05  | O sistema deve garantir disponibilidade mínima de 99% em horário comercial                          |
| RNF06  | O sistema deve impedir conflitos de agendamento mesmo sob acessos concorrentes                       |
| RNF07  | Os dados de cada barbearia devem ser isolados logicamente (multi-tenant por barberShopId)            |
| RNF08  | O sistema deve possuir testes unitários e e2e (Vitest + Supertest) para garantir integridade         |

### 6.3 Desempenho

| ID     | Requisito                                                                                          |
| ------ | -------------------------------------------------------------------------------------------------- |
| RNF09  | Consultas de horários disponíveis devem responder em menos de 500ms                                 |
| RNF10  | O sistema deve suportar múltiplos usuários simultâneos sem degradação perceptível                    |
| RNF11  | A arquitetura deve suportar múltiplas barbearias concorrentes (escalabilidade horizontal)            |

### 6.4 Segurança

| ID     | Requisito                                                                                          |
| ------ | -------------------------------------------------------------------------------------------------- |
| RNF12  | Senhas devem ser armazenadas com hash bcrypt (mínimo 10 rounds)                                    |
| RNF13  | O sistema deve utilizar autenticação via JWT (Bearer Token)                                        |
| RNF14  | Deve existir controle de permissões por perfil (middleware de auth e admin)                         |
| RNF15  | Validação de dados de entrada via Zod em todas as rotas da API                                     |
| RNF16  | Rotas protegidas devem exigir token JWT válido no header Authorization                              |

### 6.5 Distribuição

| ID     | Requisito                                                                                          |
| ------ | -------------------------------------------------------------------------------------------------- |
| RNF17  | O backend deve ser containerizado via Docker e orquestrado com Docker Compose                       |
| RNF18  | O sistema deve ser composto por três camadas independentes: API, Web e Mobile                        |
| RNF19  | A comunicação entre frontend e backend deve ocorrer exclusivamente via API REST                      |

### 6.6 Padrões

| ID     | Requisito                                                                                          |
| ------ | -------------------------------------------------------------------------------------------------- |
| RNF20  | A API deve possuir documentação OpenAPI 3.1 acessível em /docs                                     |
| RNF21  | O código deve seguir padrões definidos pelo Biome (linter/formatter)                               |
| RNF22  | O backend deve seguir arquitetura modular com injeção de dependências (tsyringe)                    |
| RNF23  | As migrações de banco devem ser versionadas via Prisma Migrate                                      |

### 6.7 Hardware e Software

| ID     | Requisito                                                                                          |
| ------ | -------------------------------------------------------------------------------------------------- |
| RNF24  | O servidor deve executar em ambiente com Node.js 18+ e sistema operacional Linux                    |
| RNF25  | O banco de dados deve ser PostgreSQL 14+                                                            |
| RNF26  | O ambiente de desenvolvimento requer pnpm, Docker e Docker Compose instalados                       |
| RNF27  | O cliente web requer navegador com suporte a JavaScript moderno (ES2020+)                           |
| RNF28  | O cliente mobile requer dispositivo com Android 10+ ou iOS 14+                                      |

---

## 7. Restrições e Premissas

### 7.1 Restrições
- O backend roda na porta 3333 por padrão.
- O frontend web roda na porta 3000 por padrão.
- O banco de dados PostgreSQL deve estar acessível via Docker Compose.
- As rotas protegidas exigem token JWT válido no header Authorization.
- Operações administrativas exigem role ADMIN vinculado à mesma barbearia, ou SUPER_ADMIN.
- O frontend web e o aplicativo mobile estão em estágio inicial de desenvolvimento.

### 7.2 Premissas
- O cliente possui acesso à internet para utilizar o sistema.
- O navegador do cliente suporta JavaScript moderno.
- O dispositivo mobile possui Android 10+ ou iOS 14+.
- O ambiente de desenvolvimento possui Node.js 18+, pnpm e Docker instalados.

---

## 8. Rastreabilidade (ligação com o documento inicial)

| Seção deste documento        | Base no ERS / Código-fonte                                                  |
| ---------------------------- | --------------------------------------------------------------------------- |
| Identificação do Sistema     | ERS barber shop.md § 1                                                      |
| Visão Geral                  | ERS barber shop.md § 1, § 2                                                |
| Escopo do Sistema            | ERS barber shop.md § 4; rotas em server/src/shared/infra/http/routes        |
| Usuários e Stakeholders      | ERS barber shop.md § 3; roles em server/src/@types/express/index.d.ts       |
| Requisitos Funcionais        | ERS barber shop.md § 5; controllers e services do backend                   |
| Requisitos Não Funcionais    | ERS barber shop.md § 6; middlewares, Docker, Vitest configs                 |
| Restrições e Premissas       | server/.env.example, docker-compose.yml, package.json                       |

---

## 9. Tecnologias Utilizadas

| Camada           | Tecnologia                                                        |
| ---------------- | ----------------------------------------------------------------- |
| Frontend Web     | Next.js, React, TailwindCSS, shadcn/ui, React Query, TypeScript  |
| Mobile           | React Native (Expo), NativeWind, Gluestack UI, TypeScript         |
| Backend          | Node.js, Express, TypeScript, tsyringe (DI)                      |
| Banco de Dados   | PostgreSQL                                                        |
| ORM              | Prisma                                                            |
| Autenticação     | JWT (jsonwebtoken), bcrypt                                        |
| Validação        | Zod, zod-openapi                                                  |
| Documentação API | OpenAPI 3.1, Scalar                                               |
| Testes           | Vitest, Supertest                                                 |
| Linter/Formatter | Biome                                                             |
| Infraestrutura   | Docker, Docker Compose                                            |

---

## 10. Requisitos Futuros (Roadmap)

- Sistema de pagamento online
- Assinaturas mensais (modelo SaaS)
- Programa de fidelidade para clientes
- Avaliação e feedback de serviços
- Relatórios financeiros avançados
- Integração com Google Calendar
- Suporte a multi-unidades (franquias)
- Recuperação de senha por e-mail
- Notificações push no aplicativo mobile