import {Entity,Column,PrimaryColumn,PrimaryGeneratedColumn, BaseEntity} from 'typeorm'

@Entity()
export class Persons extends BaseEntity{

    @PrimaryColumn({type:"bigint"})
    Id!:number

    @Column()
    Name!:string

    @Column()
    UserName!:string
   
    @Column()
    Password!:string

    @Column()
    Token!:string
}