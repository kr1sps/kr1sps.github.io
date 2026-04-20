import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Injectable()
export class StorageService {
  private s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.S3_REGION! || 'ru-central1',
      endpoint: process.env.S3_ENDPOINT! || 'https://storage.yandexcloud.net',
      forcePathStyle: true,
      systemClockOffset: 0,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const fileName = `${uuidv4()}${extname(file.originalname)}`;
      const bucket = process.env.S3_BUCKET_NAME!;

      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.s3Client.send(command);

      return `${process.env.S3_ENDPOINT}/${bucket}/${fileName}`;
    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw new InternalServerErrorException(
        'Ошибка при загрузке файла в облако',
      );
    }
  }
}
