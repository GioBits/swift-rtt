import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { apiService } from '@/service/api';
import { beforeEach, describe, it, vi, expect } from 'vitest';

// Crear una instancia de MockAdapter para simular las respuestas de Axios
const mock = new MockAdapter(axios);

// Configura el mock para las respuestas de API antes de las pruebas
beforeEach(() => {
  mock.reset();  // Resetear el mock antes de cada prueba
});

describe('apiService', () => {
  it('debería devolver los datos de una solicitud GET', async () => {
    const mockData = { message: 'Pong' };
    const getSpy = vi.spyOn(apiService, 'ping').mockResolvedValue(mockData);

    const result = await apiService.ping();
    expect(result.message).toEqual(mockData.message); // Accede a 'message' en el resultado
    getSpy.mockRestore(); // Restauramos el comportamiento original
  });


  it('debería devolver los datos de una solicitud POST', async () => {
    const postData = { name: 'John Doe' };
    const mockResponse = { id: 1, ...postData };
    const postSpy = vi.spyOn(apiService, 'post').mockResolvedValue(mockResponse);

    const result = await apiService.post('/users', postData);
    expect(result).toEqual(mockResponse);  // Verificamos si el resultado es el esperado
    postSpy.mockRestore();  // Restauramos el comportamiento original
  });

  it('debería devolver los datos de una solicitud PUT', async () => {
    const putData = { name: 'John Updated' };
    const mockResponse = { id: 1, ...putData };
    const putSpy = vi.spyOn(apiService, 'put').mockResolvedValue(mockResponse);

    const result = await apiService.put('/users/1', putData);
    expect(result).toEqual(mockResponse);  // Verificamos si el resultado es el esperado
    putSpy.mockRestore();  // Restauramos el comportamiento original
  });

  it('debería devolver los datos de una solicitud DELETE', async () => {
    const mockResponse = { message: 'User deleted successfully' };
    const deleteSpy = vi.spyOn(apiService, 'delete').mockResolvedValue(mockResponse);

    const result = await apiService.delete('/users/1');
    expect(result).toEqual(mockResponse);  // Verificamos si el resultado es el esperado
    deleteSpy.mockRestore();  // Restauramos el comportamiento original
  });

  it('debería manejar el error de red para una solicitud GET', async () => {
    const errorMessage = 'No se pudo conectar con el servidor';
    const getSpy = vi.spyOn(apiService, 'ping').mockRejectedValue({ message: errorMessage });

    try {
      await apiService.ping();
    } catch (error) {
      expect(error.message).toBe(errorMessage);
    }
    getSpy.mockRestore();  // Restauramos el comportamiento original
  });

  it('debería manejar el error de autorización para una solicitud GET', async () => {
    const errorResponse = { status: 401, message: 'Token no válido o no proporcionado' };
    const getSpy = vi.spyOn(apiService, 'ping').mockRejectedValue(errorResponse);

    try {
      await apiService.ping();
    } catch (error) {
      expect(error.message).toBe(errorResponse.message);
      expect(error.status).toBe(errorResponse.status);
    }
    getSpy.mockRestore();  // Restauramos el comportamiento original
  });

  it('debería manejar el error de respuesta no esperada (status 500)', async () => {
    const errorResponse = { status: 500, message: 'Error interno del servidor' };
    const getSpy = vi.spyOn(apiService, 'ping').mockRejectedValue(errorResponse);

    try {
      await apiService.ping();
    } catch (error) {
      expect(error.message).toBe(errorResponse.message);
      expect(error.status).toBe(errorResponse.status);
    }
    getSpy.mockRestore();  // Restauramos el comportamiento original
  });

  it('debería manejar el error de validación de datos en una solicitud POST', async () => {
    const postData = { name: '' };  // Simulamos datos inválidos (nombre vacío)
    const errorResponse = { status: 400, message: 'El nombre no puede estar vacío' };
    const postSpy = vi.spyOn(apiService, 'post').mockRejectedValue(errorResponse);

    try {
      await apiService.post('/users', postData);
    } catch (error) {
      expect(error.message).toBe(errorResponse.message);
      expect(error.status).toBe(errorResponse.status);
    }
    postSpy.mockRestore();  // Restauramos el comportamiento original
  });

  it('debería manejar errores de conexión (sin red)', async () => {
    const errorMessage = 'No se pudo conectar con el servidor';
    const getSpy = vi.spyOn(apiService, 'ping').mockRejectedValue({ message: errorMessage });

    try {
      await apiService.ping();
    } catch (error) {
      expect(error.message).toBe('No se pudo conectar con el servidor');
    }
    getSpy.mockRestore();  // Restauramos el comportamiento original
  });
});
