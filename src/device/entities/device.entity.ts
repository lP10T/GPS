import { CustomBaseEntity } from '../../common/entities/custom-base.entity';
import { IsNotEmpty } from 'class-validator';

export enum DeviceStatus {
    ACTIVE = 'Active',
    OFFLINE = 'Offline',
}

export class Device extends CustomBaseEntity {

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    license: string;

    status: DeviceStatus;

}
