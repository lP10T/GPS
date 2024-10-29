import { DeviceStatus } from "../entities/device.entity";

export class CreateDeviceDto {

    readonly name: string;

    readonly license: string;

    readonly status: DeviceStatus;
}
