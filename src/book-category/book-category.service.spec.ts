import { Test, TestingModule } from '@nestjs/testing';
import { BookCategoryService } from './book-category.service';

describe('BookCategoryService', () => {
  let service: BookCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookCategoryService],
    }).compile();

    service = module.get<BookCategoryService>(BookCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0) {
      console.log('Seeding Book Categories...');
      await this.repo.save([
        { name: 'Fiction', description: 'Stories and novels' },
        { name: 'Technology', description: 'Computers and engineering' },
        { name: 'History', description: 'Past events' }
      ]);
    }
  }

});
