import { FastifyReply, FastifyRequest } from "fastify";

export interface authenticateFunction {
  (request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

// Most importantly, use declaration merging to add the custom property to the Fastify type system
declare module "fastify" {
  interface FastifyInstance {
    authenticate: authenticateFunction;
  }
}
