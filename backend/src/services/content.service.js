const Content = require('../models/content.model');

class ContentService {
  static async crearContenido(data) {
    try {
      return await Content.create(data);
    } catch (error) {
      throw new Error(`Error al crear el contenido: ${error.message}`);
    }
  }

  static async obtenerContenidos(filtros = {}) {
    try {
      return await Content.findAll({ where: filtros });
    } catch (error) {
      throw new Error(`Error al obtener los contenidos: ${error.message}`);
    }
  }

  static async obtenerContenidoPorId(id) {
    try {
      const contenido = await Content.findByPk(id);
      if (!contenido) throw new Error('Contenido no encontrado');
      return contenido;
    } catch (error) {
      throw new Error(`Error al obtener el contenido: ${error.message}`);
    }
  }

  static async actualizarContenido(id, data) {
    try {
      const contenido = await Content.findByPk(id);
      if (!contenido) throw new Error('Contenido no encontrado');
      if (contenido.publicado) {
        const isOnlyPublishChange = Object.keys(data).length === 1 && data.publicado !== undefined;
        if (isOnlyPublishChange) {
          await contenido.update({ publicado: data.publicado }, { transaction: t });
          await t.commit();
          return contenido;
        }
        throw new Error('publicado: No se puede modificar este contenido porque ya está publicado.');
      }
      await contenido.update(data);
      return contenido;
    } catch (error) {
      throw new Error(`Error al actualizar el contenido: ${error.message}`);
    }
  }

  static async eliminarContenido(id) {
    try {
      const contenido = await Content.findByPk(id);
      if (!contenido) throw new Error('Contenido no encontrado');
      if (contenido.publicado) {
        throw new Error('publicado: No se puede eliminar este contenido porque ya está publicado.');
      }
      await contenido.destroy();
      return true;
    } catch (error) {
      throw new Error(`Error al eliminar el contenido: ${error.message}`);
    }
  }
}
module.exports = ContentService;
