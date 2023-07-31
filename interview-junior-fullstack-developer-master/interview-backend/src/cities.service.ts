import { Injectable } from '@nestjs/common';
import { City } from './city.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CitiesService {
  private cities: City[];

  constructor() {
    this.loadCitiesDataFromFile();
  }

  private loadCitiesDataFromFile() {
    try {
      const filePath = path.join(__dirname, '..', 'data', 'cities.json');
      const citiesData = fs.readFileSync(filePath, 'utf-8');
      this.cities = JSON.parse(citiesData);
    } catch (error) {
      console.error('Error loading cities data:', error);
      this.cities = []; 
    }
  }

  getCitiesMatchingQuery(query: string): City[] {
    return this.cities.filter((city) => city.cityName.toLowerCase().startsWith(query.toLowerCase()));
  }

  paginateCities(query: string, page: number, pageSize: number): City[] {
    const filteredCities = this.getCitiesMatchingQuery(query);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredCities.slice(startIndex, endIndex);
  }
}
