export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Agendamento API",
    version: "1.0.0",
    description: "API de agendamentos clínicos com gerenciamento de clientes, serviços e status de consultas.",
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  tags: [
    { name: "Auth", description: "Autenticação e Login" },
    { name: "Users", description: "Gerenciamento de Usuários" },
    { name: "Services", description: "Gerenciamento de Serviços" },
    { name: "Appointments", description: "Gerenciamento de Agendamentos" }
  ],
  paths: {
    "/login": {
      post: {
        summary: "Autenticar usuário",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string" },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Sucesso. Retorna o Token JWT." },
          400: { description: "Email ou senha incorretos." }
        }
      }
    },
    "/users": {
      post: {
        summary: "Criar um novo usuário (Cliente ou Admin)",
        tags: ["Users"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  phone: { type: "string" },
                  password: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Usuário criado com sucesso" }
        }
      },
      get: {
        summary: "Listar todos os usuários (Apenas Admin)",
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Lista de usuários retornada com sucesso" }
        }
      }
    },
    "/services": {
      get: {
        summary: "Listar serviços disponíveis (Público)",
        tags: ["Services"],
        responses: {
          200: { description: "Lista de serviços retornada" }
        }
      },
      post: {
        summary: "Criar um novo serviço (Apenas Admin)",
        tags: ["Services"],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  price: { type: "number" },
                  duration_minutes: { type: "number" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Serviço criado" }
        }
      }
    },
    "/appointments": {
      post: {
        summary: "Criar um agendamento",
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
                  service_date: { type: "string", format: "date-time" }
                }
              }
            }
          }
        },
        responses: {
          201: { description: "Agendamento criado com status PENDING" },
          400: { description: "Conflito de horário ou data no passado" }
        }
      },
      get: {
        summary: "Listar todos os agendamentos da clínica (Apenas Admin)",
        tags: ["Appointments"],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Lista de agendamentos retornada" }
        }
      }
    }
  }
};
