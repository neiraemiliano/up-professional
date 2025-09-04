// src/controllers/user.controller.js
const generateController = require("./base.controller");
const userService = require("../services/user.service");
const prisma = require("../config/db");

const baseController = generateController(userService);

// Función específica para admins: obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      success: true,
      data: users,
      message: "Usuarios obtenidos correctamente"
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo usuarios',
      message: error.message
    });
  }
};

// Función específica para admins: actualizar rol de usuario
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'professional', 'customer'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Rol inválido'
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        role: true,
        isVerified: true
      }
    });

    res.json({
      success: true,
      data: updatedUser,
      message: "Usuario actualizado correctamente"
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      error: 'Error actualizando usuario',
      message: error.message
    });
  }
};

module.exports = {
  ...baseController,
  getAllUsers,
  updateUser
};
