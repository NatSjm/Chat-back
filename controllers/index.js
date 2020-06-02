const dialogCreate = require('./dialogCreate.js');
const dialogDelete = require('./dialogDelete.js');
const dialogGetMany = require('./dialogGetMany.js');
const dialogGetOne = require('./dialogGetOne.js');
const dialogUpdate = require('./dialogUpdate.js');
const messageCreate = require('./messageCreate.js');
const messageUpdate = require('./messageUpdate.js');
const messageDelete = require('./messageDelete.js');
const messageGetMany = require('./messageGetMany.js');
const userGetOne = require('./userGetOne.js');
const userGetMany = require('./userGetMany.js');
const userLogin = require('./userLogin.js');
const userCreate = require('./userCreate.js');
const tokensRefresh = require('./tokensRefresh.js');

module.exports = {
	dialogCreate,
	dialogDelete,
	dialogGetMany,
	dialogGetOne,
	dialogUpdate,
	messageCreate,
	messageDelete,
	messageUpdate,
	messageGetMany,
	userGetMany,
	userGetOne,
	userLogin,
	userCreate,
	tokensRefresh,
};
