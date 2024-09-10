import { FastifyPluginAsync } from "fastify";

const auth: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post("/login", {
    schema: {
      body: {
        type: "object",
        properties: {
          email: { type: "string", format: "email" },
          contraseña: { type: "string" },
        },
        required: ["email", "contraseña"],
      },
    },
    handler: async function (request, reply) {
      const { email, contraseña } = request.body as {
        email: string;
        contraseña: string;
      };
      if (email !== "jmelnik19@gmail.com" || contraseña !== "pedropedrope")
        reply.unauthorized("Tu correo o contraseña es incorrecto.");
      const token = fastify.jwt.sign({
        email,
        id: 1,
        roles: ["admin", "user"],
      });
      reply.send({ token });
    },
  });
};

export default auth;
