export interface StoreSection {
  id: string;
  name: string;
  peopleCount: number;
  capacity: number;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  category: 'grocery' | 'produce' | 'frozen' | 'dairy' | 'electronics' | 'clothing' | 'pharmacy' | 'bakery' | 'home' | 'fashion' | 'lawn-garden' | 'auto' | 'vision' | 'jewelry' | 'seasonal';
  peoplePositions?: Array<{ x: number; y: number; id: string }>;
}

export interface TrolleyZone {
  id: string;
  name: string;
  totalTrolleys: number;
  availableTrolleys: number;
  location: string;
}

export interface BillingCounter {
  id: string;
  counterNumber: number;
  isActive: boolean;
  currentCustomers: number;
  averageWaitTime: number;
  status: 'open' | 'closed' | 'express';
}

export interface SeatingArea {
  id: string;
  name: string;
  totalSeats: number;
  occupiedSeats: number;
  location: string;
  type: 'food-court' | 'rest-area' | 'customer-service';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  barcode: string;
  category: string;
  image?: string;
}

// Generate random positions for people within sections
const generatePeoplePositions = (count: number, sectionWidth: number, sectionHeight: number) => {
  const positions = [];
  for (let i = 0; i < count; i++) {
    positions.push({
      id: `person-${i}`,
      x: Math.random() * (sectionWidth - 8) + 4,
      y: Math.random() * (sectionHeight - 8) + 4,
    });
  }
  return positions;
};

export const storeSections: StoreSection[] = [
  {
    id: '1',
    name: 'Grocery',
    peopleCount: 23,
    capacity: 40,
    coordinates: { x: 280, y: 40, width: 120, height: 80 },
    category: 'grocery',
    peoplePositions: generatePeoplePositions(23, 120, 80)
  },
  {
    id: '2',
    name: 'Bakery/Deli',
    peopleCount: 8,
    capacity: 20,
    coordinates: { x: 280, y: 140, width: 120, height: 60 },
    category: 'bakery',
    peoplePositions: generatePeoplePositions(8, 120, 60)
  },
  {
    id: '3',
    name: 'Seasonal',
    peopleCount: 12,
    capacity: 25,
    coordinates: { x: 280, y: 220, width: 60, height: 40 },
    category: 'seasonal',
    peoplePositions: generatePeoplePositions(12, 60, 40)
  },
  {
    id: '4',
    name: 'Jewelry',
    peopleCount: 3,
    capacity: 10,
    coordinates: { x: 200, y: 220, width: 60, height: 40 },
    category: 'jewelry',
    peoplePositions: generatePeoplePositions(3, 60, 40)
  },
  {
    id: '5',
    name: 'Gift Registry',
    peopleCount: 2,
    capacity: 8,
    coordinates: { x: 140, y: 220, width: 40, height: 40 },
    category: 'electronics',
    peoplePositions: generatePeoplePositions(2, 40, 40)
  },
  {
    id: '6',
    name: 'Pets',
    peopleCount: 6,
    capacity: 15,
    coordinates: { x: 200, y: 140, width: 60, height: 60 },
    category: 'grocery',
    peoplePositions: generatePeoplePositions(6, 60, 60)
  },
  {
    id: '7',
    name: 'Fashion',
    peopleCount: 18,
    capacity: 35,
    coordinates: { x: 80, y: 40, width: 100, height: 120 },
    category: 'fashion',
    peoplePositions: generatePeoplePositions(18, 100, 120)
  },
  {
    id: '8',
    name: 'Home',
    peopleCount: 14,
    capacity: 30,
    coordinates: { x: 200, y: 40, width: 60, height: 80 },
    category: 'home',
    peoplePositions: generatePeoplePositions(14, 60, 80)
  },
  {
    id: '9',
    name: 'Electronics',
    peopleCount: 9,
    capacity: 20,
    coordinates: { x: 140, y: 140, width: 40, height: 60 },
    category: 'electronics',
    peoplePositions: generatePeoplePositions(9, 40, 60)
  },
  {
    id: '10',
    name: 'Shoes',
    peopleCount: 7,
    capacity: 15,
    coordinates: { x: 120, y: 140, width: 20, height: 60 },
    category: 'clothing',
    peoplePositions: generatePeoplePositions(7, 20, 60)
  },
  {
    id: '11',
    name: 'Sporting Goods',
    peopleCount: 11,
    capacity: 25,
    coordinates: { x: 80, y: 180, width: 40, height: 80 },
    category: 'clothing',
    peoplePositions: generatePeoplePositions(11, 40, 80)
  },
  {
    id: '12',
    name: 'Lawn & Garden',
    peopleCount: 5,
    capacity: 20,
    coordinates: { x: 20, y: 40, width: 40, height: 220 },
    category: 'lawn-garden',
    peoplePositions: generatePeoplePositions(5, 40, 220)
  },
  {
    id: '13',
    name: 'Pharmacy',
    peopleCount: 4,
    capacity: 12,
    coordinates: { x: 80, y: 20, width: 60, height: 20 },
    category: 'pharmacy',
    peoplePositions: generatePeoplePositions(4, 60, 20)
  },
  {
    id: '14',
    name: 'Vision Center',
    peopleCount: 2,
    capacity: 8,
    coordinates: { x: 160, y: 20, width: 40, height: 20 },
    category: 'pharmacy',
    peoplePositions: generatePeoplePositions(2, 40, 20)
  },
  {
    id: '15',
    name: 'Dary',
    peopleCount: 15,
    capacity: 25,
    coordinates: { x: 420, y: 40, width: 40, height: 80 },
    category: 'dairy',
    peoplePositions: generatePeoplePositions(15, 40, 80)
  },
  {
    id: '16',
    name: 'Frozen',
    peopleCount: 10,
    capacity: 20,
    coordinates: { x: 420, y: 140, width: 40, height: 60 },
    category: 'frozen',
    peoplePositions: generatePeoplePositions(10, 40, 60)
  },
  {
    id: '17',
    name: 'Produce',
    peopleCount: 19,
    capacity: 30,
    coordinates: { x: 420, y: 220, width: 40, height: 40 },
    category: 'produce',
    peoplePositions: generatePeoplePositions(19, 40, 40)
  }
];

export const trolleyZones: TrolleyZone[] = [
  {
    id: '1',
    name: 'Main Entrance',
    totalTrolleys: 50,
    availableTrolleys: 34,
    location: 'Front entrance near customer service'
  },
  {
    id: '2',
    name: 'Grocery Section',
    totalTrolleys: 30,
    availableTrolleys: 12,
    location: 'Between aisles 1 and 2'
  },
  {
    id: '3',
    name: 'Parking Lot',
    totalTrolleys: 25,
    availableTrolleys: 18,
    location: 'Outdoor trolley collection point'
  }
];

export const billingCounters: BillingCounter[] = [
  {
    id: '1',
    counterNumber: 1,
    isActive: true,
    currentCustomers: 3,
    averageWaitTime: 8,
    status: 'open'
  },
  {
    id: '2',
    counterNumber: 2,
    isActive: true,
    currentCustomers: 5,
    averageWaitTime: 12,
    status: 'open'
  },
  {
    id: '3',
    counterNumber: 3,
    isActive: true,
    currentCustomers: 2,
    averageWaitTime: 5,
    status: 'express'
  },
  {
    id: '4',
    counterNumber: 4,
    isActive: false,
    currentCustomers: 0,
    averageWaitTime: 0,
    status: 'closed'
  },
  {
    id: '5',
    counterNumber: 5,
    isActive: true,
    currentCustomers: 4,
    averageWaitTime: 10,
    status: 'open'
  },
  {
    id: '6',
    counterNumber: 6,
    isActive: true,
    currentCustomers: 1,
    averageWaitTime: 3,
    status: 'express'
  }
];

export const seatingAreas: SeatingArea[] = [
  {
    id: '1',
    name: 'Food Court',
    totalSeats: 48,
    occupiedSeats: 32,
    location: 'Near the café and restaurant area',
    type: 'food-court'
  },
  {
    id: '2',
    name: 'Customer Service Area',
    totalSeats: 12,
    occupiedSeats: 5,
    location: 'Next to customer service desk',
    type: 'customer-service'
  },
  {
    id: '3',
    name: 'Rest Area',
    totalSeats: 16,
    occupiedSeats: 8,
    location: 'Central corridor near restrooms',
    type: 'rest-area'
  }
];

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Coca-Cola 12 Pack',
    price: 5.99,
    barcode: '049000028911',
    category: 'Beverages',
    image: 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg'
  },
  {
    id: '2',
    name: 'Wonder Bread',
    price: 2.49,
    barcode: '072250007504',
    category: 'Bakery',
    image: 'https://images.pexels.com/photos/209206/pexels-photo-209206.jpeg'
  },
  {
    id: '3',
    name: 'Bananas (per lb)',
    price: 0.68,
    barcode: '4011',
    category: 'Produce',
    image: 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg'
  },
  {
    id: '4',
    name: 'Milk Gallon',
    price: 3.78,
    barcode: '011110421234',
    category: 'Dairy',
    image: 'https://images.pexels.com/photos/236010/pexels-photo-236010.jpeg'
  },
  {
    id: '5',
    name: 'Tide Laundry Detergent',
    price: 12.97,
    barcode: '037000127895',
    category: 'Household',
    image: 'https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg'
  }
];

export const getCrowdLevel = (peopleCount: number, capacity: number): 'low' | 'medium' | 'high' | 'critical' => {
  const percentage = (peopleCount / capacity) * 100;
  if (percentage < 30) return 'low';
  if (percentage < 60) return 'medium';
  if (percentage < 85) return 'high';
  return 'critical';
};

export const getCrowdColor = (level: 'low' | 'medium' | 'high' | 'critical'): string => {
  switch (level) {
    case 'low': return '#10b981';
    case 'medium': return '#f59e0b';
    case 'high': return '#ea580c';
    case 'critical': return '#dc2626';
  }
};

export const getCrowdColorWithOpacity = (level: 'low' | 'medium' | 'high' | 'critical', opacity: number = 0.8): string => {
  switch (level) {
    case 'low': return `rgba(16, 185, 129, ${opacity})`;
    case 'medium': return `rgba(245, 158, 11, ${opacity})`;
    case 'high': return `rgba(234, 88, 12, ${opacity})`;
    case 'critical': return `rgba(220, 38, 38, ${opacity})`;
  }
};