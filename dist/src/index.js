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
    console.log("DataBase connected ");
});
app.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        console.log(req.body.Id);
        const t = jsonwebtoken_1.default.sign(req.body, req.body.Id);
        console.log(t);
        jsonwebtoken_1.default.sign(req.body, req.body.Id, { expiresIn: '2h' }, (err, token) => __awaiter(void 0, void 0, void 0, function* () {
            if (token) {
                yield databse_1.default
                    .createQueryBuilder()
                    .insert()
                    .into(entity_1.Persons)
                    .values([Object.assign(Object.assign({}, req.body), { Token: token })])
                    .execute();
                res.json("Data Inserted into table");
            }
            else {
                res.json({ err, Messege: "Error in fatching in token " });
            }
        }));
    }
    catch (error) {
        res.json({ error, Messege: "Someting went worong in createing data " });
    }
}));
app.get('/read', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = yield entity_1.Persons.find();
        res.json({ record, Messege: "Welcome" });
    }
    catch (error) {
        res.json({ error, Messege: "Someting went worong in Reading data " });
    }
}));
app.get('/verfy', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const person = yield databse_1.default.manager.findOneBy(entity_1.Persons, { UserName: req.query.UserName, Password: req.query.Password });
        if (person) {
            const decode = jsonwebtoken_1.default.verify(person.Token, person.Password);
            console.log(decode);
            res.json({ Messege: true, Token: person.Token });
        }
        else {
            res.json({ Messege: false });
        }
    }
    catch (error) {
        res.json({ error, Messege: "Someting went worong in verfying data " });
    }
}));
app.put('/update/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const person = yield databse_1.default.manager.findOneBy(entity_1.Persons, { Id: parseInt(req.params.id) });
        if (person) {
            yield databse_1.default
                .createQueryBuilder()
                .update(entity_1.Persons)
                .set(req.body)
                .where("id = :id", { id: req.params.id })
                .execute();
            res.json({ Messege: "Successfull" });
        }
        else {
            res.json({ Messege: "Unsuccessfull" });
        }
    }
    catch (error) {
        res.json({ error, Messege: "Someting went worong in verfying data " });
    }
}));
app.delete('/delete/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const record = yield databse_1.default.manager.findOneBy(entity_1.Persons, { Id: parseInt(req.params.id) });
        yield databse_1.default
            .createQueryBuilder()
            .delete()
            .from(entity_1.Persons)
            .where({ Id: req.params.id })
            .execute();
        res.json(record);
    }
    catch (error) {
        res.json({ error, Messege: "Someting went worong in verfying data " });
    }
}));
app.listen(4000, () => {
    console.log("Server listening on port 4000");
});
