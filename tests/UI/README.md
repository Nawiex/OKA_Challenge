# Demoblaze - UI Automation Framework

Este repositorio contiene la resolución del Reto Técnico (Opción A - Automatización UI) utilizando un enfoque escalable y mantenible para la aplicación web [Demoblaze](https://www.demoblaze.com/).

## Stack Tecnológico
- **Lenguaje:** TypeScript
- **Framework de Pruebas:** Playwright
- **Patrón de Diseño:** Page Object Model (POM)

## Escenarios Cubiertos
El framework cubre los requerimientos obligatorios descritos en la prueba técnica:
1. Creación de usuario (con datos dinámicos) y validación mediante login.
2. Autenticación exitosa y manejo de credenciales inválidas.
3. Adición de productos al carrito de compras desde el Home.
4. Eliminación de productos específicos del carrito.
5. Flujo completo de Checkout y finalización de compra.

## Estructura del Proyecto
El diseño del framework sigue una estructura modular para garantizar la escalabilidad:

```text
├── data/
│   └── users.json         # Datos de prueba (credenciales válidas/inválidas)
├── pages/
│   ├── CartPage.ts        # Lógica y selectores del Carrito y Checkout
│   ├── HomePage.ts        # Lógica y selectores de la página principal
│   ├── LoginPage.ts       # Lógica y selectores del modal de Login
│   ├── ProductPage.ts     # Lógica y selectores de los detalles del producto
│   └── SignupPage.ts      # Lógica y selectores del modal de Registro
├── tests/
│   ├── ui/
│   │   ├── auth.spec.ts     # Pruebas de autenticación (Login/Registro)
│   │   └── checkout.spec.ts # Pruebas transaccionales (Carrito/Compra)
├── playwright.config.ts   # Configuración de navegadores, workers y reportes
└── README.md
```

## Arquitectura y Decisiones Técnicas

El framework fue diseñado teniendo en cuenta las mejores prácticas de automatización corporativa (Separación de responsabilidades, escalabilidad y mitigación de *flakiness*):

1. **Page Object Model (POM):** Se separó estrictamente la capa de interacción (locators y métodos en `/pages`) de la capa de aserciones lógicas (los archivos `.spec.ts`). Esto garantiza un mantenimiento ágil si la UI de Demoblaze cambia.
2. **Idempotencia en Pruebas:** Para el escenario de registro, se implementó una generación dinámica de `username` utilizando `Date.now()`. Esto asegura que la prueba sea idempotente y no falle por duplicidad de usuarios en ejecuciones consecutivas.
3. **Manejo de Alertas Nativas (Intercepción):** Dado que la aplicación utiliza `window.alert` de JavaScript para confirmaciones y errores, y Playwright las descarta por defecto, se implementó el listener `page.once('dialog')` para interceptar, validar aserciones sobre el mensaje y aceptar el diálogo dinámicamente.
4. **Manejo de Asincronismo (Network Waits):** En lugar de utilizar esperas duras (*hard waits*, que son un anti-patrón), se implementó `page.waitForResponse` al añadir productos. Esto garantiza que Playwright espere a que el backend devuelva un HTTP 200 antes de intentar ir al carrito.
5. **Data-Driven Approach:** Los datos sensibles y repetitivos (credenciales) se extrajeron a `/data/users.json`. Esto limpia el código de pruebas y sienta las bases para futuras pruebas parametrizadas.
6. **Integración CI/CD:** Se configuró un pipeline en GitHub Actions (`.github/workflows/playwright.yml`) que permite la ejecución paralela y multi-browser en la nube, habilitando además la ejecución manual bajo demanda (`workflow_dispatch`).

## Instrucciones de Instalación

**Requisitos previos:** - [Node.js](https://nodejs.org/) (versión 16 o superior)
- Git instalado en el equipo.

1. Clonar el repositorio:
```bash
   git clone [TU_URL_DEL_REPOSITORIO]
   cd oka-automation-challenge
```
2. Instalar las dependencias de Node:
```bash
   npm install
```
3. Instalar los binarios de los navegadores de Playwright:
```bash
npx playwright install --with-deps
```

## Ejecución de Pruebas
El framework está configurado para ejecutarse optimizando los recursos (paralelización) y capturando evidencias automáticas en caso de fallo.

**Ejecutar toda la suite (Modo Headless):**
```bash
npx playwright test
```

**Ejecutar visualizando el navegador (Modo Headed):**
```bash
npx playwright test --headed
```

**Visualizar el reporte interactivo de resultados:**
```bash
npx playwright show-report
```

**Evidencia de Ejecución**
![Evidencia de pruebas exitosas](./evidencia_ejecucion.jpg)
(Nota: El artefacto HTML con el reporte completo también se genera y almacena automáticamente en cada ejecución del pipeline de GitHub Actions).