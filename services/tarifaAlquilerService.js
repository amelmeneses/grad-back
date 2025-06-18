// backend/services/tarifaAlquilerService.js
const { TarifaAlquiler } = require('../models/tarifaAlquilerModel');

exports.getAllTarifas = (canchaId) => {
  // Filtrar siempre por cancha_id
  console.log("Cancha ID:", canchaId);
  return TarifaAlquiler.findAll({
    where: { cancha_id: canchaId }
  });
};

exports.getTarifaById = async (canchaId, tariffId) => {
  const tarifa = await TarifaAlquiler.findOne({
    where: { cancha_id: canchaId, id: tariffId },
  });
  if (!tarifa) {
    const err = new Error('Tarifa no encontrada');
    err.status = 404;
    throw err;
  }
  return tarifa;
};

exports.createTarifa = (data, canchaId) => {
  return TarifaAlquiler.create({ ...data, cancha_id: canchaId });
};

exports.updateTarifaById = async (canchaId, id, data) => {
  const tarifa = await exports.getTarifaById(canchaId, id);
  return tarifa.update(data);
};

exports.deleteTarifaById = async (canchaId, id) => {
  const tarifa = await exports.getTarifaById(canchaId, id);
  await tarifa.destroy();
};
