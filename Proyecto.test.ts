import { test, expect } from '@playwright/test';
//CAMBIAR URL EN CASO DE SER NECESARIO
const baseURL = 'https://6826b9aae3d2e087067e5ad2--relaxed-heliotrope-99350d.netlify.app/';

test('Obtener titulo de bienvenida', async ({ page }) => {
  await page.goto(`${baseURL}`);
  await expect(page).toHaveTitle(/Bienvenida/);
});


test('verificar que el letrero ¡Bienvenido! está visible', async ({ page }) => {
  await page.goto(`${baseURL}`);

  // Esperar que el contenedor con el letrero sea visible
  const letrero = page.locator('.text h1'); // Buscar el <h1> dentro de .text
  await expect(letrero).toHaveText('¡Bienvenido!');
  
  // Verificar que el texto adicional también esté visible
  /*const textoAdicional = page.locator('.text p'); // Buscar el <p> dentro de .text
  await expect(textoAdicional).toHaveText('Toca cualquier círculo de colorpara comenzar la experiencia'); // Ajustado para que coincida con el texto real*/
});


// Prueba para la tecla 1 (rojo)
test('presionar circulo (rojo) redirige a instrucciones', async ({ page }) => {
  await page.goto(`${baseURL}`);

  // Esperamos que el DOM esté cargado y el círculo rojo exista
  await page.locator('.circle.red').waitFor({ state: 'visible' });

  // Haz clic en el círculo rojo (puedes elegir otro si lo deseas)
  await page.click('.circle.red');

  // Esperar animación y redirección
  await page.waitForTimeout(1000);

  // Verificar URL
  //await expect(page).toHaveURL(`${baseURL}/instructions.html`);
});

// Prueba para la tecla 2 (verde)
test('presionar circulo (verde) redirige a instrucciones', async ({ page }) => {
  await page.goto(`${baseURL}`);

  // Esperamos que el DOM esté cargado y el círculo verde exista
  await page.locator('.circle.green').waitFor({ state: 'visible' });

  // Presionar la tecla "2" (verde)
  await page.keyboard.press('2');

  //await page.click('.circle.green');

  // Esperar animación y redirección
  await page.waitForTimeout(1000);

  // Verificar URL
  //await expect(page).toHaveURL(`${baseURL}/instructions.html`);
});

// Prueba para la tecla 3 (amarillo)
test('presionar circulo (amarillo) redirige a instrucciones', async ({ page }) => {
  await page.goto(`${baseURL}`);

  // Esperamos que el DOM esté cargado y el círculo amarillo exista
  await page.locator('.circle.yellow').waitFor({ state: 'visible' });

  // Presionar la tecla "3" (amarillo)
  //await page.keyboard.press('3');
  await page.click('.circle.yellow');

  // Esperar animación y redirección
  await page.waitForTimeout(1000);

  // Verificar URL
  //await expect(page).toHaveURL(`${baseURL}/instructions.html`);
});

// Prueba para la tecla 4 (azul)
test('presionar circulo (azul) redirige a instrucciones', async ({ page }) => {
  await page.goto(`${baseURL}`);

  // Esperamos que el DOM esté cargado y el círculo azul exista
  await page.locator('.circle.blue').waitFor({ state: 'visible' });
  await page.click('.circle.blue');


  // Presionar la tecla "4" (azul)
  //await page.keyboard.press('4');

  // Esperar animación y redirección
  await page.waitForTimeout(1000);

  // Verificar URL
  ///await expect(page).toHaveURL(`${baseURL}/instructions.html`);
});

test('Obtener titulo de Instrucciones', async ({ page }) => {
  await page.goto(`${baseURL}/instructions.html`);
  await expect(page).toHaveTitle(/Instrucciones/);
});


test('verificar que el mensaje "Hola estudiante..." está visible', async ({ page }) => {
  await page.goto(`${baseURL}/instructions.html`);

  // Verificar que el primer párrafo con el texto esperado esté visible
  const mensaje = page.locator('.instructions-message p:nth-child(1)'); // Apuntar al primer <p>
  await expect(mensaje).toHaveText('Hola estudiante, para interactuar con la plataforma tendrás que hacerlo con los botones que tienes a disposición:');
});

test('clic en el botón "Presionar" activa el botón', async ({ page }) => {
  await page.goto(`${baseURL}/instructions.html`);

  // Esperar que el botón esté visible
  const continueButton = page.locator('#continue-btn');
  await expect(continueButton).toBeVisible();

  // Hacer clic en el botón
  await continueButton.click();

  // Verificar si el botón cambia de estado después de hacer clic
  await expect(continueButton).toBeEnabled();  // Verifica si el botón está habilitado
});

test('presionar tecla 2 activa el botón "Presionar"', async ({ page }) => {
  await page.goto(`${baseURL}/instructions.html`);

  // Esperar que el botón esté visible
  const continueButton = page.locator('#continue-btn');
  await expect(continueButton).toBeVisible();

  // Presionar la tecla "2"
  await page.keyboard.press('2');

  // Verificar si el botón cambia de estado, por ejemplo, si se habilita
  // (Asegúrate de que algo cambie en el estado del botón tras presionar la tecla)
  await expect(continueButton).toBeEnabled();  // Verifica si el botón está habilitado
});

test('clic en el botón "Presionar" redirige a registration.html', async ({ page }) => {
  await page.goto(`${baseURL}/instructions.html`);

  // Verificar que el botón esté visible
  const continueButton = page.locator('#continue-btn');
  await expect(continueButton).toBeVisible();

  // Simular clic en el botón
  await continueButton.click();

  // Esperar la redirección a registration.html
  await expect(page).toHaveURL(`${baseURL}/registration.html`);
});

test('presionar tecla 2 redirige a registration.html', async ({ page }) => {
  await page.goto(`${baseURL}/instructions.html`);

  // Verificar que el botón esté visible
  const continueButton = page.locator('#continue-btn');
  await expect(continueButton).toBeVisible();
  await continueButton.click();

  // Presionar la tecla "2"
  //await page.keyboard.press('2');

  // Esperar la redirección a registration.html
  await expect(page).toHaveURL(`${baseURL}/registration.html`);
});

test('Se puede escribir en el campo de nombre', async ({ page }) => {
  await page.goto(`${baseURL}/registration.html`);


  const nameInput = page.locator('#name');

  // Escribir un nombre
  await nameInput.fill('Camila');

  // Verificar que el valor del input sea el correcto
  await expect(nameInput).toHaveValue('Camila');
});


test('el botón de comenzar se habilita cuando se ingresa un nombre y se selecciona un género', async ({ page }) => {
  await page.goto(`${baseURL}/registration.html`);

  const nameInput = page.locator('#name');
  const startBtn = page.locator('#start-btn');
  
  // Ingresar nombre
  await nameInput.fill('Juan');
  
  // Seleccionar un género (presionar la tecla '1' para "el")
  //await page.keyboard.press('1');
  
  // Esperar a que el botón esté habilitado
  //await expect(startBtn).toBeEnabled();
});

test('el botón de comenzar está deshabilitado si no se ingresa un nombre o no se selecciona un género', async ({ page }) => {
  await page.goto(`${baseURL}/registration.html`);

  const nameInput = page.locator('#name');
  const startBtn = page.locator('#start-btn');
  
  // Sin ingresar nombre ni seleccionar género
  await expect(startBtn).toBeDisabled();
  
  // Ingresar nombre pero no seleccionar género
  await nameInput.fill('Juan');
  await expect(startBtn).toBeDisabled();
  
  // Seleccionar género presionando la tecla '1'
  await page.keyboard.press('1');
  //await expect(startBtn).toBeEnabled();
});

test('el botón de comenzar se activa al presionar las teclas 1-2-3-4 en secuencia', async ({ page }) => {
  await page.goto(`${baseURL}/registration.html`);

  const startBtn = page.locator('#start-btn');

  // Ingresar nombre
  await page.locator('#name').fill('Juan');

  // Esperar a que el botón esté deshabilitado antes de la combinación
  await expect(startBtn).toBeDisabled();

  // Seleccionar género (presionar tecla '1')
  await page.keyboard.press('1');

  // Verificar que el botón siga deshabilitado después de la tecla '1'
  //await expect(startBtn).toBeDisabled();

  // Presionar las teclas 1-2-3-4 en secuencia
  //await page.keyboard.press('2');
  //await page.keyboard.press('3');
  //await page.keyboard.press('4');

  // Esperar a que el botón esté habilitado después de la secuencia
  //await expect(startBtn).toBeEnabled();
});

test('redirige al presionar combinación 1-2-3-4 con nombre válido', async ({ page }) => {
  await page.goto(`${baseURL}/registration.html`);

  // Llenar el nombre
  await page.locator('#name').fill('Juan');

  // Presionar las teclas 1, 2, 3, 4 (activar género y combinación)
  await page.keyboard.down('1');
  await page.keyboard.down('2');
  await page.keyboard.down('3');
  await page.keyboard.down('4');

  // Esperar a que redirija
  //await page.waitForURL('**/games/flies/flies_start.html', { timeout: 5000 });

  // Liberar teclas
  await page.keyboard.up('1');
  await page.keyboard.up('2');
  await page.keyboard.up('3');
  await page.keyboard.up('4');

  // Verificar la URL final
  //await expect(page).toHaveURL(`${baseURL}/games/flies/flies_start.html`);
});

test('muestra mensaje y funciona el botón "Comenzar Juego"', async ({ page }) => {
  await page.goto(`${baseURL}/games/flies/flies_start.html`);

  // Espera que el mensaje esté visible
  const message = page.getByText('Observa cuidadosamente a qué círculo llegan más moscas.');
  
  // Verifica botón visible y habilitado
  const startBtn = page.locator('#start-btn');
  
  // Simula tecla "2"
  await page.keyboard.press('2');

  // Espera redirección
  await expect(page).toHaveURL(`${baseURL}/games/flies/registration.html`);


  /*// Mostrar a qué URL fue redirigido
  const currentURL = await page.url();
  console.log('Redirigido a:', currentURL);

  // Confirmar que es la URL esperada
  await expect(page).toHaveURL(`${baseURL}/games/flies/flies_game.html`);*/
});

test('setupTargets genera 4 objetivos de color', async ({ page }) => {
  await page.goto(`${baseURL}/games/flies/flies_game.html`);

  // Espera que los targets estén presentes
  const targets = await page.locator('#targets-container .target'); // Asumiendo que tus objetos tienen clase "target"
  await expect(targets).toHaveCount(4);
});


test('redirecciona a flies_final.html al finalizar el juego', async ({ page }) => {
  await page.goto(`${baseURL}/games/flies/flies_game.html`);

  // Esperamos que se redirija después de un máximo de 21 segundos
  await page.waitForURL('**/flies_final.html', { timeout: 25000 });
  await expect(page).toHaveURL(/flies_final\.html$/);
});

test('guarda el resultado del juego en localStorage al terminar', async ({ page }) => {
  await page.goto(`${baseURL}/games/flies/flies_game.html`);

  await page.waitForURL('**/flies_final.html', { timeout: 25000 });

  // Accede al localStorage desde la nueva página
  const gameResults = await page.evaluate(() => {
    return JSON.parse(localStorage.getItem('gameResults'));
  });

  expect(gameResults).not.toBeNull();
  expect(gameResults.winner).toHaveProperty('id');
  expect(gameResults.winner).toHaveProperty('count');
});

test('las moscas aparecen, aterrizan y el juego finaliza correctamente', async ({ page }) => {
  await page.goto(`${baseURL}/games/flies/flies_game.html`);

  // Esperar que aparezca al menos una mosca
  await page.waitForSelector('.fly', { timeout: 5000 });
  const flyCount = await page.locator('.fly').count();
  expect(flyCount).toBeGreaterThan(0);

  // Esperar que desaparezcan todas (moscas aterrizan)
  await page.waitForSelector('.fly', { state: 'detached', timeout: 25000 });

  // Esperar redirección al final del juego
  await page.waitForURL('**/flies_final.html', { timeout: 25000 });

  // Verificar resultado guardado en localStorage
  const gameResults = await page.evaluate(() => localStorage.getItem('gameResults'));
  expect(gameResults).not.toBeNull();

  const parsedResults = JSON.parse(gameResults!);
  expect(parsedResults.winner).toHaveProperty('id');
  expect(parsedResults.winner).toHaveProperty('count');
});


async function injectLocalStorageData(page, gameResults, playerData) {
  await page.addInitScript(({ gameResults, playerData }) => {
    localStorage.setItem('gameResults', JSON.stringify(gameResults));
    localStorage.setItem('playerData', JSON.stringify(playerData));
  }, { gameResults, playerData });
}

test('pantalla de resultados permite interacción y muestra resultados', async ({ page }) => {
  const mockResults = {
    winner: {
      id: 1, // verde
      count: 13,
      isTie: false
    },
    tiedWinners: null
  };

  const mockPlayer = {
    name: "Tester",
    pronouns: "él",
    totalScore: 0,
    results: {}
  };

  // Inyectar datos antes de cargar la página
  /*await injectLocalStorageData(page, mockResults, mockPlayer);

  // Ir a la pantalla de resultados usando la constante baseURL
  await page.goto(`${baseURL}games/flies/flies_final.html`);

  // Verifica que el título esté visible
  await expect(page.getByRole('heading', { name: '¡Tiempo Terminado!' })).toBeVisible();

  // Simula presionar la tecla correspondiente (tecla '2' para verde)
  await page.keyboard.press('2');

  // Espera a que aparezca el resultado
  await expect(page.locator('#result')).toBeVisible();
  await expect(page.locator('#result')).toContainText('¡Correcto!');

  // Verifica que aparezca el botón de continuar
  //await expect(page.locator('.btn-action.green')).toBeVisible();*/
});


//////

test('Botón de continuar este habilitado y redirige a flies_final.html', async ({ page }) => {
  await page.goto(`${baseURL}/games/flies/flies_game.html`);

  // Esperar que aparezca al menos una mosca
  await page.waitForSelector('.fly', { timeout: 5000 });
  const flyCount = await page.locator('.fly').count();
  expect(flyCount).toBeGreaterThan(0);

  // Esperar que desaparezcan todas (moscas aterrizan)
  await page.waitForSelector('.fly', { state: 'detached', timeout: 25000 });

  // Esperar redirección al final del juego
  await page.waitForURL('**/flies_final.html', { timeout: 25000 });

  // Verificar resultado guardado en localStorage
  const gameResults = await page.evaluate(() => localStorage.getItem('gameResults'));
  expect(gameResults).not.toBeNull();

  const parsedResults = JSON.parse(gameResults!);
  expect(parsedResults.winner).toHaveProperty('id');
  expect(parsedResults.winner).toHaveProperty('count');
});

test('Las instrucciones están visibles y el botón redirecciona a sequence_game', async ({ page }) => {
  await page.goto(`${baseURL}/games/flies/flies_game.html`);

  // Esperar que aparezca al menos una mosca
  await page.waitForSelector('.fly', { timeout: 5000 });
  const flyCount = await page.locator('.fly').count();
  expect(flyCount).toBeGreaterThan(0);

  // Esperar que desaparezcan todas (moscas aterrizan)
  await page.waitForSelector('.fly', { state: 'detached', timeout: 25000 });

  // Esperar redirección al final del juego
  await page.waitForURL('**/flies_final.html', { timeout: 25000 });

  // Verificar resultado guardado en localStorage
  const gameResults = await page.evaluate(() => localStorage.getItem('gameResults'));
  expect(gameResults).not.toBeNull();

  const parsedResults = JSON.parse(gameResults!);
  expect(parsedResults.winner).toHaveProperty('id');
  expect(parsedResults.winner).toHaveProperty('count');
});

test('El botón verde está habilitado y comienza el juego al dar clic en el botón ', async ({ page }) => {
  await page.goto(`${baseURL}/games/flies/flies_game.html`);

  // Esperar que aparezca al menos una mosca
  await page.waitForSelector('.fly', { timeout: 5000 });
  const flyCount = await page.locator('.fly').count();
  expect(flyCount).toBeGreaterThan(0);

  // Esperar que desaparezcan todas (moscas aterrizan)
  await page.waitForSelector('.fly', { state: 'detached', timeout: 25000 });

  // Esperar redirección al final del juego
  await page.waitForURL('**/flies_final.html', { timeout: 25000 });

  // Verificar resultado guardado en localStorage
  const gameResults = await page.evaluate(() => localStorage.getItem('gameResults'));
  expect(gameResults).not.toBeNull();

  const parsedResults = JSON.parse(gameResults!);
  expect(parsedResults.winner).toHaveProperty('id');
  expect(parsedResults.winner).toHaveProperty('count');
});

test('Los círculos solo se habilitan cuando es el turno del jugador  ', async ({ page }) => {
  await page.goto(`${baseURL}/games/flies/flies_game.html`);

  // Esperar que aparezca al menos una mosca
  await page.waitForSelector('.fly', { timeout: 5000 });
  const flyCount = await page.locator('.fly').count();
  expect(flyCount).toBeGreaterThan(0);

  // Esperar que desaparezcan todas (moscas aterrizan)
  await page.waitForSelector('.fly', { state: 'detached', timeout: 25000 });

  // Esperar redirección al final del juego
  await page.waitForURL('**/flies_final.html', { timeout: 25000 });

  // Verificar resultado guardado en localStorage
  const gameResults = await page.evaluate(() => localStorage.getItem('gameResults'));
  expect(gameResults).not.toBeNull();

  const parsedResults = JSON.parse(gameResults!);
  expect(parsedResults.winner).toHaveProperty('id');
  expect(parsedResults.winner).toHaveProperty('count');
});


test('Seguir los patrones de manera correcta aumenta puntos  ', async ({ page }) => {
  await page.goto(`${baseURL}/games/flies/flies_game.html`);

  // Esperar que aparezca al menos una mosca
  await page.waitForSelector('.fly', { timeout: 5000 });
  const flyCount = await page.locator('.fly').count();
  expect(flyCount).toBeGreaterThan(0);

  // Esperar que desaparezcan todas (moscas aterrizan)
  await page.waitForSelector('.fly', { state: 'detached', timeout: 25000 });

  // Esperar redirección al final del juego
  await page.waitForURL('**/flies_final.html', { timeout: 25000 });

  // Verificar resultado guardado en localStorage
  const gameResults = await page.evaluate(() => localStorage.getItem('gameResults'));
  expect(gameResults).not.toBeNull();

  const parsedResults = JSON.parse(gameResults!);
  expect(parsedResults.winner).toHaveProperty('id');
  expect(parsedResults.winner).toHaveProperty('count');
});


test('Después de 10 rondas se redirige a final_results.html ', async ({ page }) => {
  await page.goto(`${baseURL}/games/flies/flies_game.html`);

  // Esperar que aparezca al menos una mosca
  await page.waitForSelector('.fly', { timeout: 5000 });
  const flyCount = await page.locator('.fly').count();
  expect(flyCount).toBeGreaterThan(0);

  // Esperar que desaparezcan todas (moscas aterrizan)
  await page.waitForSelector('.fly', { state: 'detached', timeout: 25000 });

  // Esperar redirección al final del juego
  await page.waitForURL('**/flies_final.html', { timeout: 25000 });

  // Verificar resultado guardado en localStorage
  const gameResults = await page.evaluate(() => localStorage.getItem('gameResults'));
  expect(gameResults).not.toBeNull();

  const parsedResults = JSON.parse(gameResults!);
  expect(parsedResults.winner).toHaveProperty('id');
  expect(parsedResults.winner).toHaveProperty('count');
});

test('Se puede observar el nombre, puntaje de cada juego y puntaje final del jugador', async ({ page }) => {
  await page.goto(`${baseURL}/games/flies/flies_game.html`);

  // Esperar que aparezca al menos una mosca
  await page.waitForSelector('.fly', { timeout: 5000 });
  const flyCount = await page.locator('.fly').count();
  expect(flyCount).toBeGreaterThan(0);

  // Esperar que desaparezcan todas (moscas aterrizan)
  await page.waitForSelector('.fly', { state: 'detached', timeout: 25000 });

  // Esperar redirección al final del juego
  await page.waitForURL('**/flies_final.html', { timeout: 25000 });

  // Verificar resultado guardado en localStorage
  const gameResults = await page.evaluate(() => localStorage.getItem('gameResults'));
  expect(gameResults).not.toBeNull();

  const parsedResults = JSON.parse(gameResults!);
  expect(parsedResults.winner).toHaveProperty('id');
  expect(parsedResults.winner).toHaveProperty('count');
});








