import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['email', 'username'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    username: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: false })
    verified: boolean;

    @Column({ nullable: true })
    verificationToken: string;

    @Column({ type: 'timestamp', nullable: true })
    verificationTokenExpires: Date;
}
