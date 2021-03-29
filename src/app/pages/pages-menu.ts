import { NbMenuItem } from '@nebular/theme';

export const EXPENSES_MENU_ITEMS: NbMenuItem[] = [
    {
      title: 'Dashboard',
      icon: 'browser-outline',
      link: '/pages/dashboard',
      home: true,
    },
    {
      title: 'Transactions',
      group: true,
    },
    {
      title: 'Expenses',
      icon: 'minus-outline',
      link: '/pages/transactions/expenses',
    },
    {
      title: 'Incomes',
      icon: 'plus-outline',
      link: '/pages/transactions/incomes',
    },
    {
      title: 'Categories',
      icon: 'layers-outline',
      link: '/pages/categories',
    },
    {
      title: 'Payment Types',
      icon: 'briefcase-outline',
      link: '/pages/payment-types',
    },
];
