# DOCUMENTACIÓN – Book Reviews (Deploy & CI/CD)

Plataforma de descubrimiento y reseñas de libros construida con **Next.js** (App Router) y un pipeline de **CI/CD** con **GitHub Actions**. La release a contenedor se publica en **GitHub Container Registry (GHCR)** y el deploy web se realiza en **Vercel**.

> - Producción: `https://book-reviews-rho.vercel.app/`
> - Repo: `https://github.com/milagrosidiarte/book-reviews`
> - GHCR: `ghcr.io/milagrosidiarte/book-reviews`

---

## 1) Resumen

- **Frontend**: Next.js 14+ (TypeScript, App Router, Tailwind/shadcn-ui)
- **CI/CD**:
  - **PR – Build**: compila Next en cada Pull Request
  - **PR – Tests**: ejecuta Vitest en cada Pull Request
  - **Docker – Publish**: al merge en `main`, publica imagen en GHCR con tags `latest`, `sha`, y versión de `package.json`
- **Contenedor**: Docker multi-stage con `output: "standalone"` para imagen liviana
- **Hosting**: Vercel (auto-deploy de previews/producción)

---

## 2) Requisitos

- Node **18+** (CI usa Node **20**)
- npm 
- Cuenta en **GitHub** con Actions habilitadas
- Cuenta en **Vercel** conectada al repo

---

## 3) Ejecución local

npm ci
npm run dev
# abre http://localhost:3000

--- 

## 4) Deploy a Vercel

Ir a https://vercel.com/new y conectar el repositorio.

Framework: Next.js (detectado automáticamente).

Build command: npm run build (auto).

Confirmar:

Preview Deploys: en cada PR o push a rama ≠ main.

Production Deploy: en merge a main.

Comprobación: visitar https://book-reviews-rho.vercel.app/ y validar que la app funciona.

## 5) CI/CD con GitHub Actions
5.1 PR – Build (compilar en PR)

Archivo: .github/workflows/pr-build.yml

Evento: pull_request

Pasos: checkout → setup Node 20 (con cache npm) → npm ci → npm run build

Resultado: si falla el build, el PR queda en rojo.

5.2 PR – Tests (Vitest en PR)

Archivo: .github/workflows/pr-test.yml

Evento: pull_request

Pasos: checkout → setup Node 20 (cache npm) → npm ci → npm test

Requisitos:

Scripts en package.json:

{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}


5.3 Docker – Publish (GHCR en main)

Archivo: .github/workflows/docker-publish.yml

Evento: push a main (y workflow_dispatch)

Tags publicados:

latest

sha-<commit>

<version> (sale de package.json, ej. 0.1.0)

Imagen resultante: ghcr.io/milagrosidiarte/book-reviews

Tip: cuando cambies la versión en package.json (ej. 0.1.1), al mergear a main se publicará un tag nuevo con esa versión.


## 6) Docker (local)
6.1 Build local
docker build -t book-reviews:dev .

6.2 Run local
# si necesitás variables, pasalas con --env-file .env.local
docker run --rm -p 3000:3000 book-reviews:dev
# abre http://localhost:3000


Detalles técnicos:

next.config.ts define output: "standalone", lo que genera .next/standalone + server.js listo para producción.

El Dockerfile es multi-stage:

deps (npm ci)

build (npm run build)

runtime (usuario no-root, copia solo artefactos necesarios)

## 7) Imagen en GHCR

Página del paquete:

https://github.com/milagrosidiarte/book-reviews/pkgs/container/book-reviews

Pull & run (público):

docker pull ghcr.io/milagrosidiarte/book-reviews:0.1.0
docker run --rm -p 3000:3000 ghcr.io/milagrosidiarte/book-reviews:0.1.0


