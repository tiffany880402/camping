import { CampingTrip } from './types';

export const MOCK_TRIPS: CampingTrip[] = [
  {
    id: '1',
    name: '星空森林營地',
    date: '2024-03-15',
    location: {
      name: '新竹縣五峰鄉',
      city: '新竹',
      lat: 24.6,
      lng: 121.1,
    },
    photos: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&q=80&w=800'
    ],
    expenses: [
      { id: 'e1', name: '營地費', amount: 1500 },
      { id: 'e2', name: '食材', amount: 1200 },
      { id: 'e3', name: '雜費', amount: 300 }
    ],
    notes: '雲海非常漂亮，營主很熱心。',
    rating: 5,
    weather: '晴朗',
    pros: ['景色絕佳', '營主人很好'],
    cons: ['路況稍險'],
    gearList: [
      { id: 'g1', name: 'Snow Peak 帳篷 SA-604', assignee: '小明', isCompleted: true },
      { id: 'g2', name: 'Coleman 氣化燈', assignee: '小華', isCompleted: true }
    ],
    shoppingList: [
      { id: 's1', name: '輕量化地布', buyer: '小明', category: '裝備', isPurchased: true },
      { id: 's2', name: '鈦合金杯組', buyer: '小華', category: '餐具', isPurchased: false }
    ]
  },
  {
    id: '2',
    name: '溪畔悠遊營地',
    date: '2024-04-02',
    location: {
      name: '南投縣仁愛鄉',
      city: '南投',
    },
    photos: [
      'https://images.unsplash.com/photo-1537905569824-f89f14cceb68?auto=format&fit=crop&q=80&w=800'
    ],
    expenses: [
      { id: 'e4', name: '營地費', amount: 1200 },
      { id: 'e5', name: '食材', amount: 1500 },
      { id: 'e6', name: '雜費', amount: 500 }
    ],
    notes: '溪水很乾淨，可以玩水。',
    rating: 4,
    weather: '多雲',
    gearList: [
      { id: 'g3', name: 'Helinox 戰術椅', assignee: '小明', isCompleted: true }
    ],
    shoppingList: [
      { id: 's3', name: '防滑排水鞋', buyer: '小華', category: '衣物', isPurchased: false }
    ]
  }
];
