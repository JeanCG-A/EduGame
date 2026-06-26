# EduGame 🎮📚

## Descripción general
EduGame es una aplicación web interactiva y gamificada diseñada para fortalecer competencias básicas en estudiantes con ayuda de la tecnologia (vocabulario, lectura, razonamiento). Este repositorio corresponde a mi proyecto de grado e incluye un frontend en React (Vite) y un backend en Node.js/Express con persistencia mediante Sequelize/MySQL.

## Público objetivo
- Estudiantes de educación básica.
- Docentes que quieran crear y evaluar actividades lúdicas.
- Evaluadores académicos y desarrolladores interesados en soluciones educativas.

## Funcionalidades principales
- Autenticación y control de acceso (AuthContext).
- Panel para docentes: creación/gestión de contenidos y evaluaciones, revisión de resultados.
- Panel para estudiantes: acceso a contenidos, juegos y evaluaciones; seguimiento de progreso.
- Juegos educativos (p. ej. actividades tipo wordfind y otros minijuegos).
- Sistema de evaluaciones y registro de resultados.
- Comunicaciones frontend-backend vía axios (APIs REST).

## Tecnologías
- Frontend: React + Vite
  - react, react-dom, react-router-dom, axios, react-icons, sweetalert2, wordfind
- Backend: Node.js + Express
  - express, sequelize, mysql2, jsonwebtoken, bcryptjs, cors, dotenv
- Base de datos: MySQL (via Sequelize)

## Estructura del proyecto
