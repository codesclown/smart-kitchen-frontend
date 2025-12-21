'use client';

import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_EXPENSES, 
  GET_EXPENSE_STATS 
} from '@/lib/graphql/queries';
import { 
  CREATE_EXPENSE_MUTATION, 
  UPDATE_EXPENSE_MUTATION, 
  DELETE_EXPENSE_MUTATION 
} from '@/lib/graphql/mutations';
import { useCurrentKitchen } from './use-kitchen';

export function useExpenses(limit = 50) {
  const kitchenId = useCurrentKitchen();

  const { 
    data, 
    loading, 
    error, 
    refetch 
  } = useQuery(GET_EXPENSES, {
    variables: { kitchenId: kitchenId || '', limit },
    skip: !kitchenId,
    errorPolicy: 'all',
  });

  const { 
    data: statsData, 
    loading: statsLoading 
  } = useQuery(GET_EXPENSE_STATS, {
    variables: { kitchenId: kitchenId || '', period: 'month' },
    skip: !kitchenId,
    errorPolicy: 'all',
  });

  const [createExpense] = useMutation(CREATE_EXPENSE_MUTATION, {
    refetchQueries: [GET_EXPENSES, GET_EXPENSE_STATS],
  });

  const [updateExpense] = useMutation(UPDATE_EXPENSE_MUTATION, {
    refetchQueries: [GET_EXPENSES, GET_EXPENSE_STATS],
  });

  const [deleteExpense] = useMutation(DELETE_EXPENSE_MUTATION, {
    refetchQueries: [GET_EXPENSES, GET_EXPENSE_STATS],
  });

  const expenses = data?.expenses || [];
  const stats = statsData?.expenseStats || {};

  // Helper functions
  const addExpense = async (expenseData: any) => {
    if (!kitchenId) throw new Error('No kitchen selected');
    
    return createExpense({
      variables: {
        input: {
          ...expenseData,
          kitchenId,
        },
      },
    });
  };

  const editExpense = async (id: string, expenseData: any) => {
    return updateExpense({
      variables: {
        id,
        ...expenseData,
      },
    });
  };

  const removeExpense = async (id: string) => {
    return deleteExpense({
      variables: { id },
    });
  };

  // Calculate stats from expenses if API stats not available
  const calculatedStats = {
    total: expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0),
    ration: expenses
      .filter((e: any) => e.type === 'GROCERY')
      .reduce((sum: number, e: any) => sum + e.amount, 0),
    foodOrder: expenses
      .filter((e: any) => e.type === 'FOOD_ORDER')
      .reduce((sum: number, e: any) => sum + e.amount, 0),
    avgDaily: expenses.length > 0 ? 
      expenses.reduce((sum: number, exp: any) => sum + exp.amount, 0) / 30 : 0,
  };

  return {
    // Data
    expenses,
    stats: Object.keys(stats).length > 0 ? stats : calculatedStats,
    
    // Loading states
    loading: loading || statsLoading,
    error,
    
    // Actions
    addExpense,
    editExpense,
    removeExpense,
    refetch,
  };
}