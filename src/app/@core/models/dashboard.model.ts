import { Expense, ExpenseChart } from '../data/expense';
import { Income, IncomeChart } from '../data/income';

export interface DashboardData {
    expenses: Expenses;
    incomes: Incomes;
}

export interface Expenses {
    entries: Expense[];
    chart: ExpenseChart[];
}

export interface Incomes {
    entries: Income[];
    chart: IncomeChart[];
}
