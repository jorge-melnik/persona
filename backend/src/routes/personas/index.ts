import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import { PersonaPostSchema, PersonaPostType } from "../../tipos/persona.js";
import db from "../../services/db.js";
import { Type } from "@sinclair/typebox";

const personaRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  fastify.get("/", {
    schema: {
      tags: ["personas"],
      summary: "Obtener todas las personas",
      description:
        "Devuelve el listado completo de personas sin utilizar filtro alguno.",
      response: {
        200: {
          description: "Listado de personas",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "PersonaSchema" },
              },
            },
          },
        },
      },
    },
    onRequest: fastify.authenticate,
    handler: async function (request, reply) {
      const res = await db.query("SELECT * FROM public.personas");
      return res.rows;
    },
  });

  fastify.get("/:id_persona", {
    schema: {
      tags: ["personas"],
      description: "Descripción de la ruta /personas/:id_persona. ",
      summary: "Obtener persona por su id.",
      schema: {
        params: {
          type: "object",
          properties: {
            id_persona: { type: "integer" },
          },
        },
      },
      response: {
        200: {
          description: "Persona obtenida por id",
          content: {
            "application/json": {
              schema: Type.Ref("PersonaSchema"),
            },
          },
        },
      },
    },
    handler: async function (request, reply) {
      const { id_persona } = request.params as { id_persona: number };
      const res = await db.query(
        "SELECT * FROM public.personas WHERE id_persona=$1",
        [id_persona]
      );
      return res.rows[0];
    },
  });

  fastify.post("/", {
    schema: {
      tags: ["personas"],
      description: "Dar de alta una persona",
      body: PersonaPostSchema,
      response: {
        200: {
          description: "Alta de persona",
          content: {
            "application/json": {
              schema: Type.Ref("PersonaSchema"),
            },
          },
        },
      },
    },
    preHandler: async function (request, reply) {
      const personaPost = request.body as PersonaPostType;
      if (personaPost.contraseña !== personaPost.repetirContraseña)
        reply.badRequest("Las contraseñas no coinciden");
      //TODO: acá también podría hacer la verificación con los algoritmos de cedula y rut.
    },
    handler: async function (request, reply) {
      const personaPost = request.body as PersonaPostType;

      const res = await db.query(
        `
        INSERT INTO public.personas (nombre, apellido,email,cedula,rut, contraseña) 
          VALUES($1,$2,$3,$4,$5,crypt($6, gen_salt('bf'))) RETURNING *;
      `,
        [
          personaPost.nombre,
          personaPost.apellido,
          personaPost.email,
          personaPost.cedula,
          personaPost.rut,
          personaPost.contraseña,
        ]
      );
      return res.rows[0];
    },
  });
};

export default personaRoute;
