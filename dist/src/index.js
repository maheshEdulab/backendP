"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const databse_1 = __importDefault(require("./config/databse"));
const entity_1 = require("./entitis/entity");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
databse_1.default.initialize().then(() => {
    console.log("DataBase of person  connected ");
});
app.get('/read', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const record = yield entity_1.Persons.find();
    res.json({ record, Messege: "Welcome" });
}));
app.get('/verfy', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const person = yield databse_1.default.manager.findOneBy(entity_1.Persons, { UserName: JSON.stringify(req.query.UserName), Password: JSON.stringify(req.query.Password) });
    if (person) {
        console.log(person);
        res.json({ person, Messege: "Record get" });
    }
}));
app.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    jsonwebtoken_1.default.sign(req.body, req.body.Password, { expiresIn: '2' }, (err, token) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(token);
        yield databse_1.default
            .createQueryBuilder()
            .insert()
            .into(entity_1.Persons)
            .values([Object.assign(Object.assign({}, req.body), { Token: token })])
            .execute();
        res.json("Data Inserted into table");
    }));
}));
app.listen(4000, () => {
    console.log("Server listening on port 4000");
});
