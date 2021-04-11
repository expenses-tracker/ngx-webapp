 export const environment = {
    production: true,
    service: {
      domain: 'https://us-central1-expense-sheets-dev.cloudfunctions.net/appdev',
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
