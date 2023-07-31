import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';




interface City {
  uuid: string;
  cityName: string;
  count: number;
}


@Component({
  selector: 'app-city-search',
  templateUrl: './city-search.component.html',
  styleUrls: ['./city-search.component.css']
})

export class CitySearchComponent {
  searchInput: string = '';
  searchResults: City[] = [];
  searchNoResults: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  errorMessage: string='';

  currentItemsPerPage: number = this.itemsPerPage;

  searchForm: FormGroup;

  @ViewChild('cityInput', { static: true })
  cityInputRef!: ElementRef<HTMLInputElement>;

  constructor(private http: HttpClient, private fb: FormBuilder) {

    this.searchForm = this.fb.group({
      city: ['', Validators.pattern('^[a-zA-Z]+$')]
    });
  }

  searchCities(): void {
    if (this.searchForm.valid) {
      this.searchInput = this.searchForm.get('city')?.value;
    if (!this.searchInput || this.searchInput.trim().length === 0) {
      // Handle invalid or missing query
      this.searchResults = [];
      this.searchNoResults = false;
      return;
    }

    if (this.searchInput.trim().length > 0) {
      const apiUrl = `http://localhost:3000/cities?q=${this.searchInput}&page=${this.currentPage}&pageSize=${this.itemsPerPage}`;
      this.http.get<City[]>(apiUrl).subscribe(
        (data: City[]) => {
          console.log('API Response:', data);

          if (data.length === 0) {
            this.searchResults = [];
            this.searchNoResults = true;
          } else {
            this.searchResults = data;
            this.searchNoResults = false;
          }
        },
        (error: HttpErrorResponse) => {
          console.error('API Error:', error);
          this.handleApiError(error);
        }
      );
    } else {
      this.clearSearchInput();
    }
  }
}

  handleApiError(error: HttpErrorResponse): void {
    if (error.status === 400) {
     this.errorMessage = 'Invalid request. Please check your input.';
    } else if (error.status === 404) {
      this.errorMessage = 'Data not found. Please try a different search.';
    } else if (error.status === 500) {
     this.errorMessage = 'An error occurred. Please try again later.';
    } else {
      this.errorMessage = 'An unknown error occurred. Please try again later.';
    }
  }

  clearSearchInput(): void {
    this.searchInput = '';
    this.searchResults = [];
    this.searchNoResults = false;
    this.currentPage = 1;
  }

  getFirstCityIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  getLastCityIndex(): number {
    const lastIndex = this.currentPage * this.itemsPerPage;
    return Math.min(lastIndex, this.searchResults.length);
  }

  onPageChange(newPage: number): void {
    this.currentPage = newPage;
    this.searchCities();
  }
  getTotalPages(): number {
    return Math.ceil(this.searchResults.length / this.itemsPerPage);
  }
  getPages(): number[] {
    const totalPages = this.getTotalPages();
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    // Check if the pressed key is the backspace key (keyCode: 8)
    if (event.keyCode === 8) {
      this.clearSearchInput();
    }
  }


}
