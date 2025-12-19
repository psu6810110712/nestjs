import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { User } from '../users/entities/user.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private bookRepository: Repository<Book>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
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

    async toggleLike(id: string, userId: number) {
        const book = await this.bookRepository.findOne({
            where: { id },
            relations: ['likedBy', 'category'],
        });
        if (!book) throw new NotFoundException('Book not found');

        const userIndex = book.likedBy.findIndex(u => u.id === userId);

        if (userIndex > -1) {
            // User already liked - remove like (Unlike)
            book.likedBy.splice(userIndex, 1);
            book.likeCount -= 1;
        } else {
            // User hasn't liked - add like
            const user = await this.userRepository.findOneBy({ id: userId });
            if (!user) throw new NotFoundException('User not found');
            book.likedBy.push(user);
            book.likeCount += 1;
        }

        return this.bookRepository.save(book);
    }
}

