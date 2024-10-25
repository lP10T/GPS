import { Injectable, Logger } from '@nestjs/common';
import { CreateGpDto } from './dto/create-gp.dto';
import { UpdateGpDto } from './dto/update-gp.dto';
import * as mqtt from 'mqtt';
import { Gp } from './entities/gp.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DateTime } from 'luxon';
import { InjectQueue, OnQueueActive, Process, Processor } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
@Processor('gps')
export class GpsService {
  private client: mqtt.MqttClient;
  private readonly logger = new Logger(GpsService.name);

  constructor(
    @InjectRepository(Gp)
    private readonly gpRepository: Repository<Gp>,
    @InjectQueue('gps') private readonly gpsQueue: Queue,
  ) {
    this.client = mqtt.connect('mqtt://127.0.0.1:1883'); // Replace with your MQTT broker URL

    this.client.on('connect', () => {
      // this.logger.log('Connected to MQTT broker');
      this.client.subscribe('gps/1', (err) => {
        if (!err) {
          // this.logger.log('Subscribed to gps/1 topic');
        } else {
          this.logger.error('Subscription error:', err);
        }
      });
    });

    this.client.on('message', async (topic, message) => {
      try {
        const gpsdata = JSON.parse(message.toString());
        this.logger.log(`Received message on ${topic}:`, gpsdata);
        await this.addJobToQueue(gpsdata);
      } catch (error) {
        this.logger.error('Error parsing message:', error);
      }
    });
  }

  @Process({ name: 'processGpsData', concurrency: 1 })
  async handleGpsData(job: { data: CreateGpDto }) {
    // console.log('Job received:', job);

    const gpsData = job.data;
    try {
      // Process the GPS data and save it to the database
      const data = this.gpRepository.create({
        lat: gpsData.lat,
        long: gpsData.long,
        speed: gpsData.speed,
        gpstime: gpsData.gpstime,
        device: gpsData.device,
      });
      await this.gpRepository.save(data);
      console.log('Data saved:', data);

    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  async addJobToQueue(createGpDto: CreateGpDto) {
    return this.gpsQueue.add('processGpsData', createGpDto);
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
