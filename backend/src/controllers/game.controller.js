const GameService = require('../services/game.service');

class GameController {
  static async crearJuego(req, res) {
    try {
      const data = req.body;
      const nuevoJuego = await GameService.crearJuego(data);
      res.status(201).json({ success: true, message: 'Juego creado exitosamente', data: nuevoJuego });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async obtenerJuegos(req, res) {
    try {
      const filtros = req.query;
      const juegos = await GameService.obtenerJuegos(filtros);
      res.status(200).json({ success: true, data: juegos });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async obtenerJuegoPorId(req, res) {
    try {
      const { id } = req.params;
      const juego = await GameService.obtenerJuegoPorId(id);
      res.status(200).json({ success: true, data: juego });
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async actualizarJuego(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;
      const juegoActualizado = await GameService.actualizarJuego(id, data);
      res.status(200).json({ success: true, message: 'Juego actualizado exitosamente', data: juegoActualizado });
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({ success: false, message: error.message });
      }
      if (error.message.includes('publicado')) {
        return res.status(409).json({ success: false, message: error.message });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async eliminarJuego(req, res) {
    try {
      const { id } = req.params;
      await GameService.eliminarJuego(id);
      res.status(200).json({ success: true, message: 'Juego eliminado exitosamente' });
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({ success: false, message: error.message });
      }
      if (error.message.includes('publicado')) {
        return res.status(409).json({ success: false, message: error.message });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async responderJuego(req, res) {
    try {
      const { id } = req.params;
      const datosIntento = req.body;
      if (!datosIntento || Object.keys(datosIntento).length === 0) {
        return res.status(400).json({ success: false, message: 'Debe enviar los datos del intento en el cuerpo de la petición (body).' });
      }
      const resultado = await GameService.responderJuego(id, datosIntento);
      res.status(200).json({ success: true, message: 'Intento procesado y calificado exitosamente', data: resultado });
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        return res.status(404).json({ success: false, message: error.message });
      }
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = GameController;
