import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CitySearchComponent } from './city-search.component';
import { of } from 'rxjs';

const mockCitiesService = {
  getCitiesMatchingQuery: jasmine.createSpy('getCitiesMatchingQuery').and.returnValue(of([])),
  paginateCities: jasmine.createSpy('paginateCities').and.returnValue(of([])),
};

describe('CitySearchComponent', () => {
  let component: CitySearchComponent;
  let fixture: ComponentFixture<CitySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      declarations: [CitySearchComponent],
      providers: [
        FormBuilder,
        { provide: mockCitiesService, useValue: mockCitiesService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CitySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.searchForm.value).toEqual({ query: '' });
  });

  it('should call getCitiesMatchingQuery when form value changes', () => {
    component.searchForm.patchValue({ query: 'New York' });
    fixture.detectChanges();
    expect(mockCitiesService.getCitiesMatchingQuery).toHaveBeenCalledWith('New York');
  });

  it('should display matching cities returned from the service', () => {
    const cities = [
      { name: 'New York', country: 'United States' },
      { name: 'London', country: 'United Kingdom' },
    ];
    mockCitiesService.getCitiesMatchingQuery.and.returnValue(of(cities));
    component.searchForm.patchValue({ query: 'New' });
    fixture.detectChanges();
    const displayedCities = fixture.nativeElement.querySelectorAll('.city-item');
    expect(displayedCities.length).toBe(cities.length);
    expect(displayedCities[0].textContent).toContain(cities[0].name);
    expect(displayedCities[1].textContent).toContain(cities[1].name);
  });
});
