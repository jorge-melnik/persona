import { FastifyPluginAsync, FastifyPluginOptions } from "fastify";
import { FastifyInstance } from "fastify/types/instance.js";
import {
  PersonaPostSchema,
  PersonaPostType,
  PersonaSchema,
  PersonaType,
} from "../../tipos/persona.js";
import db from "../../services/db.js";
import { Type } from "@sinclair/typebox";

const personas: PersonaType[] = [
  {
    nombre: "Juan",
    apellido: "Pérez",
    email: "juan.perez@example.com",
    cedula: "3.456.789-0",
    rut: "123456789123",
  },
];

const personaRoute: FastifyPluginAsync = async (
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
): Promise<void> => {
  fastify.get("/", {
    schema: {
      tags: ["personas"],
      response: {
        200: {
          description: "Listado de personas",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: Type.Ref("PersonaSchema"),
              },
            },
          },
        },
      },
    },
    handler: async function (request, reply) {
      const res = await db.query("SELECT * FROM public.personas");
      return res.rows;
    },
  });

  fastify.post("/", {
    schema: {
      tags: ["personas"],
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
