import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookCategoryModule } from './book-category/book-category.module';
import { BookModule } from './book/book.module';
import { BookCategory } from './book-category/entities/book-category.entity';
import { Book } from './book/entities/book.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'password123',
      database: 'bookstore_dev',
      entities: [BookCategory, Book],
      synchronize: true, // สร้าง Table อัตโนมัติ (ใช้สำหรับ Dev เท่านั้น)
    }),
    BookCategoryModule,
    BookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
