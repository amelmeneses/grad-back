// backend/services/tarifaAlquilerService.js
const { TarifaAlquiler } = require('../models/tarifaAlquilerModel');
const { Op } = require('sequelize');

exports.getAllTarifas = (canchaId) => {
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

exports.createTarifa = async (data, canchaId) => {
  // 1) ¿Cuántas tarifas ya hay para esta cancha?
  const existingCount = await TarifaAlquiler.count({
    where: { cancha_id: canchaId }
  });

  // 2) Si es la primera, forzamos default=true
  const isFirst = existingCount === 0;
  const shouldBeDefault = isFirst || Boolean(data.default);

  // 3) Si cliente pidió default=true en no primera, desmarcamos las demás
  if (!isFirst && shouldBeDefault) {
    await TarifaAlquiler.update(
      { default: false },
      { where: { cancha_id: canchaId, default: true } }
    );
  }

  // 4) Creamos la tarifa
  const nueva = await TarifaAlquiler.create({
    ...data,
    cancha_id: canchaId,
    default: shouldBeDefault
  });
  return nueva;
};

exports.updateTarifaById = async (canchaId, id, data) => {
  // Si quiere marcar default=true al editar, desmarcamos otras
  if (data.default) {
    await TarifaAlquiler.update(
      { default: false },
      {
        where: {
          cancha_id: canchaId,
          id: { [Op.ne]: id },
          default: true
        }
      }
    );
  }
  const tarifa = await exports.getTarifaById(canchaId, id);
  return tarifa.update(data);
};

exports.deleteTarifaById = async (canchaId, id) => {
  const tarifa = await exports.getTarifaById(canchaId, id);
  await tarifa.destroy();

  // Si esa era la única marcada default y quedan tarifas, marcamos la primera como default
  if (tarifa.default) {
    const next = await TarifaAlquiler.findOne({
      where: { cancha_id: canchaId },
      order: [['id', 'ASC']]
    });
    if (next) {
      await next.update({ default: true });
    }
  }
};
