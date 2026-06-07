export interface ProductItem {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
}

export interface OrderItem {
  id: string;
  customer: string;
  total: number;
  status: string;
}

export const mockProducts: ProductItem[] = [
  { id: 1, name: 'Wireless Headphones', category: 'Audio', price: 49.99, stock: 18, status: 'Active' },
  { id: 2, name: 'Smart Watch', category: 'Wearables', price: 89.99, stock: 12, status: 'Active' },
  { id: 3, name: 'Laptop Stand', category: 'Accessories', price: 29.5, stock: 25, status: 'Featured' },
  { id: 4, name: 'Gaming Mouse', category: 'Gaming', price: 34.99, stock: 10, status: 'Active' },
  { id: 5, name: 'Bluetooth Speaker', category: 'Audio', price: 59.99, stock: 14, status: 'Featured' },
  { id: 6, name: 'USB-C Charger', category: 'Accessories', price: 19.99, stock: 30, status: 'Active' },
  { id: 7, name: 'Fitness Band', category: 'Wearables', price: 39.99, stock: 22, status: 'Active' },
  { id: 8, name: 'Mechanical Keyboard', category: 'Gaming', price: 79.99, stock: 8, status: 'Featured' },
  { id: 9, name: 'Travel Backpack', category: 'Lifestyle', price: 45.0, stock: 16, status: 'Active' },
  { id: 10, name: 'LED Desk Lamp', category: 'Home', price: 24.5, stock: 20, status: 'Active' },
  { id: 11, name: 'Portable SSD', category: 'Storage', price: 99.99, stock: 5, status: 'Featured' },
  { id: 12, name: 'Air Purifier', category: 'Home', price: 69.0, stock: 7, status: 'Active' },
];

export const mockOrders: OrderItem[] = [
  { id: 'ORD-1001', customer: 'Nimal', total: 129.98, status: 'Paid' },
  { id: 'ORD-1002', customer: 'Kavindu', total: 89.99, status: 'Processing' },
  { id: 'ORD-1003', customer: 'Sahan', total: 59.99, status: 'Paid' },
];
