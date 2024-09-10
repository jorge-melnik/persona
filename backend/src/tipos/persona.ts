import { Static, Type } from "@sinclair/typebox";
// Expresión regular para el correo electrónico
// const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

// Expresión regular para la contraseña
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;

// Expresión regular para el formato de cédula
const cedulaRegex = /^[1-9]{1}\.[0-9]{3}\.[0-9]{3}-[0-9]{1}$/;

// Expresión regular para el formato del RUT
const rutRegex = /^\d{12}$/;

export const PersonaSchema = Type.Object(
  {
    nombre: Type.String({ minLength: 2, maxLength: 50 }),
    apellido: Type.String({ minLength: 2, maxLength: 50 }),
    email: Type.String({ format: "email" }),
    cedula: Type.String({ pattern: cedulaRegex.source }),
    rut: Type.String({ pattern: rutRegex.source }),
  },
  { $id: "PersonaSchema" }
);

export const PersonaPostSchema = Type.Object(
  {
    ...PersonaSchema.properties,
    contraseña: Type.String({
      minLength: 8,
      maxLength: 20,
      pattern: passwordRegex.source,
      errorMessage:
        "La contraseña debe contener entre 8 y 20 caracteres, 1 digito, 1 mayúsculas, 1 minúsculas y un caracter especial.",
    }),
    repetirContraseña: Type.String({
      minLength: 8,
      maxLength: 20,
      pattern: passwordRegex.source,
    }),
  },
  { $id: "PersonaPostSchema" }
);

export type PersonaType = Static<typeof PersonaSchema>;
export type PersonaPostType = Static<typeof PersonaPostSchema>;
