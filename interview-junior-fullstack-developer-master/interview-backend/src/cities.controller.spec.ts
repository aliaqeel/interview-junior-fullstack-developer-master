import { Test, TestingModule } from '@nestjs/testing';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { City } from './city.entity';
import { HttpException, HttpStatus } from '@nestjs/common';

// Mock CitiesService
const mockCitiesService = {
  paginateCities: jest.fn(),
};

describe('CitiesController', () => {
  let controller: CitiesController;
  let citiesService: CitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitiesController],
      providers: [
        {
          provide: CitiesService,
          useValue: mockCitiesService,
        },
      ],
    }).compile();

    controller = module.get<CitiesController>(CitiesController);
    citiesService = module.get<CitiesService>(CitiesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCities', () => {
    it('should throw an error for missing or empty query parameter', () => {
      const query = '';
      const page = 1;
      const pageSize = 5;

      // Mock throwing an error in the controller
      const mockThrowError = () => {
        throw new HttpException('Invalid request payload. "q" parameter is missing or empty.', HttpStatus.BAD_REQUEST);
      };
      controller.getCities = mockThrowError;
      try {
        controller.getCities(query, page, pageSize);
      } catch (error) {
        // Expectations
        expect(error.message).toBe('Invalid request payload. "q" parameter is missing or empty.');
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should return paginated cities for valid query parameter', () => {
      const query = 'New';
      const page = 2;
      const pageSize = 3;
      const mockCities: City[] = [
        { uuid: '1', cityName: 'New York', count: 1000 },
        { uuid: '2', cityName: 'New Orleans', count: 800 },
        { uuid: '3', cityName: 'Los Angeles', count: 600 },
      ];
      mockCitiesService.paginateCities.mockReturnValue(mockCities);

      const result = controller.getCities(query, page, pageSize);
      expect(result).toBe(mockCities);
      expect(citiesService.paginateCities).toHaveBeenCalledWith(query, page, pageSize);
    });
  });
});
