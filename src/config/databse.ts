import { DataSource } from "typeorm"
import { Persons } from "../entitis/entity"

export default new DataSource({
    type: "mysql",
    database: "edulab",
    username: "root",
    password: "Root",
    synchronize: true,
    logging: true,
    entities: [Persons]
})
