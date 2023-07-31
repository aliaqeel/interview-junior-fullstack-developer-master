import { Test, TestingModule } from '@nestjs/testing';
import { CitiesService } from './cities.service';
import { City } from './city.entity';

jest.mock('fs');
jest.mock('path');

describe('CitiesService', () => {
  let citiesService: CitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CitiesService],
    }).compile();

    citiesService = module.get<CitiesService>(CitiesService);
  });

  it('should be defined', () => {
    expect(citiesService).toBeDefined();
  });

  describe('getCitiesMatchingQuery', () => {
    it('should return filtered cities based on the query', () => {
      // Mock cities data
      const mockCities: City[] = [
        { uuid: '1', cityName: 'New York', count: 1000 },
        { uuid: '2', cityName: 'Los Angeles', count: 800 },
        { uuid: '3', cityName: 'Chicago', count: 600 },
      ];

      citiesService['cities'] = mockCities;
      const filteredCities = citiesService.getCitiesMatchingQuery('new');
      expect(filteredCities.length).toBe(1);
      expect(filteredCities[0].cityName).toBe('New York');
    });
  });

  describe('paginateCities', () => {
    it('should return the correct paginated cities', () => {

      const mockCities: City[] = [
        { uuid: '1', cityName: 'New York', count: 1000 },
        { uuid: '2', cityName: 'Los Angeles', count: 800 },
        { uuid: '3', cityName: 'Chicago', count: 600 },
        { uuid: '4', cityName: 'San Francisco', count: 700 },
        { uuid: '5', cityName: 'Seattle', count: 500 },
      ];

      citiesService['cities'] = mockCities;
      const pageSize = 2;
      const page1Result = citiesService.paginateCities('y', 1, pageSize);
      const page2Result = citiesService.paginateCities('y', 2, pageSize);
      expect(page1Result.length).toBe(pageSize);
      expect(page1Result[0].cityName).toBe('New York');
      expect(page1Result[1].cityName).toBe('San Francisco');

      expect(page2Result.length).toBe(pageSize);
      expect(page2Result[0].cityName).toBe('Los Angeles');
      expect(page2Result[1].cityName).toBe('Seattle');
    });

  });
});
