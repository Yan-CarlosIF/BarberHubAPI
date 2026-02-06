# Documento de Requisitos

## Sistema de Gerenciamento de Barbearia (Web, App e Backend)

---

## 1. Visão Geral do Projeto

O presente documento descreve os requisitos funcionais e não funcionais de um **Sistema de Gerenciamento de Barbearia**, solicitado pelo cliente com o objetivo de modernizar e centralizar os processos operacionais, administrativos e de atendimento ao cliente da barbearia.

O sistema será multiplataforma, composto por:

* **Website (Web App)**
* **Aplicativo Mobile (Android e iOS)**
* **Servidor Backend (API)**

A solução deverá permitir o gerenciamento de agendamentos, clientes, serviços, profissionais, pagamentos e comunicação, além de oferecer uma experiência moderna e intuitiva tanto para administradores quanto para clientes finais.

---

## 2. Objetivos do Sistema

* Facilitar o **agendamento de cortes e serviços** por clientes.
* Centralizar o **gerenciamento da barbearia** em uma única plataforma.
* Reduzir falhas manuais (agenda física, erros de horário, conflitos).
* Melhorar a **experiência do cliente** e a organização interna.
* Criar uma base escalável para futura transformação em um **SaaS (Software as a Service)**.

---

## 3. Perfis e Tipos de Usuário

O sistema contará com diferentes tipos de usuários, cada um com permissões específicas, garantindo segurança, organização e controle adequado das funcionalidades.

### 3.1 Cliente

Usuário responsável por consumir os serviços da barbearia.

**Permissões e responsabilidades:**

* Criar e gerenciar sua conta
* Visualizar serviços, preços e profissionais disponíveis
* Realizar agendamentos
* Cancelar ou reagendar cortes dentro das regras definidas
* Visualizar histórico de atendimentos
* Receber notificações por e-mail, push ou mensagem

### 3.2 Barbeiro / Profissional

Usuário responsável pela execução dos serviços.

**Permissões e responsabilidades:**

* Acessar sua agenda individual
* Visualizar detalhes dos agendamentos
* Confirmar presença do cliente
* Marcar atendimentos como concluídos ou não realizados
* Bloquear horários indisponíveis
* Definir serviços que está apto a realizar

### 3.3 Administrador da Barbearia

Usuário com controle total sobre a operação da barbearia.

**Permissões e responsabilidades:**

* Gerenciar clientes, barbeiros e serviços
* Criar, editar e cancelar agendamentos
* Definir horários de funcionamento
* Configurar regras de cancelamento
* Visualizar métricas e relatórios
* Gerenciar notificações e comunicações

### 3.4 Super Administrador

Usuário responsável pela administração da plataforma como um todo.

**Permissões e responsabilidades:**

* Gerenciar múltiplas barbearias
* Controlar planos, assinaturas e limites
* Acessar métricas globais do sistema
* Gerenciar permissões administrativas

---

## 4. Escopo do Sistema

### 4.1 Website

#### 4.1.1 Landing Page

A landing page deverá conter:

* Apresentação da barbearia
* Lista de serviços oferecidos
* Valores iniciais ou faixa de preços
* Apresentação da equipe
* Horários de funcionamento
* Depoimentos de clientes
* Botões de chamada para ação (Agendar agora, Criar conta, Entrar)
* Informações de contato (telefone, WhatsApp, redes sociais, endereço)

#### 4.1.2 Sistema de Autenticação

* Cadastro de usuários (clientes e administradores)
* Login com e-mail e senha
* Recuperação de senha
* Confirmação de e-mail
* Autenticação segura (JWT / Cookies HTTP-only)

#### 4.1.3 Área do Cliente (Web)

* Visualização do perfil
* Histórico de agendamentos
* Agendamento de novos cortes
* Cancelamento e reagendamento
* Notificações sobre status do agendamento

#### 4.1.4 Área Administrativa (Web)

* Dashboard com métricas
* Visualização da agenda geral
* Gerenciamento de agendamentos (criar, editar, cancelar)
* Gerenciamento de clientes
* Gerenciamento de barbeiros/profissionais
* Cadastro e edição de serviços
* Definição de preços e duração dos serviços
* Definição de horários de funcionamento

---

### 4.2 Aplicativo Mobile

#### 4.2.1 Funcionalidades do Cliente

* Cadastro e login
* Visualização de serviços
* Seleção de barbeiro
* Seleção de data e horário disponíveis
* Agendamento de cortes
* Cancelamento e reagendamento
* Notificações push (confirmação, lembrete, cancelamento)
* Histórico de serviços

#### 4.2.2 Funcionalidades do Barbeiro

* Login
* Visualização da própria agenda
* Confirmação de atendimento
* Marcar serviço como concluído
* Bloqueio de horários indisponíveis

---

### 4.3 Backend (Servidor)

O backend será responsável por toda a regra de negócio do sistema.

#### 4.3.1 Principais Responsabilidades

* Autenticação e autorização
* Gerenciamento de usuários
* Gerenciamento de agendamentos
* Controle de disponibilidade
* Integração com notificações
* Persistência de dados

#### 4.3.2 Entidades Principais

* Usuário
* Cliente
* Barbeiro
* Serviço
* Agendamento
* Horário
* Pagamento (opcional/futuro)

---

## 5. Requisitos Funcionais

Os requisitos funcionais descrevem as funcionalidades que o sistema deverá oferecer para atender às necessidades dos usuários.

### 5.1 Autenticação e Usuários

* O sistema deve permitir cadastro e login de usuários
* Deve existir controle de acesso baseado em papéis (RBAC)
* O usuário deve poder recuperar sua senha (opcional)
* O sistema deve permitir ativação e desativação de contas (opcional)

### 5.2 Agendamentos

* O cliente deve visualizar horários disponíveis em tempo real
* O sistema deve impedir conflitos de horário automaticamente
* O cliente deve poder cancelar ou reagendar dentro das regras
* O administrador pode criar, editar ou cancelar qualquer agendamento
* O barbeiro deve visualizar apenas seus próprios agendamentos
* O sistema deve registrar o status do agendamento (agendado, confirmado, concluído, cancelado)

### 5.3 Serviços

* O administrador deve cadastrar, editar e remover serviços
* Cada serviço deve possuir nome, descrição, preço e duração
* Serviços podem ser ativados ou desativados

### 5.4 Profissionais

* O administrador deve cadastrar barbeiros
* O barbeiro deve possuir agenda própria
* O sistema deve permitir associar serviços a profissionais específicos
* O administrador pode definir horários de trabalho e folgas

### 5.5 Notificações e Comunicação

* O sistema deve enviar confirmação de agendamento
* Deve enviar lembretes automáticos antes do horário
* Deve notificar alterações ou cancelamentos
* O canal de envio pode ser e-mail, push ou mensagem

### 5.6 Relatórios e Métricas

* O administrador deve visualizar número de atendimentos
* Deve ser possível consultar agenda por período
* O sistema deve gerar métricas de desempenho

---

## 6. Requisitos Não Funcionais

Os requisitos não funcionais definem atributos de qualidade do sistema.

### 6.1 Segurança

* Senhas devem ser armazenadas de forma criptografada
* O sistema deve utilizar autenticação segura
* Deve existir controle de permissões por perfil
* Dados sensíveis devem ser protegidos

### 6.2 Performance

* Consultas de horários devem responder rapidamente
* O sistema deve suportar múltiplos usuários simultâneos
* Operações críticas devem ser otimizadas

### 6.3 Escalabilidade

* A arquitetura deve suportar múltiplas barbearias (multi-tenant)
* Os dados de cada barbearia devem ser isolados
* Deve ser possível adicionar novas funcionalidades sem impacto

### 6.4 Disponibilidade e Confiabilidade

* O sistema deve possuir alta disponibilidade
* Falhas devem ser registradas para auditoria
* Deve haver mecanismos de recuperação de erro

### 6.5 Usabilidade

* Interface simples e intuitiva
* Design responsivo
* Fluxos claros para agendamento e gestão

---

## 7. Requisitos Futuros (Roadmap)

* Sistema de pagamento online
* Assinaturas mensais (SaaS)
* Programa de fidelidade
* Avaliação de serviços
* Relatórios financeiros avançados
* Integração com Google Calendar
* Multi-unidades (franquias)

---

## 8. Considerações Finais

Este documento representa uma visão inicial e detalhada dos requisitos do sistema de gerenciamento de barbearia. Ele foi elaborado com foco em um cliente real, prevendo crescimento, escalabilidade e futura comercialização como SaaS.

O sistema deverá ser desenvolvido de forma modular, segura e escalável, permitindo evoluções constantes sem comprometer a base existente.
