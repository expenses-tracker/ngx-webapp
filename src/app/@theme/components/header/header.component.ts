import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
  NbDialogService,
  NbSearchService } from '@nebular/theme';

import { LayoutService } from '../../../@core/utils';
import { map, takeUntil, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { ProfileComponent } from 'app/pages/profile/profile.component';
import { UserDetailService } from 'app/@core/services/user-detail.service';
import { ExportComponent } from 'app/pages/export/export.component';
import { SearchComponent } from 'app/pages/search/search.component';
import { SearchService } from 'app/@core/services/search.service';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;
  filterBadge: string;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
  ];

  currentTheme = 'default';

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserDetailService,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    private router: Router,
    private dialogService: NbDialogService,
    private nbSearchService: NbSearchService,
    private searchService: SearchService) {
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.userService.fetchUserDetail()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => {
        this.user = users;
      });

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

    this.handleContextMenuClick();
    this.onSearchSubmit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  handleContextMenuClick() {
    this.menuService.onItemClick()
      .pipe(
        filter(({ tag }) => tag === 'header-user-context-menu'),
        map(({ item: { title } }) => title),
      )
      .subscribe(title => {
        switch (title) {
          case 'Profile':
            this.showProfile();
            break;
          case 'Log out':
            this.userService.logout().subscribe(() => {
              this.router.navigate(['auth/logout']);
            });
            break;
          default:
            break;
        }
      });
  }

  showProfile() {
    this.dialogService.open(ProfileComponent, {
      context: {
        user$: this.userService.fetchUserDetail()
      }
    });
  }

  exportDialog() {
    this.dialogService.open(ExportComponent);
  }

  applySearchFilters() {
    const dialogRef = this.dialogService.open(SearchComponent);
    dialogRef.onClose.subscribe(() => {
      const filtersApplied = this.searchService.getFilter();
      const filterValues = [];
      Object.values(filtersApplied).forEach((val) => {
        if (val && String(val).length > 0) filterValues.push(val);
      });
      this.filterBadge = filterValues.length > 0 ? String(filterValues.length) : this.filterBadge;
    });
  }

  onSearchSubmit() {
    this.nbSearchService.onSearchSubmit()
      .subscribe((data: any) => {
        const filters = this.searchService.getFilter();
        let filterToApply;
        if (filters) {
          filterToApply = filters;
          filterToApply.searchString = data.term;
        } else {
          filterToApply = { searchString: data.term, type: 'expenses' };
        }
        this.searchService.setFilter(filterToApply);
        this.router.navigate(['/pages/search/results']);
      });
  }
}
