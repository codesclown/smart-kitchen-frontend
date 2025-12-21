'use client';

import { useQuery, useMutation } from '@apollo/client';
import { 
  GET_INVENTORY_ITEMS, 
  GET_LOW_STOCK_ITEMS, 
  GET_EXPIRING_ITEMS 
} from '@/lib/graphql/queries';
import { 
  CREATE_INVENTORY_ITEM_MUTATION, 
  UPDATE_INVENTORY_ITEM_MUTATION, 
  DELETE_INVENTORY_ITEM_MUTATION,
  CREATE_INVENTORY_BATCH_MUTATION,
  UPDATE_INVENTORY_BATCH_MUTATION,
  DELETE_INVENTORY_BATCH_MUTATION,
  BULK_CREATE_INVENTORY_ITEMS_MUTATION
} from '@/lib/graphql/mutations';
import { useCurrentKitchen } from './use-kitchen';

export function useInventory() {
  const kitchenId = useCurrentKitchen();

  const { 
    data, 
    loading, 
    error, 
    refetch 
  } = useQuery(GET_INVENTORY_ITEMS, {
    variables: { kitchenId: kitchenId || '' },
    skip: !kitchenId,
    errorPolicy: 'all',
  });

  const { 
    data: lowStockData, 
    loading: lowStockLoading 
  } = useQuery(GET_LOW_STOCK_ITEMS, {
    variables: { kitchenId: kitchenId || '' },
    skip: !kitchenId,
    errorPolicy: 'all',
  });

  const { 
    data: expiringData, 
    loading: expiringLoading 
  } = useQuery(GET_EXPIRING_ITEMS, {
    variables: { kitchenId: kitchenId || '', days: 7 },
    skip: !kitchenId,
    errorPolicy: 'all',
  });

  const [createItem] = useMutation(CREATE_INVENTORY_ITEM_MUTATION, {
    refetchQueries: [GET_INVENTORY_ITEMS, GET_LOW_STOCK_ITEMS, GET_EXPIRING_ITEMS],
  });

  const [updateItem] = useMutation(UPDATE_INVENTORY_ITEM_MUTATION, {
    refetchQueries: [GET_INVENTORY_ITEMS, GET_LOW_STOCK_ITEMS, GET_EXPIRING_ITEMS],
  });

  const [deleteItem] = useMutation(DELETE_INVENTORY_ITEM_MUTATION, {
    refetchQueries: [GET_INVENTORY_ITEMS, GET_LOW_STOCK_ITEMS, GET_EXPIRING_ITEMS],
  });

  const [createBatch] = useMutation(CREATE_INVENTORY_BATCH_MUTATION, {
    refetchQueries: [GET_INVENTORY_ITEMS],
  });

  const [updateBatch] = useMutation(UPDATE_INVENTORY_BATCH_MUTATION, {
    refetchQueries: [GET_INVENTORY_ITEMS],
  });

  const [deleteBatch] = useMutation(DELETE_INVENTORY_BATCH_MUTATION, {
    refetchQueries: [GET_INVENTORY_ITEMS],
  });

  const [bulkCreateItems] = useMutation(BULK_CREATE_INVENTORY_ITEMS_MUTATION, {
    refetchQueries: [GET_INVENTORY_ITEMS, GET_LOW_STOCK_ITEMS, GET_EXPIRING_ITEMS],
  });

  const items = data?.inventoryItems || [];
  const lowStockItems = lowStockData?.lowStockItems || [];
  const expiringItems = expiringData?.expiringItems || [];

  // Mock inventory data for development/testing
  const mockInventoryItems = [
    { 
      id: '1', 
      name: 'Paneer', 
      quantity: 250, 
      unit: 'g', 
      status: 'OK',
      expiry: '2024-12-30',
      location: 'Fridge',
      img: '🧀',
      qty: 250
    },
    { 
      id: '2', 
      name: 'Bell Peppers', 
      quantity: 3, 
      unit: 'pieces', 
      status: 'OK',
      expiry: '2024-12-25',
      location: 'Fridge',
      img: '🫑',
      qty: 3
    },
    { 
      id: '3', 
      name: 'Onion', 
      quantity: 5, 
      unit: 'pieces', 
      status: 'OK',
      expiry: '2025-01-15',
      location: 'Pantry',
      img: '🧅',
      qty: 5
    },
    { 
      id: '4', 
      name: 'Yogurt', 
      quantity: 500, 
      unit: 'ml', 
      status: 'OK',
      expiry: '2024-12-28',
      location: 'Fridge',
      img: '🥛',
      qty: 500
    },
    { 
      id: '5', 
      name: 'Garam Masala', 
      quantity: 100, 
      unit: 'g', 
      status: 'OK',
      expiry: '2025-06-01',
      location: 'Pantry',
      img: '🌶️',
      qty: 100
    },
    { 
      id: '6', 
      name: 'Basmati Rice', 
      quantity: 2, 
      unit: 'kg', 
      status: 'OK',
      expiry: '2025-03-01',
      location: 'Pantry',
      img: '🍚',
      qty: 2000
    },
    { 
      id: '7', 
      name: 'Tomatoes', 
      quantity: 8, 
      unit: 'pieces', 
      status: 'OK',
      expiry: '2024-12-26',
      location: 'Counter',
      img: '🍅',
      qty: 8
    },
    { 
      id: '8', 
      name: 'Oil', 
      quantity: 500, 
      unit: 'ml', 
      status: 'OK',
      expiry: '2025-08-01',
      location: 'Pantry',
      img: '🫒',
      qty: 500
    },
    { 
      id: '9', 
      name: 'Turmeric Powder', 
      quantity: 50, 
      unit: 'g', 
      status: 'OK',
      expiry: '2025-04-01',
      location: 'Pantry',
      img: '🟡',
      qty: 50
    },
    { 
      id: '10', 
      name: 'Cumin Seeds', 
      quantity: 100, 
      unit: 'g', 
      status: 'OK',
      expiry: '2025-05-01',
      location: 'Pantry',
      img: '🌰',
      qty: 100
    },
    { 
      id: '11', 
      name: 'Eggs', 
      quantity: 12, 
      unit: 'pieces', 
      status: 'OK',
      expiry: '2024-12-30',
      location: 'Fridge',
      img: '🥚',
      qty: 12
    },
    { 
      id: '12', 
      name: 'Green Chili', 
      quantity: 10, 
      unit: 'pieces', 
      status: 'OK',
      expiry: '2024-12-27',
      location: 'Fridge',
      img: '🌶️',
      qty: 10
    },
    { 
      id: '13', 
      name: 'Toor Dal', 
      quantity: 1, 
      unit: 'kg', 
      status: 'OK',
      expiry: '2025-02-01',
      location: 'Pantry',
      img: '🟡',
      qty: 1000
    },
    { 
      id: '14', 
      name: 'Ginger Garlic Paste', 
      quantity: 200, 
      unit: 'g', 
      status: 'OK',
      expiry: '2025-01-10',
      location: 'Fridge',
      img: '🧄',
      qty: 200
    },
    { 
      id: '15', 
      name: 'Mixed Vegetables', 
      quantity: 500, 
      unit: 'g', 
      status: 'OK',
      expiry: '2024-12-29',
      location: 'Freezer',
      img: '🥕',
      qty: 500
    },
    { 
      id: '16', 
      name: 'Garlic', 
      quantity: 200, 
      unit: 'g', 
      status: 'OK',
      expiry: '2025-01-20',
      location: 'Pantry',
      img: '🧄',
      qty: 200
    },
    { 
      id: '17', 
      name: 'Black Pepper', 
      quantity: 50, 
      unit: 'g', 
      status: 'OK',
      expiry: '2025-07-01',
      location: 'Pantry',
      img: '⚫',
      qty: 50
    },
    { 
      id: '18', 
      name: 'Potatoes', 
      quantity: 2, 
      unit: 'kg', 
      status: 'OK',
      expiry: '2025-01-05',
      location: 'Pantry',
      img: '🥔',
      qty: 2000
    },
    { 
      id: '19', 
      name: 'Cauliflower', 
      quantity: 1, 
      unit: 'pieces', 
      status: 'OK',
      expiry: '2024-12-31',
      location: 'Fridge',
      img: '🥬',
      qty: 1
    },
    { 
      id: '20', 
      name: 'Butter', 
      quantity: 200, 
      unit: 'g', 
      status: 'OK',
      expiry: '2025-01-15',
      location: 'Fridge',
      img: '🧈',
      qty: 200
    }
  ];

  // Use mock data if no real data is available
  const finalItems = items.length > 0 ? items : mockInventoryItems;

  // Helper functions
  const addItem = async (itemData: any) => {
    if (!kitchenId) throw new Error('No kitchen selected');
    
    return createItem({
      variables: {
        input: {
          ...itemData,
          kitchenId,
        },
      },
    });
  };

  const editItem = async (id: string, itemData: any) => {
    return updateItem({
      variables: {
        id,
        input: itemData,
      },
    });
  };

  const removeItem = async (id: string) => {
    return deleteItem({
      variables: { id },
    });
  };

  const addBatch = async (itemId: string, batchData: any) => {
    return createBatch({
      variables: {
        input: {
          itemId,
          ...batchData,
        },
      },
    });
  };

  const editBatch = async (id: string, batchData: any) => {
    return updateBatch({
      variables: {
        id,
        ...batchData,
      },
    });
  };

  const removeBatch = async (id: string) => {
    return deleteBatch({
      variables: { id },
    });
  };

  const bulkAdd = async (itemsData: any[]) => {
    if (!kitchenId) throw new Error('No kitchen selected');
    
    const itemsWithKitchen = itemsData.map(item => ({
      ...item,
      kitchenId,
    }));

    return bulkCreateItems({
      variables: {
        items: itemsWithKitchen,
      },
    });
  };

  return {
    // Data - use mock data if no real data available
    items: finalItems,
    lowStockItems,
    expiringItems,
    
    // Loading states
    loading: loading || lowStockLoading || expiringLoading,
    error,
    
    // Actions
    addItem,
    editItem,
    removeItem,
    addBatch,
    editBatch,
    removeBatch,
    bulkAdd,
    refetch,
    
    // Stats
    stats: {
      total: finalItems.length,
      lowStock: lowStockItems.length,
      expiring: expiringItems.length,
      ok: finalItems.filter((item: any) => item.status === 'OK').length,
    },
  };
}