import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private bookRepository: Repository<Book>,
    ) { }

    create(createBookDto: CreateBookDto) {
        return this.bookRepository.save(createBookDto);
    }

    findAll() {
        return this.bookRepository.find({ relations: ['category'] });
    }

    findOne(id: string) {
        return this.bookRepository.findOne({
            where: { id },
            relations: ['category'],
        });
    }

    async update(id: string, updateBookDto: UpdateBookDto) {
        await this.bookRepository.update(id, updateBookDto);
        return this.findOne(id);
    }

    remove(id: string) {
        return this.bookRepository.delete(id);
    }

    async incrementLikes(id: string) {
        const book = await this.findOne(id);
        if (!book) throw new NotFoundException('Book not found');
        book.likeCount += 1;
        return this.bookRepository.save(book);
    }
}
