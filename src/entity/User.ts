import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Ticket } from "./Ticket"

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    email!: string;

    @Column()
    name!: string;

    @Column()
    role!: string;

    @Column()
    password!: string;

    @OneToMany(() => Ticket, ticket => ticket.user, {eager:true, cascade:true})
    tickets?: Ticket[];



}
