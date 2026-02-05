import swaggerJsdoc from 'swagger-jsdoc'

export const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Trash Route API',
            version: '1.0.0',
            description: 'API de Gestão de Resíduos - Trash Route'
        },
        servers: [
            {
                url: 'http://localhost:3333'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        nome: { type: 'string' },
                        email: { type: 'string' },
                        role: { type: 'string' },
                        isAdmin: { type: 'string', example: 's' }
                    }
                },
                PEV: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        nome: { type: 'string' },
                        descricao: { type: 'string' },
                        localizacao: {
                            type: 'object',
                            properties: {
                                type: { type: 'string', example: 'Point' },
                                coordinates: {
                                    type: 'array',
                                    items: { type: 'number' }
                                }
                            }
                        }
                    }
                },
                Entrega: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        usuarioId: { type: 'string' },
                        pevId: { type: 'string' },
                        imagemUrl: { type: 'string' },
                        dataEntrega: { type: 'string', format: 'date-time' }
                    }
                }
            }
        },
        paths: {

            // ================= AUTH =================
            '/auth/register': {
                post: {
                    tags: ['Auth'],
                    summary: 'Registrar novo usuário',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        nome: { type: 'string' },
                                        email: { type: 'string' },
                                        senha: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Usuário criado com sucesso' },
                        409: { description: 'Email já cadastrado' }
                    }
                }
            },

            '/auth/login': {
                post: {
                    tags: ['Auth'],
                    summary: 'Login do usuário',
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        email: { type: 'string' },
                                        senha: { type: 'string' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        200: { description: 'Login realizado com sucesso' },
                        401: { description: 'Credenciais inválidas' }
                    }
                }
            },

            // ================= USUÁRIOS =================
            '/usuarios': {
                get: {
                    tags: ['Usuários'],
                    summary: 'Listar usuários',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: 'Lista de usuários' }
                    }
                }
            },

            '/usuarios/{id}/promover': {
                patch: {
                    tags: ['Usuários'],
                    summary: 'Promover usuário a admin',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        200: { description: 'Usuário promovido' },
                        404: { description: 'Usuário não encontrado' }
                    }
                }
            },

            '/usuarios/{id}': {
                delete: {
                    tags: ['Usuários'],
                    summary: 'Excluir usuário',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        200: { description: 'Usuário excluído' },
                        404: { description: 'Usuário não encontrado' }
                    }
                }
            },

            // ================= PEVs =================
            '/pevs': {
                get: {
                    tags: ['PEVs'],
                    summary: 'Listar PEVs',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: 'Lista de PEVs' }
                    }
                },
                post: {
                    tags: ['PEVs'],
                    summary: 'Criar PEV',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        nome: { type: 'string' },
                                        descricao: { type: 'string' },
                                        latitude: { type: 'number' },
                                        longitude: { type: 'number' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'PEV criado' }
                    }
                }
            },

            '/pevs/{id}': {
                get: {
                    tags: ['PEVs'],
                    summary: 'Buscar PEV por ID',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        200: { description: 'PEV encontrado' },
                        404: { description: 'PEV não encontrado' }
                    }
                },
                patch: {
                    tags: ['PEVs'],
                    summary: 'Atualizar PEV',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            required: true,
                            schema: { type: 'string' }
                        }
                    ],
                    responses: {
                        200: { description: 'PEV atualizado' }
                    }
                },
                delete: {
                    tags: ['PEVs'],
                    summary: 'Excluir PEV',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: 'PEV excluído' }
                    }
                }
            },

            // ================= ENTREGAS =================
            '/entregas': {
                post: {
                    tags: ['Entregas'],
                    summary: 'Criar entrega',
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            'multipart/form-data': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        pevId: { type: 'string' },
                                        imagem: { type: 'string', format: 'binary' }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: 'Entrega criada' }
                    }
                }
            },

            '/entregas/minhas': {
                get: {
                    tags: ['Entregas'],
                    summary: 'Listar minhas entregas',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: 'Lista de entregas do usuário' }
                    }
                }
            }

        }
    },
    apis: []
})
