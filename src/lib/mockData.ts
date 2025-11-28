import { Restaurant } from '../types';

export const restaurants: Restaurant[] = [
  {
    id: 'r1',
    slug: 'pizzeria-da-toni',
    name: "Pizzeria da Toni",
    description: "Vera pizza napoletana fatta con passione.",
    cuisineType: "Italiana • Pizza",
    rating: 4.8,
    deliveryTimeRange: "20-30 min",
    deliveryFee: 0,
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?q=80&w=1000&auto=format&fit=crop",
    address: "Via Napoli 12, Roma",
    categories: [
      { id: 'c1', name: 'Pizze Classiche', slug: 'classic' },
      { id: 'c2', name: 'Pizze Speciali', slug: 'specialty' },
      { id: 'c3', name: 'Bibite', slug: 'drinks' },
    ],
    menu: [
      { id: 'm1', categoryId: 'c1', name: 'Margherita', description: 'Pomodoro San Marzano, mozzarella fior di latte, basilico fresco.', price: 8.5, imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80", tags: ['Vegetariana'] },
      { id: 'm2', categoryId: 'c1', name: 'Diavola', description: 'Pomodoro, mozzarella, salame piccante Napoli.', price: 10, imageUrl: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80" },
      { id: 'm3', categoryId: 'c2', name: 'Tartufata', description: 'Base bianca, funghi misti, olio al tartufo, scaglie di parmigiano.', price: 14, imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80", tags: ['Vegetariana', 'Popolare'] },
      { id: 'm4', categoryId: 'c3', name: 'Coca Cola', description: 'Lattina 330ml', price: 2.5 },
      { id: 'm5', categoryId: 'c3', name: 'Limonata Artigianale', description: 'Fatta in casa con limoni di Sorrento', price: 4 },
    ]
  },
  {
    id: 'r2',
    slug: 'burger-king-of-grill',
    name: "King of Grill",
    description: "Smashed burgers succosi e patatine croccanti.",
    cuisineType: "Americana • Hamburger",
    rating: 4.5,
    deliveryTimeRange: "15-25 min",
    deliveryFee: 2.99,
    imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop",
    address: "Viale America 45, Milano",
    categories: [
      { id: 'c4', name: 'Hamburger', slug: 'burgers' },
      { id: 'c5', name: 'Contorni', slug: 'sides' },
      { id: 'c6', name: 'Frullati', slug: 'shakes' },
    ],
    menu: [
      { id: 'm6', categoryId: 'c4', name: 'Classic Smash', description: 'Doppio manzo, formaggio americano, cetriolini, salsa segreta.', price: 12, imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80", tags: ['Popolare'] },
      { id: 'm7', categoryId: 'c4', name: 'Bacon Deluxe', description: 'Doppio manzo, bacon croccante, salsa BBQ, anelli di cipolla.', price: 14, imageUrl: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&q=80" },
      { id: 'm8', categoryId: 'c5', name: 'Patatine Fritte', description: 'Taglio rustico, doppia frittura.', price: 5, imageUrl: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500&q=80", tags: ['Vegana'] },
      { id: 'm9', categoryId: 'c6', name: 'Frullato Vaniglia', description: 'Con vera bacca di vaniglia.', price: 6 },
    ]
  },
  {
    id: 'r3',
    slug: 'sushi-zen',
    name: "Sushi Zen",
    description: "Pesce fresco selezionato e roll delicati.",
    cuisineType: "Giapponese • Sushi",
    rating: 4.9,
    deliveryTimeRange: "30-45 min",
    deliveryFee: 1.99,
    imageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=1000&auto=format&fit=crop",
    address: "Corso Italia 88, Torino",
    categories: [
      { id: 'c7', name: 'Nigiri', slug: 'nigiri' },
      { id: 'c8', name: 'Uramaki', slug: 'rolls' },
    ],
    menu: [
      { id: 'm10', categoryId: 'c7', name: 'Nigiri Salmone', description: '2 pezzi salmone norvegese.', price: 5, imageUrl: "https://images.unsplash.com/photo-1633478062482-790e3b5dd810?w=500&q=80" },
      { id: 'm11', categoryId: 'c7', name: 'Nigiri Tonno', description: '2 pezzi tonno rosso.', price: 6, imageUrl: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500&q=80" },
      { id: 'm12', categoryId: 'c8', name: 'Dragon Roll', description: 'Gambero tempura, avocado, salsa anguilla.', price: 15, imageUrl: "https://images.unsplash.com/photo-1617196019294-dc44df5b1e6b?w=500&q=80", tags: ['Popolare'] },
      { id: 'm13', categoryId: 'c8', name: 'Spicy Tuna', description: 'Tartare di tonno, maionese piccante, cetriolo.', price: 12, tags: ['Piccante'] },
    ]
  }
];