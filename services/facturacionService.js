// backend/services/facturacionService.js

const { Facturacion } = require('../models/facturacionModel');
const { Usuario }     = require('../models/userModel');

// Obtener todas las facturas
exports.getAllFacturas = async () => {
  return await Facturacion.findAll({
    include: [{
      model: Usuario,
      as: 'Usuario',
      attributes: ['id', 'nombre', 'apellido', 'email']
    }]
  });
};

// Obtener facturas por usuario
exports.getFacturasByUsuario = async (usuario_id) => {
  return await Facturacion.findAll({
    where: { usuario_id },
    include: [{
      model: Usuario,
      as: 'Usuario',
      attributes: ['id', 'nombre', 'apellido', 'email']
    }]
  });
};

// Crear una nueva factura
exports.createFactura = async (data) => {
  // Opcionalmente, podríamos validar que el usuario exista:
  const usuario = await Usuario.findByPk(data.usuario_id);
  if (!usuario) {
    const err = new Error('No existe el usuario para asignar factura');
    err.status = 400;
    throw err;
  }
  return await Facturacion.create(data);
};

// Actualizar factura por ID
exports.updateFacturaById = async (id, data) => {
  const factura = await Facturacion.findByPk(id);
  if (!factura) {
    const err = new Error('Factura no encontrada');
    err.status = 404;
    throw err;
  }
  return await factura.update(data);
};

// Eliminar factura por ID
exports.deleteFacturaById = async (id) => {
  const factura = await Facturacion.findByPk(id);
  if (!factura) {
    const err = new Error('Factura no encontrada');
    err.status = 404;
    throw err;
  }
  await factura.destroy();
};
