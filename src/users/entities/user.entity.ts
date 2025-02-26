import { Column, CreateDateColumn, Entity, Index, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { PasswordResetToken } from 'src/reset-password-token/entities/password-reset-token.entity';

@Entity()
// @Unique(['email', 'username'])
@Index(['email', 'username'], { unique: true })
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

    @Column({ nullable: true })
    avatarUrl: string;

    @OneToOne(() => PasswordResetToken, (token) => token.user)
    passwordResetToken: PasswordResetToken;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
