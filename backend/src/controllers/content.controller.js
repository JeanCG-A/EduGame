const ContentService = require('../services/content.service');
const Content = require('../models/content.model');
const { sequelize } = require('../config/database');
const { QueryTypes } = require('sequelize');

class ContentController {
  /**
   * Maneja la solicitud para crear un nuevo contenido.
   */
  static async crearContenido(req, res) {
    try {
      const data = req.body;
      const nuevoContenido = await ContentService.crearContenido(data);
      
      res.status(201).json({
        success: true,
        message: 'Contenido creado exitosamente',
        data: nuevoContenido
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Maneja la solicitud para obtener la lista de contenidos.
   * Permite filtrar mediante query params (ej. /contenidos?modulo=matematicas)
   */
  static async obtenerContenidos(req, res) {
    try {
      const filtros = req.query;
      const contenidos = await ContentService.obtenerContenidos(filtros);
      
      res.status(200).json({
        success: true,
        data: contenidos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Maneja la solicitud para obtener un contenido por su ID.
   */
  static async obtenerContenidoPorId(req, res) {
    try {
      const { id } = req.params;
      const contenido = await ContentService.obtenerContenidoPorId(id);
      
      res.status(200).json({
        success: true,
        data: contenido
      });
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Maneja la solicitud para actualizar un contenido existente.
   */
  static async actualizarContenido(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      
      const contenidoActualizado = await ContentService.actualizarContenido(id, data);
      
      res.status(200).json({
        success: true,
        message: 'Contenido actualizado exitosamente',
        data: contenidoActualizado
      });
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Maneja la solicitud para eliminar un contenido.
   */
  static async eliminarContenido(req, res) {
    try {
      const { id } = req.params;
      await ContentService.eliminarContenido(id);
      
      res.status(200).json({
        success: true,
        message: 'Contenido eliminado exitosamente'
      });
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Retorna los módulos únicos de los contenidos creados por el docente.
   */
  static async obtenerModulos(req, res) {
    try {
      const modulos = await sequelize.query(
        'SELECT DISTINCT id, titulo, modulo FROM contenidos ORDER BY modulo ASC',
        { type: QueryTypes.SELECT }
      );
      res.status(200).json({ success: true, data: modulos });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = ContentController;
