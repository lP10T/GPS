import { Exclude, Expose } from "class-transformer";
import { CustomBaseEntity } from "../../common/entities/custom-base.entity";
import { Role } from "../../role/entities/role.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, Unique } from "typeorm";
import { UserAtthem } from "./user-atthem.entity";
import { AuditLog } from "../../auditlog/entities/auditlog.entity";

@Entity()
@Unique(['username', 'code'])
export class User extends CustomBaseEntity {
    @Column()
    @Index({ unique: true })
    username: string;

    @Column()
    @Exclude()
    password: string;

    @Column()
    @Index({ unique: true })
    code: string;

    @Column({ name: 'first_name' })
    firstName: string;

    @Column({ name: 'last_name' })
    lastName: string;

    @Column({ name: 'phone_number', nullable: true, length: 10 })
    phoneNumber: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @ManyToOne(() => Role, (_) => _.users)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @Exclude()
    @Column({ name: 'refresh_token', nullable: true })
    refreshToken: string;

    @OneToMany(() => UserAtthem, (userAtthem) => userAtthem.user)
    userAtthems: UserAtthem[];
    
    @Expose()
    get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    @OneToMany(() => AuditLog, (_) => _.user)
    auditLogs: AuditLog[];

    constructor(partial?: Partial<User>) {
        super();
        if (partial) {
            Object.assign(this, partial)
        }
    }
}
