javascript-code(server.js)
===============
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();
const sequelize = new Sequelize('postgres://username:password@localhost:5432/database');
const Customer = sequelize.define('Customer', {
  sno: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customer_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: DataTypes.INTEGER,
  phone: DataTypes.STRING,
  location: DataTypes.STRING,
  created_at: DataTypes.DATE
});

app.get('/api/customers', async (req, res) => {
  const { page = 1, search = '', sortBy = 'created_at' } = req.query;
  const limit = 20;
  const offset = (page - 1) * limit;
  try {
    const customers = await Customer.findAndCountAll({
      where: {
        [Sequelize.Op.or]: [
          { customer_name: { [Sequelize.Op.iLike]: `%${search}%` } },
          { location: { [Sequelize.Op.iLike]: `%${search}%` } }
        ]
      },
      order: [[sortBy, 'ASC']],
      limit,
      offset
    });
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


=====================================================================

