import { CustomBaseEntity } from "../../common/entities/custom-base.entity";
import { Permission } from "../../permission/entities/permission.entity";
import { User } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
@Unique(['name'])
export class Role extends CustomBaseEntity {
  @Column({ comment: 'Unique name of the role' })
  @Index({ unique: true })
  name: string; // Unique name of the role
  
  @Column({ nullable: true, comment: 'Description of the role' })
  description: string; // Description of the role (optional)

    @OneToMany(() => User, (_) => _.role)
    users: Array<User>;

    @ManyToMany(() => Permission, (_) => _.role)
    @JoinTable({
        name: "role_permission",
        joinColumn: {
            name: "role_id",
            referencedColumnName: "id"
        },
        inverseJoinColumn: {
            name: "permission_id",
            referencedColumnName: "id"
        }
    })
    permissions: Array<Permission>;

    constructor(partial?: Partial<Role>) {
        super();
        if (partial) {
            Object.assign(this, partial)
        }
    }
}
