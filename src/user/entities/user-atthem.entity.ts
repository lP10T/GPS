import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { CustomBaseEntity } from "../../common/entities/custom-base.entity";
import { User } from "./user.entity";

@Entity()
export class UserAtthem extends CustomBaseEntity {
    @Column({ default: 0 })
    failedLoginAttempts: number;

    @Column({ type: 'timestamp', nullable: true })
    lastFailedAttempt: Date;

    @ManyToOne(() => User, (user) => user.userAtthems)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
