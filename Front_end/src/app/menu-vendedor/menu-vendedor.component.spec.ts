import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuVendedorComponent } from './menu-vendedor.component';

describe('MenuVendedorComponent', () => {
  let component: MenuVendedorComponent;
  let fixture: ComponentFixture<MenuVendedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuVendedorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuVendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
