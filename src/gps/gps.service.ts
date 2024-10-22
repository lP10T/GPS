import { Injectable, Logger } from '@nestjs/common';
import { CreateGpDto } from './dto/create-gp.dto';
import { UpdateGpDto } from './dto/update-gp.dto';
import * as mqtt from 'mqtt';
import { Gp } from './entities/gp.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';

@Injectable()
export class GpsService {
  private client: mqtt.MqttClient;
  private readonly logger = new Logger(GpsService.name);

  constructor(
    @InjectRepository(Gp)
    private readonly gpRepository: Repository<Gp>,
  ) {
    this.client = mqtt.connect('mqtt://127.0.0.1:1883'); // Replace with your MQTT broker URL

    this.client.on('connect', () => {
      this.logger.log('Connected to MQTT broker');
      this.client.subscribe('gps/1', (err) => {
        if (!err) {
          this.logger.log('Subscribed to gps/1 topic');
        } else {
          this.logger.error('Subscription error:', err);
        }
      });
    });

    this.client.on('message', async (topic, message) => {
      try {
        const gpsdata = JSON.parse(message.toString());
        // this.logger.log(`${topic}:`, gpsdata);
        await this.create(gpsdata); // Save GPS data to the database
      } catch (error) {
        this.logger.error('Error parsing message:', error);
      }
    });
  }

  create(gpsdata: CreateGpDto) {
    const data = this.gpRepository.create({
      lat: gpsdata.lat,
      long: gpsdata.long,
      speed: gpsdata.speed,
      gpstime: gpsdata.gpstime,
    });
console.log(data);

    this.gpRepository.save(data);
    return data;
  }

  async findAll(){
    return await this.gpRepository.find();
  }

  async findOne(id: number){
    // return await this.gpRepository.findOne(id);
  }

  async update(id: number, updateGpDto: UpdateGpDto){
    // await this.gpRepository.update(id, updateGpDto);
    return this.findOne(id);
  }

  async remove(id: number){
    await this.gpRepository.delete(id);
  }
}
