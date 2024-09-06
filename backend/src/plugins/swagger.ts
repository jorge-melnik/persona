"use strict";
import fp from "fastify-plugin";
import swagger, { SwaggerOptions } from "@fastify/swagger";
// import swaggerui from "@fastify/swagger-ui";
import ScalarApiReference from "@scalar/fastify-api-reference";

const swaggerOpts: SwaggerOptions = {
  openapi: {
    info: {
      title: "Personas API",
      summary: "Api para CRUD de personas",
      description: "Esta es la descripción de la api personas. ...",
      termsOfService: `http://aca.va.la.url.con.los.terminos.y.condiciones`,
      version: "1.0",
      contact: {
        name: "JMELNIK",
        url: "http://www.example.com/support",
        email: "jorge.melnik@ucu.edu.uy",
      },
      license: {
        name: "Apache 2.0",
        url: "http://www.apache.org/licenses/LICENSE-2.0.html",
      },
    },
    servers: [
      {
        url: "http://localhost/backend",
        description: "Development server",
        variables: {},
      },
      {
        url: "http://personastest.uy/backend/",
        description: "Test server",
      },
      {
        url: "http://personas.uy/backend/",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
    // consumes: ["application/json"],
    // produces: ["application/json"],
    tags: [
      {
        name: "personas",
        description: "Endpoints para CRUD de personas.",
      },
    ],
  },
  hideUntagged: true,
  //   exposeRoute: true,
};

export default fp(async function (fastify, opts) {
  await fastify.register(swagger, swaggerOpts);

  // await fastify.register(swaggerui, {
  //   routePrefix: "docs",
  //   uiConfig: {
  //     docExpansion: "full",
  //     deepLinking: false,
  //   },
  //   // uiHooks: {
  //   //   onRequest: function (request, reply, next) {
  //   //     next();
  //   //   },
  //   //   preHandler: function (request, reply, next) {
  //   //     next();
  //   //   },
  //   // },
  //   staticCSP: true,
  //   transformStaticCSP: (header) => header,
  //   transformSpecification: (swaggerObject, request, reply) => {
  //     return swaggerObject;
  //   },
  //   transformSpecificationClone: true,
  // });

  await fastify.register(ScalarApiReference, {
    routePrefix: "/reference",
  });
});
