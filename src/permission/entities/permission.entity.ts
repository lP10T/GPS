import { CustomBaseEntity } from "../../common/entities/custom-base.entity";
import { Role } from "../../role/entities/role.entity";
import { Column, CreateDateColumn, Entity, Index, ManyToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
@Unique(['name'])
export class Permission extends CustomBaseEntity {
    @Column({comment: 'Permission name'})
    @Index({ unique: true })
    name: string;

    @Column({ nullable: true, comment: 'Payment-method description' })
    description: string;

    @ManyToMany(() => Role, (_) => _.permissions)
    role: Array<Role>;

    constructor(partial?: Partial<Permission>) {
        super();
        if (partial) {
            Object.assign(this, partial)
        }
    }
}
