var fs = require("fs");

module.exports = [{
    name: "nodes",
    events: {
        validate: fs.readFileSync(__dirname + "/collections/nodes/validate.js", "utf8")
    }
}];