"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const entity_1 = require("../entitis/entity");
exports.default = new typeorm_1.DataSource({
    type: "mysql",
    database: "edulab",
    username: "root",
    password: "Root",
    synchronize: true,
    logging: true,
    entities: [entity_1.Persons]
});
