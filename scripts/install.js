var packInfo = require('../package');
var installer = require('jsnbt/installer');

console.log('installing ' + packInfo.name + ' v' + packInfo.version);
installer.npm.pack(packInfo.name, true);
console.log('installed ' + packInfo.name + ' v' + packInfo.version);