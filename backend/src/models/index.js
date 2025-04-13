/*const sequelize = require('../config/database');
const User = require('./User');
const Activity = require('./Activity');
const Message = require('./Message');

// Definovanie vzťahov medzi modelmi
User.hasMany(Activity, { foreignKey: 'user_id' });
Activity.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Message, { foreignKey: 'sender_id' });
Message.belongsTo(User, { foreignKey: 'sender_id' });

module.exports = {
  sequelize,
  User,
  Activity,
  Message
};*/
/*
const sequelize = require('./../config/database');

// Import modelov ako funkcií
const User = require('./User')(sequelize);
const Activity = require('./Activity')(sequelize);
const Message = require('./Message')(sequelize);
const Image = require('./Image')(sequelize); // Inicializácia Image modelu

// Asociácie
User.hasMany(Activity, { foreignKey: 'user_id' });
User.hasMany(Message, { foreignKey: 'sender_id' });
User.hasMany(Image, { foreignKey: 'user_id' }); // Pridaná asociácia

Image.belongsTo(User, { foreignKey: 'user_id' });

// Export
module.exports = {
  sequelize,
  User,
  Activity,
  Message,
  Image // Uistite sa, že je exportovaný
};*/






/*
const sequelize = require('./../config/database');
const { Sequelize } = require('sequelize');

// Import modelov
const User = require('./User');
const Activity = require('./Activity');
const Message = require('./Message');
const Image = require('./Image');

// Inicializácia modelov
const db = {
  User: User.init(sequelize, Sequelize.DataTypes),
  Activity: Activity.init(sequelize, Sequelize.DataTypes),
  Message: Message.init(sequelize, Sequelize.DataTypes),
  Image: Image.init(sequelize, Sequelize.DataTypes)
};

// Definovanie asociácií
Object.values(db).forEach(model => {
  if (model.associate) {
    model.associate(db);
  }
});

module.exports = {
  ...db,
  sequelize
};*/





const sequelize = require('./../config/database');

// Import modelových funkcií
const User = require('./User');
const Activity = require('./Activity');
const Message = require('./Message');
const Image = require('./Image');

// Inicializácia modelov
const models = {
  User: User(sequelize),
  Activity: Activity(sequelize),
  Message: Message(sequelize),
  Image: Image(sequelize)
};

// Definovanie asociácií
models.User.hasMany(models.Activity, { foreignKey: 'user_id' });
models.User.hasMany(models.Message, { foreignKey: 'sender_id' });
models.User.hasMany(models.Image, { foreignKey: 'user_id' });

models.Activity.belongsTo(models.User, { foreignKey: 'user_id' });
models.Message.belongsTo(models.User, { as: 'sender', foreignKey: 'sender_id' });
models.Image.belongsTo(models.User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  ...models
};
