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

  // 2) Si es la primera, forzamos es_default=true
  const isFirst = existingCount === 0;
  const shouldBeDefault = isFirst || Boolean(data.es_default);

  // 3) Si cliente pidió es_default=true en no primera, desmarcamos las demás
  if (!isFirst && shouldBeDefault) {
    await TarifaAlquiler.update(
      { es_default: false },
      { where: { cancha_id: canchaId, es_default: true } }
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
  // Si quiere marcar es_default=true al editar, desmarcamos otras
  console.log("DATA", data, "para cancha ID:", canchaId);
  console.log(data.es_default, "para cancha ID:", canchaId);
  if (data.es_default) {
    await TarifaAlquiler.update(
      { es_default: false },
      {
        where: {
          cancha_id: canchaId,
          id: { [Op.ne]: id },
          es_default: true
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
  if (tarifa.es_default) {
    const next = await TarifaAlquiler.findOne({
      where: { cancha_id: canchaId },
      order: [['id', 'ASC']]
    });
    if (next) {
      await next.update({ default: true });
    }
  }
};
