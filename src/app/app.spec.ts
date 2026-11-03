import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)]
    }).compileComponents();
  });

  it('renders the application shell', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Clash Village Tracker');
  });
});
