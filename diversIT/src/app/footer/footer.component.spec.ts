import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterComponent } from './footer.component';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooterComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should render heading 'DiversIT' with link`, () => {
    const heading = compiled.querySelector('h3 a');
    expect(heading.textContent).toBe('DiversIT');
    expect(heading.getAttribute('routerlink')).toBe('/');
  });

  it('should render imprint and privacy links', () => {
    const links = compiled.querySelectorAll('li a');
    expect(links).toHaveSize(2);
    expect(links.item(0).textContent).toBe('Impressum');
    expect(links.item(1).textContent).toBe('Datenschutz');

    expect(links.item(0).getAttribute('routerlink')).toBe('/impressum');
    expect(links.item(1).getAttribute('routerlink')).toBe('/datenschutz');
  });

  it('should render copyright text with icon', () => {
    const copyright = compiled.querySelector('p');
    expect(copyright.textContent).toContain('Copyright');
    expect(copyright.textContent).toContain('2021 Alle Rechte vorbehalten.');

    const copyrightIcon = copyright.querySelector('i');
    expect(copyrightIcon).toBeTruthy();
    expect(copyrightIcon.classList).toContain('far');
    expect(copyrightIcon.classList).toContain('fa-copyright');
  });

  it('should render scroll to top button element', () => {
    expect(compiled.querySelector('ngx-scrolltop')).toBeTruthy();
  });
});
