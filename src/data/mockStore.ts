export interface ProductItem {
  id: number;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  status: string;
  imageUrl: string;
}

export interface OrderItem {
  id: string;
  customer: string;
  total: number;
  status: string;
}

export const mockProducts: ProductItem[] = [
  // Best Selling Products
  { id: 1, name: 'Daawat Rozana Basmati Rice', brand: 'Daawat', category: 'Best Selling Products', description: 'Premium quality basmati rice with rich aroma and fluffy texture.', price: 499, stock: 50, status: 'Active', imageUrl: 'https://via.placeholder.com/150/e2e8f0/475569?text=Rice' },
  { id: 2, name: 'Aashirvaad Select Atta', brand: 'Aashirvaad', category: 'Best Selling Products', description: '100% MP Sharbati atta for soft rotis and healthier meals.', price: 199, stock: 100, status: 'Active', imageUrl: 'https://via.placeholder.com/150/e2e8f0/475569?text=Atta' },
  { id: 3, name: 'Tata Tea Agni', brand: 'Tata', category: 'Best Selling Products', description: 'Strong and refreshing tea for a perfect start of the day.', price: 149, stock: 60, status: 'Active', imageUrl: 'https://via.placeholder.com/150/e2e8f0/475569?text=Tea' },
  { id: 4, name: 'Fortune Sunlite Oil', brand: 'Fortune', category: 'Best Selling Products', description: 'Light and healthy sunflower oil for everyday cooking.', price: 249, stock: 80, status: 'Active', imageUrl: 'https://via.placeholder.com/150/e2e8f0/475569?text=Oil' },
  
  // Grocery Essentials
  { id: 5, name: 'Sunfeast Marie Biscuit', brand: 'Sunfeast', category: 'Grocery Essentials', description: 'Crispy and light biscuits perfect for tea time.', price: 30, stock: 200, status: 'Active', imageUrl: 'https://via.placeholder.com/150/e2e8f0/475569?text=Biscuit' },
  { id: 6, name: 'Tata Salt', brand: 'Tata', category: 'Grocery Essentials', description: 'Vacuum evaporated iodized salt for healthy living.', price: 25, stock: 150, status: 'Active', imageUrl: 'https://via.placeholder.com/150/e2e8f0/475569?text=Salt' },
  { id: 7, name: 'Maggi 2-Minute Noodles', brand: 'Maggi', category: 'Grocery Essentials', description: 'Delicious and easy noodles ready in just 2 minutes.', price: 14, stock: 300, status: 'Active', imageUrl: 'https://via.placeholder.com/150/e2e8f0/475569?text=Maggi' },
  { id: 8, name: 'Bru Instant Coffee', brand: 'Bru', category: 'Grocery Essentials', description: 'Rich aroma and strong taste for a perfect coffee break.', price: 120, stock: 90, status: 'Active', imageUrl: 'https://via.placeholder.com/150/e2e8f0/475569?text=Coffee' },
  
  // Personal Care & Home Care
  { id: 9, name: 'Dove Soap', brand: 'Dove', category: 'Personal Care & Home Care', description: 'Gentle care for soft and healthy skin.', price: 45, stock: 120, status: 'Active', imageUrl: 'https://via.placeholder.com/150/e2e8f0/475569?text=Soap' },
  { id: 10, name: 'Harpic Power Plus', brand: 'Harpic', category: 'Personal Care & Home Care', description: '10x better cleaning for a hygienic home.', price: 85, stock: 85, status: 'Active', imageUrl: 'https://via.placeholder.com/150/e2e8f0/475569?text=Cleaner' },
  { id: 11, name: 'Surf Excel Matic', brand: 'Surf Excel', category: 'Personal Care & Home Care', description: 'Top load liquid for superior stain removal.', price: 190, stock: 40, status: 'Active', imageUrl: 'https://via.placeholder.com/150/e2e8f0/475569?text=Detergent' },
  { id: 12, name: 'Vim Dishwash Gel', brand: 'Vim', category: 'Personal Care & Home Care', description: 'Tough on grease, soft on hands.', price: 55, stock: 110, status: 'Active', imageUrl: 'https://via.placeholder.com/150/e2e8f0/475569?text=Dishwash' },
];

export const mockOrders: OrderItem[] = [
  { id: 'ORD-1001', customer: 'Nimal', total: 129.98, status: 'Paid' },
  { id: 'ORD-1002', customer: 'Kavindu', total: 89.99, status: 'Processing' },
  { id: 'ORD-1003', customer: 'Sahan', total: 59.99, status: 'Paid' },
];
