export const environment = {
    production: false,
    service: {
      domain: 'http://localhost:3000',
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
