import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Device, DeviceStatus } from './entities/device.entity';
import { Not } from 'typeorm';
import { DateTime } from 'luxon';

@Injectable()
export class DeviceService {
  
  async create(createDeviceDto: CreateDeviceDto) {
    const check = await Device.findOne({ where: { license: createDeviceDto.license } });
    if (check) {
      throw new BadRequestException(`Device already exists with license: ${createDeviceDto.license}`);
    } 
    
    const device = Device.create({
      name: createDeviceDto.name,
      license: createDeviceDto.license,
      status: DeviceStatus.ACTIVE,
    });
    

    return await Device.save(device);
  }

  async GetallDevice() {
    const data = await Device.find();
    if(data.length === 0) {
      throw new BadRequestException('No Device Data');
    }
    return data;
  }

  async GetallDeviceAvilable(DateTime) {
    const data = await Device.find({
      where: {
        status: DeviceStatus.ACTIVE,

      },
      re
    });
    return data;
  }

  findOne(id: number) {
    const data = Device.findOneBy({id: id});
    return data;
  }

  async update(id: number, updateDeviceDto: UpdateDeviceDto) {
    const check = Device.findOne({ 
      where: {
        license: updateDeviceDto.license,
        id: Not(id) 
      } 
    });
    if(check) {
      throw new BadRequestException(`Device already exists with license: ${updateDeviceDto.license}`)
    }
    const data = await Device.findOneBy({id: id});

    data.name = updateDeviceDto.name;
    data.license = updateDeviceDto.license;
    data.status = updateDeviceDto.status;

    return Device.save(data);
  }

  async remove(id: number) {
    const data = await Device.findOneBy({id: id});
    
    return Device.softRemove(data);
  }
}
