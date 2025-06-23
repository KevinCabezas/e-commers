import { registerUser, login, getDataUser } from "./api.js";
import { Users } from "./user.js";

const formRegister = document.getElementById("form-register");
const email = formRegister.querySelector("#mail");
const password = formRegister.querySelector("#password");

const formLogin = document.getElementById("form-login");
const userLogin = formLogin.querySelector("#user");
const passwordLogin = formLogin.querySelector("#password-login");

const texto = document.getElementById("dato");
// const botonDato = document.getElementById("btn-dato");

document.addEventListener("DOMContentLoaded", onInit);

function onInit() {

  getFormRegister();
  getFormLogin();
  mostrarDato();
  salir();

};


async function getFormRegister() {
  formRegister.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = new Users(
      email.value,
      password.value
    )
    console.log(user)
    registerUser(user);
    password.value = "";
    email.value = "";

  });
}

async function getFormLogin() {
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = new Users(
      userLogin.value,
      passwordLogin.value
    )
    console.log(user)
    login(user);

  });
}

async function mostrarDato() {
  // const texto = document.getElementById("dato");
  const botonDato = document.getElementById("btn-dato");
  botonDato.addEventListener("click", async (e) => {
    e.preventDefault();

    // console.log("Botón clickeado!");
    const data = await getDataUser()
    // console.log(data);

    const objetoString = JSON.stringify(data, null, 2); // El "2" es para indentación
    // console.log(objetoString);
    texto.value = objetoString;
  })
}


function salir() {
  const btn = document.getElementById("salir");
  btn.addEventListener("click", () => {
    localStorage.removeItem("token");
    texto.value = "";
    console.log("salio");
  })
}
// document.getElementById("btn-dato").addEventListener("click", function () {
//   console.log("Botón clickeado!");
//   // document.getElementById("mensaje").textContent = "Botón presionado!";  // Opcional: Mostrar mensaje en HTML
// });