import { CustomBaseEntity } from "src/common/entities";
import { Column, Entity } from "typeorm";

@Entity()
export class Gp extends CustomBaseEntity {

    @Column({nullable: true,type: 'float'})
    lat: number;

    @Column({nullable: true,type: 'float'})
    long: number;

    @Column({nullable: true,type: 'float'})
    speed: number;

    @Column({ nullable: true, type: 'timestamp' })
    gpstime: Date;

    @Column({ nullable: true})
    device: string;

    
}
