// const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

export const registerUser = async (data) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const result = await response.json();
    // Podés devolver el resultado si lo necesitás:
    // return result;
    console.log("Usuario registrado:", result);

  } catch (error) {
    console.error(error);
    alert("Error al registrar usuario");
  }
};


export const login = async (data) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(data),
      credentials: 'include' // ¡Importante! Para enviar/recibir cookies
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en las credenciales");
    }

    const result = await response.json();
    console.log("Login exitoso", result);
    
    // Ya no guardamos en localStorage, el token viene en cookie HttpOnly
    return result; // Puede contener datos de usuario (sin el token)
    
  } catch (error) {
    console.error("Error en login:", error);
    throw error; // Propaga el error para manejo en UI
  }
};


// export const getDataUser = async () => {
//   try {
//     // 1. Recuperar el token del localStorage
//     const token = localStorage.getItem("token");
    
//     if (!token) {
//       throw new Error("No hay token de autenticación");
//     }

//     // 2. Hacer la petición GET (sin body)
//     const response = await fetch(`${API_URL}/perfil`, {
//       method: "GET",
//       headers: { 
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`  // <- Enviar el token
//       }
//     });

//     // 3. Verificar si la respuesta es exitosa
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || "Error al obtener datos del usuario");
//     }

//     // 4. Retornar los datos en formato JSON
//     return await response.json();

//   } catch (error) {
//     console.error("Error en getDataUser:", error);
    
//     // Mostrar alerta solo si es un error de frontend (opcional)
//     if (error.message !== "No hay token de autenticación") {
//       alert(error.message || "Error al traer datos");
//     }
    
//     throw error; // Permite manejar el error en el componente que llama a esta función
//   }
// };


export const getDataUser = async () => {
  try {
    const response = await fetch(`${API_URL}/perfil`, {
      method: "GET",
      credentials: 'include', // Envía automáticamente las cookies
      headers: {
        "Content-Type": "application/json"
      }
    });

    console.log(response)
    return await response.json();
    
  } catch (error) {
    console.error("Error en getDataUser:", error);
    throw error;
  }
};