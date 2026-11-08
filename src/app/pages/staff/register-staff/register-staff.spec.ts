import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StaffCreate } from './register-staff';

describe('StaffCreate', () => {
  let component: StaffCreate;
  let fixture: ComponentFixture<StaffCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(StaffCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
