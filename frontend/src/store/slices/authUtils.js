export function decodeJWT(token) {
  try {
    const payloadBase64 = token.split(".")[1];
    const payloadJSON = atob(payloadBase64);
    return JSON.parse(payloadJSON);
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return null;
  }
}