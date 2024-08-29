class Persona {
  nombre;
  apellido;
  email;
  password;
  cedula;
  rut;

  // Constructor
  constructor(nombre, apellido, email, password, cedula, rut) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.password = password;
    this.cedula = cedula;
    this.rut = rut;
  }

  mostrarDatos() {
    console.log("Nombre:", this.nombre);
    console.log("Apellido:", this.apellido);
    console.log("Email:", this.email);
    console.log("Contraseña:", this.password);
    console.log("Cédula:", this.cedula);
    console.log("RUT:", this.rut);
  }
}

const clean_ci = (ci) => {
  return ci.replace(/\D/g, "");
};

const cedulaPattern = (cedula) => {
  const cedulaRegex = /^[1-9]{1}\.[0-9]{3}\.[0-9]{3}-[0-9]{1}$/;
  return cedulaRegex.test(cedula);
};

const validation_digit = (ci) => {
  let a = 0;
  let i = 0;
  if (ci.length <= 6) {
    for (i = ci.length; i < 7; i++) {
      ci = "0" + ci;
    }
  }
  for (i = 0; i < 7; i++) {
    a += (parseInt("2987634"[i]) * parseInt(ci[i])) % 10;
  }
  if (a % 10 === 0) {
    return 0;
  } else {
    return 10 - (a % 10);
  }
};

const isCedulaValida = (ci) => {
  if (!ci) return false;
  // Fuente: https://github.com/picandocodigo/ci_js
  if (!cedulaPattern(ci)) return false;

  if (ci) {
    ci = clean_ci(ci);
    const dig = parseInt(ci[ci.length - 1]);
    ci = ci.replace(/[0-9]$/, "");
    return dig == validation_digit(ci);
  } else {
    return false;
  }
};

const validateRut = (rut) => {
  return true;
  // Basado en: https://es.stackoverflow.com/questions/182303/d%C3%ADgito-verificador-de-rut-con-vectores
  if (!rut) return false;

  // 0 - Precondiciones
  // Largo = 12
  if (rut.length != 12) {
    return false;
  }
  // Todos dígitos
  if (!/^([0-9])*$/.test(rut)) {
    //Si no es todo número
    return false;
  }

  //Debe controlarse que las dos primeras posiciones estén en el rango 01 a 21.
  const dosPrimeros = parseInt(rut.substring(0, 2));
  if (dosPrimeros <= 0 || dosPrimeros > 21) {
    return false;
  }

  //De la 3a a 8a posición debe ser distinto de 0.
  const terceraAOctava = parseInt(rut.substring(2, 8));
  if (terceraAOctava === 0) {
    return false;
  }

  //Las posiciones 9 y 10 deben ser 0.
  const nueveDiez = parseInt(rut.substring(8, 10));
  if (nueveDiez !== 0) {
    return false;
  }

  // 1 - Se toma el número de RUT hasta la penúltima posición, o sea, los 11 primeros dígitos.
  const rutArray = [...rut.substring(0, 11)].map((caracter) =>
    parseInt(caracter)
  );

  // 2 - Se multiplica cada dígito por los siguientes factores: 4,3,2,9,8,7,6,5,4,3,2.
  const vectorMultiplicador = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const rutMultiplicado = rutArray.map(
    (numero, indice) => numero * vectorMultiplicador[indice]
  );

  // 3 - Se suman los productos obtenidos.
  const sumaProductos = rutMultiplicado.reduce(
    (anterior, current) => anterior + current,
    0
  );

  // 4 - El probable dígito verificador es lo que falta para llegar a la suma obtenida. Para eso, se divide el resultado de la suma entre 11. Le resto 11 menos el resto obtenido.
  const digitoVerificadorRecibido = parseInt(rut.charAt(11));
  const digitoVerificadorCalculado = 11 - (sumaProductos % 11);

  // 5 - Si el dígito es menor que 10, es el verdadero dígito verificador.

  if (digitoVerificadorCalculado < 10) {
    return digitoVerificadorRecibido === digitoVerificadorCalculado;
  }
  // Si es 11, el dígito calculado es 0.
  if (digitoVerificadorCalculado == 11) {
    return digitoVerificadorRecibido === 0;
  }
  // Si es 10, no es válido el RUT
  if (digitoVerificadorCalculado === 10) {
    return false;
  }

  //Se supone que nunca llegaría acá.
  return false;
};

async function registrar() {
  const form = document.getElementById("registrationForm");
  const errorMessage = document.getElementById("errorMessage");
  const errorMessageCedula = document.getElementById("errorMessageCedula");
  const errorMessageRut = document.getElementById("errorMessageRut");
  errorMessage.textContent = "";
  errorMessageCedula.textContent = "";
  errorMessageRut.textContent = "";
  form.reportValidity();
  const nombre = form.nombre.value.trim();
  const apellido = form.apellido.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;
  const cedula = form.cedula.value.trim();
  const rut = form.rut.value.trim();

  let valid = true;

  if (!nombre || !apellido || !email || !password || !cedula || !rut) {
    errorMessage.textContent = "Todos los campos son requeridos.";
    valid = false;
  }

  const inputCedula = document.getElementById("cedula");

  if (!isCedulaValida(cedula)) {
    if (inputCedula.classList.contains("valido")) {
      inputCedula.classList.remove("valido");
    }
    valid = false;
    errorMessageCedula.textContent = "La cedula no es válida.";
    inputCedula.classList.add("novalido");
  } else {
    if (inputCedula.classList.contains("novalido")) {
      inputCedula.classList.remove("novalido");
    }
    inputCedula.classList.add("valido");
  }
  if (!validateRut()) {
    valid = false;
    errorMessageRut.textContent = "El RUT no es válido.";
  }
  if (!validateEmail(email)) {
    valid = false;
    errorMessage.textContent = "Correo electrónico no válido.";
  }
  if (!valid) {
    console.error(errorMessage.textContent);
    return;
  }

  const persona = new Persona(nombre, apellido, email, password, cedula, rut);
  persona.mostrarDatos();
  //   form.reset();
  try {
    // Enviar datos al servidor
    const response = await fetch("http://localhost:3000/personas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(persona),
    });

    if (!response.ok) throw new Error("Error al registrar la persona");

    window.location.href = "index.html";
  } catch (error) {
    document.getElementById(
      "errorMessage"
    ).textContent = `Error: ${error.message}`;
  }
}

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}
