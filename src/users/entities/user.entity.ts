import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Exclude } from 'class-transformer';

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
    @Exclude()
    password: string;

    @Column({ default: false })
    verified: boolean;

    @Column({ nullable: true })
    @Exclude()
    verificationToken: string;

    @Column({ type: 'timestamp', nullable: true })
    @Exclude()
    verificationTokenExpires: Date;

    @Column({ nullable: true })
    @Exclude()
    avatarPath: string;
}
