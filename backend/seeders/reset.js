require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { sequelize } = require('../models');

(async () => {
  await sequelize.sync({ force: true });
  console.log('✅ All tables dropped and recreated');
  await sequelize.close();
})();
