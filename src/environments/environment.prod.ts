/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {
  production: true,
  service: {
    domain: 'https://us-central1-com-varnit-expense-sheet.cloudfunctions.net/app',
    endpoints: {
      login: '/users/login',
      register: '/users/register',
      logout: '/users/logout',
      user: '/users/',
      dashboard: '/dashboard/',
      categoryService: '/categories/',
      paymentTypesService: '/paymentTypes/',
      incomeService: '/incomes/',
      expenseService: '/expenses/',
      monthlyExpense: '/expenses/monthYear',
      monthlyIncome: '/incomes/monthYear',
      monthlyCategoryExpense: '/expenses/categories',
      monthlyPaymentTypeExpense: '/expenses/paymentTypes',
      dateRange: 'dateRange',
      search: '/search',
    },
  },
};
