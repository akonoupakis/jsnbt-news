var packInfo = require('../package');
var installer = require('jsnbt/installer');

console.log('uninstalling ' + packInfo.name + ' v' + packInfo.version);
installer.npm.unpack(packInfo.name);
console.log('uninstalled ' + packInfo.name + ' v' + packInfo.version);