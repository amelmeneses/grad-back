//services/canchaService.js
const { Cancha } = require('../models/canchaModel');
const { TarifaAlquiler } = require('../models/tarifaAlquilerModel');

exports.getAll = () =>
  Cancha.findAll();

exports.getByEmpresa = (empresaId) =>
  Cancha.findAll({ where: { empresa_id: empresaId } });

exports.getById = (id) =>
  Cancha.findByPk(id);

exports.create = (data) =>
  Cancha.create(data);

exports.updateById = (id, data) =>
  Cancha.update(
    data,
    { where: { id }, returning: true }
  ).then(([_, rows]) => rows[0]);

exports.deleteById = (id) =>
  Cancha.destroy({ where: { id } });

// ** NUEVO **: Cambiar solo el campo "estado"
exports.cambiarEstadoCancha = async (id, nuevoEstado) => {
  const cancha = await Cancha.findByPk(id);
  if (!cancha) {
    const err = new Error('Cancha no encontrada');
    err.status = 404;
    throw err;
  }
  cancha.estado = nuevoEstado;
  await cancha.save();
  return cancha;
};

exports.getActivasPorDeporte = (deporte) =>
  Cancha.findAll({
    where: { deporte, estado: 1 },
    include: [
      {
        model: TarifaAlquiler,
        as: 'tarifas',
        where: { default: 1 },
        required: false // para que incluya aunque no tenga tarifa default
      }
    ]
  });