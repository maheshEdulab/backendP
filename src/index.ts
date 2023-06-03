import express, { Request, Response } from "express";
import cors from 'cors'
import dataSource from './config/databse'
import { Persons } from "./entitis/entity";
import jwt from 'jsonwebtoken'

const app = express();

app.use(cors());
app.use(express.json());

dataSource.initialize().then(() => {
    console.log("DataBase of person  connected ")
})


app.get('/read', async (req: Request, res: Response) => {
    const record = await Persons.find()
    res.json({ record, Messege: "Welcome" })
})

app.get('/verfy', async (req: Request, res: Response) => {
    console.log(req.query)
    const person = await dataSource.manager.findOneBy(Persons, { UserName: req.query.UserName as string, Password: req.query.Password as string })
    res.json(person?.Token)
})

app.post('/create', async (req: Request, res: Response) => {
    jwt.sign(req.body, req.body.Password, { expiresIn: '2' }, async (err, token) => {
        console.log(token)
        await dataSource
            .createQueryBuilder()
            .insert()
            .into(Persons)
            .values([{ ...req.body, Token: token }])
            .execute()
        res.json("Data Inserted into table")
    })
})


app.listen(4000, () => {
    console.log("Server listening on port 4000")
})