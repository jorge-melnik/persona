import jwt, { FastifyJWTOptions } from "@fastify/jwt";
import { FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import { FastifyReply } from "fastify/types/reply.js";

const jwtOptions: FastifyJWTOptions = {
  secret: "MYSUPERSECRET",
};

export default fp<FastifyJWTOptions>(async (fastify) => {
  fastify.register(jwt, jwtOptions);
  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        await request.jwtVerify();
      } catch (err) {
        throw reply.unauthorized("Algo salio mal gente.");
      }
    }
  );
});
