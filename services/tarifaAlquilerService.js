// backend/services/tarifaAlquilerService.js
const { TarifaAlquiler } = require('../models/tarifaAlquilerModel');

exports.getAllTarifas = (canchaId = null) => {
  const where = canchaId ? { cancha_id: canchaId } : {};
  return TarifaAlquiler.findAll({ where });
};

exports.getTarifaById = async (id) => {
  const tarifa = await TarifaAlquiler.findByPk(id);
  if (!tarifa) {
    const err = new Error('Tarifa no encontrada');
    err.status = 404;
    throw err;
  }
  return tarifa;
};

exports.createTarifa = (data) => {
  return TarifaAlquiler.create(data);
};

exports.updateTarifaById = async (id, data) => {
  const tarifa = await TarifaAlquiler.findByPk(id);
  if (!tarifa) {
    const err = new Error('Tarifa no encontrada');
    err.status = 404;
    throw err;
  }
  return tarifa.update(data);
};

exports.deleteTarifaById = async (id) => {
  const tarifa = await TarifaAlquiler.findByPk(id);
  if (!tarifa) {
    const err = new Error('Tarifa no encontrada');
    err.status = 404;
    throw err;
  }
  await tarifa.destroy();
};
