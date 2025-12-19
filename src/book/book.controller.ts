import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('book')
export class BookController {
    constructor(private readonly bookService: BookService) { }

    // Admin Only: สร้างหนังสือได้เฉพาะ Admin
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    create(@Body() createBookDto: CreateBookDto) {
        return this.bookService.create(createBookDto);
    }

    // Public: ใครก็ดูรายการหนังสือได้
    @Get()
    findAll() {
        return this.bookService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.bookService.findOne(id);
    }

    // Admin Only: แก้ไขหนังสือได้เฉพาะ Admin
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
        return this.bookService.update(id, updateBookDto);
    }

    // Admin Only: ลบหนังสือได้เฉพาะ Admin
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.bookService.remove(id);
    }

    // ต้อง Login ก่อนถึงจะ Like ได้ (ทั้ง Admin/User)
    @UseGuards(AuthGuard('jwt'))
    @Patch(':id/like')
    async toggleLike(@Param('id') id: string, @CurrentUser() user: any) {
        return this.bookService.toggleLike(id, user.userId);
    }
}

