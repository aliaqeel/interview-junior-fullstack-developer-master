import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { City } from './city.entity';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Get()
  getCities(
    @Query('q') query: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 5,
  ): City[] {
    if (!query || query.trim() === '') {
      throw new HttpException('Invalid request payload. "q" parameter is missing or empty.', HttpStatus.BAD_REQUEST);
    }

    return this.citiesService.paginateCities(query, page, pageSize);
  }
}


