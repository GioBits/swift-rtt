describe('Subir, almacenar y validar que el archivo almacenado en la bd es una copia del archivo original', () => {
  it('debería subir un archivo, y compara el codificado base64 del archivo original con el almacenado en la base de datos', () => {
    const filePath = 'cypress/fixtures/test-file.mp3';  // Ruta al archivo local de prueba
    const host = Cypress.env('HOST');

    // Interceptamos la respuesta del POST para capturar el resultado
    cy.intercept('POST', '/api/audio').as('audioUpload');

    // Visitar la página donde está el formulario de carga
    cy.visit(host);

    // Simulamos la carga del archivo, buscamos el elemento con id upload-audio
    cy.get('#upload-audio').attachFile('test-file.mp3');

    // Esperamos la respuesta del backend
    cy.wait('@audioUpload', {timeout: 60000}).then((interception) => {
      const response = interception.response.body;

      // Decodificar base64 recibido del backend
      const base64FileBackend = response.file;

      // Leer el archivo local en binario y convertirlo a base64
      cy.readFile(filePath, 'base64').then((fileBase64) => {
        // Comparar el archivo local con el archivo decodificado
        expect(fileBase64).to.equal(base64FileBackend); // Compara el base64
      });
    });
  });
});
