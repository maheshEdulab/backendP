import express, { Request, Response } from "express";
import cors from 'cors'
import dataSource from './config/databse'
import { Persons } from "./entitis/entity";
import jwt from 'jsonwebtoken'

const app = express();

app.use(cors());
app.use(express.json());

dataSource.initialize().then(() => {
    console.log("DataBase connected ")
})

app.post('/create', async (req: Request, res: Response) => {
    try {
        console.log(req.body)
        console.log(req.body.Id)
        jwt.sign(req.body, req.body.Id, { expiresIn: '24h' }, async (err, token) => {
            if (token) {
                await dataSource
                    .createQueryBuilder()
                    .insert()
                    .into(Persons)
                    .values([{ ...req.body, Token: token }])
                    .execute()
                res.json("Data Inserted into table")
            } else {
                res.json({ err, Messege: "Error in fatching in token " })
            }

        })

    }
    catch (error) {
        res.json({ error, Messege: "Someting went worong in createing data " })
    }
})

app.get('/read', async (req: Request, res: Response) => {
    try {
        const record = await Persons.find()
        res.json({ record, Messege: "Welcome" })
    }
    catch (error) {
        res.json({ error, Messege: "Someting went worong in Reading data " })
    }
})

app.get('/verfy', async (req: Request, res: Response) => {
    try {
        const person = await dataSource.manager.findOneBy(Persons, { UserName: req.query.UserName as string, Password: req.query.Password as string })
        if (person) {
            const decode = jwt.verify(person.Token, person.Password)
            console.log(decode)
            res.json({ Messege: true, Token: person.Token })
        } else {
            res.json({ Messege: false })
        }
    }
    catch (error) {
        res.json({ error, Messege: "Someting went worong in verfying data " })
    }

})

app.put('/update/:id', async (req: Request, res: Response) => {
    try {
        const person = await dataSource.manager.findOneBy(Persons, { Id: parseInt(req.params.id) })
        if (person) {
            await dataSource
                .createQueryBuilder()
                .update(Persons)
                .set(req.body)
                .where("id = :id", { id: req.params.id })
                .execute()
            res.json({ Messege: "Successfull" })
        } else {
            res.json({ Messege: "Unsuccessfull" })
        }
    }
    catch (error) {
        res.json({ error, Messege: "Someting went worong in verfying data " })
    }
})

app.delete('/delete/:id', async (req: Request, res: Response) => {
    try {
        const record = await dataSource.manager.findOneBy(Persons, { Id: parseInt(req.params.id) })
        await dataSource
            .createQueryBuilder()
            .delete()
            .from(Persons)
            .where({ Id: req.params.id })
            .execute();
        res.json(record)
    }
    catch (error) {
        res.json({ error, Messege: "Someting went worong in verfying data " })
    }
})

app.listen(4000, () => {
    console.log("Server listening on port 4000")
})