export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "📅 Agendamento API",
    version: "1.0.0",
    description:
      "API completa para agendamentos clínicos. Possui sistema de controle de acesso (RBAC) com níveis de Cliente e Administrador, gestão completa de serviços e transições de status de consultas.",
    contact: {
      name: "Suporte API",
      email: "contato@clinica.com",
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Insira o token JWT retornado pela rota de login.",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          user_id: { type: "string", format: "uuid" },
          name: { type: "string", example: "Maria Silva" },
          email: { type: "string", example: "maria@email.com" },
          phone: { type: "string", example: "11999999999" },
          role: { type: "string", enum: ["CLIENT", "ADMIN"], example: "CLIENT" },
          active: { type: "boolean", example: true },
          created_at: { type: "string", format: "date-time" },
        },
      },
      Service: {
        type: "object",
        properties: {
          service_id: { type: "string", format: "uuid" },
          name: { type: "string", example: "Limpeza de Pele" },
          price: { type: "number", example: 150.0 },
          duration_minutes: { type: "integer", example: 60 },
          active: { type: "boolean", example: true },
        },
      },
      Appointment: {
        type: "object",
        properties: {
          appointment_id: { type: "string", format: "uuid" },
          service_date: { type: "string", format: "date-time" },
          appointment_status: {
            type: "string",
            enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELED"],
            example: "PENDING",
          },
          user_id: { type: "string", format: "uuid" },
          service_id: { type: "string", format: "uuid" },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: { type: "string", example: "Mensagem detalhada do erro (ex: Validation error)" },
        },
      },
    },
    parameters: {
      userIdParam: {
        name: "user_id",
        in: "path",
        required: true,
        schema: { type: "string", format: "uuid" },
        description: "ID único do usuário",
      },
      serviceIdParam: {
        name: "service_id",
        in: "path",
        required: true,
        schema: { type: "string", format: "uuid" },
        description: "ID único do serviço",
      },
      appointmentIdParam: {
        name: "appointment_id",
        in: "path",
        required: true,
        schema: { type: "string", format: "uuid" },
        description: "ID único do agendamento",
      },
    },
  },
  tags: [
    { name: "Auth", description: "Rotas públicas de autenticação" },
    { name: "Users", description: "Gerenciamento de clientes e administradores" },
    { name: "Services", description: "Catálogo de tratamentos oferecidos" },
    { name: "Appointments", description: "Gerenciamento de marcações e status" },
  ],
  paths: {
    "/login": {
      post: {
        summary: "Autenticar usuário",
        description: "Gera um token JWT válido para acessar rotas protegidas.",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "admin@clinica.com" },
                  password: { type: "string", example: "123456" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Token gerado com sucesso.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR..." },
                  },
                },
              },
            },
          },
          400: { $ref: "#/components/schemas/Error" },
        },
      },
    },
    "/users": {
      post: {
        summary: "Cadastrar usuário",
        description: "Rota pública para cadastro de novos clientes.",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Maria Silva" },
                  email: { type: "string", example: "maria@email.com" },
                  phone: { type: "string", example: "11999999999" },
                  password: { type: "string", example: "senhaSegura123" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "Usuário criado com sucesso",
            content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } },
          },
          400: { $ref: "#/components/schemas/Error" },
        },
      },
      get: {
        summary: "Listar usuários (Admin)",
        description: "Retorna todos os usuários ativos do sistema.",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Lista de usuários",
            content: {
              "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/User" } } },
            },
          },
          403: { description: "Acesso negado (Requer Admin)" },
        },
      },
    },
    "/users/{user_id}": {
      get: {
        summary: "Buscar perfil do usuário",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/userIdParam" }],
        responses: {
          200: {
            description: "Dados do usuário",
            content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } },
          },
        },
      },
      put: {
        summary: "Atualizar dados do usuário",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/userIdParam" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Maria Souza" },
                  phone: { type: "string", example: "11988888888" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Usuário atualizado" },
        },
      },
      delete: {
        summary: "Deletar conta do usuário",
        description: "Realiza o soft-delete (inativa) a conta.",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/userIdParam" }],
        responses: {
          200: { description: "Conta inativada com sucesso" },
        },
      },
    },
    "/services": {
      get: {
        summary: "Listar serviços",
        description: "Retorna catálogo de serviços (Público).",
        tags: ["Services"],
        responses: {
          200: {
            description: "Catálogo",
            content: {
              "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Service" } } },
            },
          },
        },
      },
      post: {
        summary: "Criar novo serviço (Admin)",
        tags: ["Services"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Peeling Facial" },
                  price: { type: "number", example: 200.0 },
                  duration_minutes: { type: "integer", example: 45 },
                },
              },
            },
          },
        },
        responses: { 201: { description: "Serviço criado" } },
      },
    },
    "/services/{service_id}": {
      get: {
        summary: "Buscar serviço por ID",
        tags: ["Services"],
        parameters: [{ $ref: "#/components/parameters/serviceIdParam" }],
        responses: { 200: { description: "Sucesso" } },
      },
      put: {
        summary: "Atualizar serviço (Admin)",
        tags: ["Services"],
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/serviceIdParam" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { price: { type: "number", example: 220.0 } },
              },
            },
          },
        },
        responses: { 200: { description: "Atualizado" } },
      },
      delete: {
        summary: "Deletar serviço (Admin)",
        tags: ["Services"],
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/serviceIdParam" }],
        responses: { 200: { description: "Deletado" } },
      },
    },
    "/appointments": {
      post: {
        summary: "Criar Agendamento",
        description: "O cliente deve estar autenticado.",
        tags: ["Appointments"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  service_id: { type: "string", format: "uuid" },
                  service_date: { type: "string", format: "date-time", example: "2024-12-01T14:30:00.000Z" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Agendamento Criado (PENDING)" },
          400: { description: "Data inválida ou horário já ocupado" },
        },
      },
      get: {
        summary: "Listar agenda global (Admin)",
        tags: ["Appointments"],
        security: [{ bearerAuth: [] }],
        responses: { 200: { description: "Todos os agendamentos da clínica" } },
      },
    },
    "/appointments/users/{user_id}": {
      get: {
        summary: "Histórico do cliente",
        tags: ["Appointments"],
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/userIdParam" }],
        responses: { 200: { description: "Lista filtrada por cliente" } },
      },
    },
    "/appointments/{appointment_id}/confirm": {
      put: {
        summary: "Confirmar Agendamento (Admin)",
        description: "Muda status de PENDING para CONFIRMED.",
        tags: ["Appointments"],
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/appointmentIdParam" }],
        responses: { 200: { description: "Confirmado com sucesso" } },
      },
    },
    "/appointments/{appointment_id}/complete": {
      put: {
        summary: "Completar Agendamento (Admin)",
        description: "Muda status de CONFIRMED para COMPLETED.",
        tags: ["Appointments"],
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/appointmentIdParam" }],
        responses: { 200: { description: "Finalizado com sucesso" } },
      },
    },
    "/appointments/{appointment_id}": {
      delete: {
        summary: "Cancelar Agendamento",
        description: "Muda status para CANCELED (Soft Delete).",
        tags: ["Appointments"],
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: "#/components/parameters/appointmentIdParam" }],
        responses: { 200: { description: "Cancelado" } },
      },
    },
  },
};
