// backend/services/horarioFuncionamientoService.js
const { HorarioFuncionamiento } = require('../models/horarioFuncionamientoModel');

exports.getAllHorarios = (canchaId) => {
  return HorarioFuncionamiento.findAll({
    where: { cancha_id: canchaId },
    order: [['id', 'ASC']],
  });
};

exports.getHorarioById = async (canchaId, id) => {
  const h = await HorarioFuncionamiento.findOne({
    where: { cancha_id: canchaId, id },
  });
  if (!h) {
    const err = new Error('Horario no encontrado');
    err.status = 404;
    throw err;
  }
  return h;
};

exports.createHorario = async (data, canchaId) => {
  const nueva = await HorarioFuncionamiento.create({
    ...data,
    cancha_id: canchaId,
  });
  return nueva;
};

exports.updateHorarioById = async (canchaId, id, data) => {
  const h = await exports.getHorarioById(canchaId, id);
  return h.update(data);
};

exports.deleteHorarioById = async (canchaId, id) => {
  const h = await exports.getHorarioById(canchaId, id);
  await h.destroy();
};
