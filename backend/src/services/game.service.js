const Game = require('../models/game.model');

class GameService {
  static async crearJuego(data) {
    try {
      const nuevoJuego = await Game.create(data);
      return nuevoJuego;
    } catch (error) {
      throw new Error(`Error al crear el juego: ${error.message}`);
    }
  }

  static parseConfig(juego) {
    if (juego && juego.configuracion && typeof juego.configuracion === 'string') {
      try { juego.configuracion = JSON.parse(juego.configuracion); } catch (e) {}
    }
    return juego;
  }

  static async obtenerJuegos(filtros = {}) {
    try {
      const juegos = await Game.findAll({ where: filtros });
      return juegos.map(j => this.parseConfig(j));
    } catch (error) {
      throw new Error(`Error al obtener los juegos: ${error.message}`);
    }
  }

  static async obtenerJuegoPorId(id) {
    try {
      const juego = await Game.findByPk(id);
      if (!juego) throw new Error('Juego no encontrado');
      return this.parseConfig(juego);
    } catch (error) {
      throw new Error(`Error al obtener el juego: ${error.message}`);
    }
  }

  static async actualizarJuego(id, data) {
  try {
    const juego = await Game.findByPk(id);
    if (!juego) throw new Error('Juego no encontrado');

    // CASO ESPECIAL: Solo está cambiando el estado de 'publicado'
    const isOnlyPublishChange = Object.keys(data).length === 1 && data.publicado !== undefined;
    
    if (isOnlyPublishChange) {
      // Permitir cambiar el estado de publicado sin restricciones
      await juego.update({ publicado: data.publicado });
      return juego;
    }

    // Para cualquier otra modificación, verificar si está publicado
    if (juego.publicado) {
      throw new Error('No se puede modificar este recurso porque ya se encuentra publicado.');
    }

    // Actualizar normalmente
    await juego.update(data);
    return juego;
  } catch (error) {
    throw new Error(`Error al actualizar el juego: ${error.message}`);
  }
}

  static async eliminarJuego(id) {
    try {
      const juego = await Game.findByPk(id);
      if (!juego) throw new Error('Juego no encontrado');
      if (juego.publicado) {
        throw new Error('No se puede eliminar este recurso porque ya se encuentra publicado o fue resuelto por estudiantes.');
      }
      await juego.destroy();
    } catch (error) {
      throw new Error(`Error al eliminar el juego: ${error.message}`);
    }
  }
  
  static async responderJuego(juegoId, datosIntento) {
    try {
      const juego = await Game.findByPk(juegoId);
      if (!juego) throw new Error('Juego no encontrado');

      let puntajeFinal = 0;
      if (datosIntento.puntaje_obtenido !== undefined) {
        puntajeFinal = Number(datosIntento.puntaje_obtenido);
        if (puntajeFinal > juego.puntaje_max) puntajeFinal = juego.puntaje_max;
      }

      return {
        juego_id: juego.id,
        titulo: juego.titulo,
        tipo: juego.tipo,
        puntaje_maximo: juego.puntaje_max,
        puntaje_obtenido: puntajeFinal,
        porcentaje_logro: Math.round((puntajeFinal / juego.puntaje_max) * 100),
        detalles: datosIntento
      };
    } catch (error) {
      throw new Error(`Error al procesar el resultado del juego: ${error.message}`);
    }
  }
}
module.exports = GameService;
