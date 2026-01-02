
import { User, PlanType, Generation, PaymentMethod } from '../types';

// STORAGE KEYS
const DB_KEYS = {
  USERS: 'cinexa_db_users',
  GENERATIONS: 'cinexa_db_generations',
  PAYMENTS: 'cinexa_db_payments'
};

// INITIAL MOCK DATA (Defaults if storage is empty)
const DEFAULT_USERS: User[] = [
  {
    id: 'admin_1',
    email: 'joaodasilvangola03@gmail.com',
    name: 'João Da Silva Ngola',
    plan: PlanType.PREMIUM,
    credits: 999999,
    isAdmin: true,
    isActive: true,
    avatarUrl: 'https://picsum.photos/200'
  }
];

const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  { 
    id: 'card', 
    name: 'Cartão de Crédito/Débito', 
    detail: 'Visa, Mastercard, Amex', 
    icon: '💳',
    isActive: true,
    bankName: 'Stripe Secure',
    accountNumber: 'Automático',
    beneficiary: 'AIVision Inc.'
  },
  { 
    id: 'wise', 
    name: 'Wise (TransferWise)', 
    detail: 'Internacional (USD/EUR/GBP)', 
    icon: '🌏',
    isActive: true,
    bankName: 'Wise Payments',
    accountNumber: 'joaodasilvangola03@gmail.com',
    beneficiary: 'João da Silva Global'
  },
  { 
    id: 'multicaixa', 
    name: 'Multicaixa / BAI', 
    detail: 'Angola (Transferência IBAN)', 
    icon: '🇦🇴',
    isActive: true,
    bankName: 'Banco BAI',
    accountNumber: 'AO06.0040.0000.1234.5678.9012.3',
    beneficiary: 'João da Silva Angola'
  },
  { 
    id: 'bfa', 
    name: 'Banco BFA', 
    detail: 'Angola (Transferência IBAN)', 
    icon: '🇦🇴',
    isActive: true,
    bankName: 'Banco de Fomento Angola',
    accountNumber: 'AO06.0006.0000.8888.7777.6666.5',
    beneficiary: 'João da Silva Angola'
  },
  { 
    id: 'atlantico', 
    name: 'Banco Atlântico', 
    detail: 'Angola (Transferência IBAN)', 
    icon: '🇦🇴',
    isActive: true,
    bankName: 'Banco Millennium Atlântico',
    accountNumber: 'AO06.0055.0000.9999.8888.7777.1',
    beneficiary: 'João da Silva Angola'
  },
  { 
    id: 'pix', 
    name: 'Pix', 
    detail: 'Brasil (Pagamento Instantâneo)', 
    icon: '💠',
    isActive: true,
    bankName: 'Nubank',
    accountNumber: 'pix@aivision.com (Chave Email)',
    beneficiary: 'AIVision Latam'
  },
  { 
    id: 'paypal', 
    name: 'PayPal', 
    detail: 'Internacional / Saldo', 
    icon: '🅿️',
    isActive: true,
    bankName: 'PayPal',
    accountNumber: 'Netilson294@gmail.com',
    beneficiary: 'AIVision Admin'
  },
  { 
    id: 'crypto', 
    name: 'Criptomoedas (USDT)', 
    detail: 'Rede TRC20 / ERC20', 
    icon: '₿',
    isActive: true,
    bankName: 'Binance / Trust Wallet',
    accountNumber: 'T9y7...Kj8L (USDT TRC20)',
    beneficiary: 'AIVision Crypto Fund'
  }
];

// LOAD STATE FROM LOCAL STORAGE
const loadFromStorage = <T>(key: string, defaults: T): T => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaults;
};

// State Variables
let MOCK_USERS: User[] = loadFromStorage(DB_KEYS.USERS, DEFAULT_USERS);
let MOCK_GENERATIONS: Generation[] = loadFromStorage(DB_KEYS.GENERATIONS, []);
let MOCK_PAYMENT_METHODS: PaymentMethod[] = loadFromStorage(DB_KEYS.PAYMENTS, DEFAULT_PAYMENT_METHODS);

// Helper to save state
const saveToStorage = () => {
    localStorage.setItem(DB_KEYS.USERS, JSON.stringify(MOCK_USERS));
    localStorage.setItem(DB_KEYS.GENERATIONS, JSON.stringify(MOCK_GENERATIONS));
    localStorage.setItem(DB_KEYS.PAYMENTS, JSON.stringify(MOCK_PAYMENT_METHODS));
};

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const supabaseService = {
  auth: {
    signIn: async (email: string, password: string): Promise<{ user: User | null, error: string | null }> => {
      await delay(800);
      
      // Admin backdoor hardcoded as requested
      if (email === 'joaodasilvangola03@gmail.com' && password === 'Netinho29') {
        const admin = MOCK_USERS.find(u => u.email === email);
        if (admin) {
            localStorage.setItem('aivision_user', JSON.stringify(admin));
            return { user: admin, error: null };
        }
      }

      const user = MOCK_USERS.find(u => u.email === email);
      if (user) {
        if (user.isActive === false) {
             return { user: null, error: 'Sua conta foi desativada pelo administrador.' };
        }
        // In a real app, we would hash check password. Here we accept any for non-admin for demo
        localStorage.setItem('aivision_user', JSON.stringify(user));
        return { user, error: null };
      }

      return { user: null, error: 'Credenciais inválidas.' };
    },

    signUp: async (email: string, name: string, password: string): Promise<{ user: User | null, error: string | null }> => {
      await delay(1000);
      if (MOCK_USERS.find(u => u.email === email)) {
        return { user: null, error: 'Utilizador já existe.' };
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        plan: PlanType.FREE,
        credits: 10,
        isAdmin: false,
        isActive: true, // Default to active
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
      };

      MOCK_USERS.push(newUser);
      saveToStorage(); // Persist new user
      
      localStorage.setItem('aivision_user', JSON.stringify(newUser));
      return { user: newUser, error: null };
    },

    signOut: async () => {
      localStorage.removeItem('aivision_user');
    },

    getSession: () => {
      const stored = localStorage.getItem('aivision_user');
      if (!stored) return null;
      
      const sessionUser = JSON.parse(stored);
      // Always fetch fresh data from "DB" to ensure credits are up to date
      const freshUser = MOCK_USERS.find(u => u.id === sessionUser.id);
      
      // Check if user was banned while logged in
      if (freshUser && freshUser.isActive === false) {
          localStorage.removeItem('aivision_user');
          return null;
      }

      return freshUser || sessionUser;
    }
  },

  db: {
    getUser: async (id: string) => {
      await delay(200);
      return MOCK_USERS.find(u => u.id === id);
    },

    updateUser: async (updatedUser: User) => {
        await delay(500);
        const index = MOCK_USERS.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
            MOCK_USERS[index] = updatedUser;
            saveToStorage(); // Persist update
            
            // Update session if it's the current user
            const session = localStorage.getItem('aivision_user');
            if (session) {
                const sessionUser = JSON.parse(session);
                if (sessionUser.id === updatedUser.id) {
                    localStorage.setItem('aivision_user', JSON.stringify(updatedUser));
                }
            }
            return updatedUser;
        }
        return null;
    },
    
    updateUserCredits: async (id: string, newCredits: number) => {
      const userIndex = MOCK_USERS.findIndex(u => u.id === id);
      if (userIndex !== -1) {
        MOCK_USERS[userIndex].credits = newCredits;
        saveToStorage(); // Persist credits
        
        // Update local storage session if current user
        const currentUser = JSON.parse(localStorage.getItem('aivision_user') || '{}');
        if (currentUser.id === id) {
            currentUser.credits = newCredits;
            localStorage.setItem('aivision_user', JSON.stringify(currentUser));
        }
      }
    },

    createGeneration: async (gen: Generation) => {
      await delay(300);
      MOCK_GENERATIONS.unshift(gen);
      saveToStorage(); // Persist new generation
      return gen;
    },

    getUserGenerations: async (userId: string) => {
      await delay(500);
      
      // Filter logic: Only return items created within the last 90 days
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      return MOCK_GENERATIONS.filter(g => {
        const createdAt = new Date(g.createdAt);
        return g.userId === userId && createdAt > ninetyDaysAgo;
      });
    },

    // Admin function
    getAllGenerations: async () => {
      await delay(500);
      return MOCK_GENERATIONS;
    },

    // Admin function
    getAllUsers: async () => {
      await delay(500);
      return MOCK_USERS;
    },

    // Payment Methods
    getPaymentMethods: async () => {
      await delay(200);
      return [...MOCK_PAYMENT_METHODS];
    },

    addPaymentMethod: async (method: PaymentMethod) => {
      await delay(300);
      MOCK_PAYMENT_METHODS.push(method);
      saveToStorage(); // Persist payment method
      return method;
    },

    updatePaymentMethod: async (method: PaymentMethod) => {
      await delay(300);
      const index = MOCK_PAYMENT_METHODS.findIndex(m => m.id === method.id);
      if (index !== -1) {
        MOCK_PAYMENT_METHODS[index] = method;
        saveToStorage(); // Persist payment update
      }
      return method;
    },

    deletePaymentMethod: async (id: string) => {
      await delay(300);
      MOCK_PAYMENT_METHODS = MOCK_PAYMENT_METHODS.filter(m => m.id !== id);
      saveToStorage(); // Persist deletion
      return true;
    }
  }
};
