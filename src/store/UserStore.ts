// Asumiendo que tienes un fetcher para hacer peticiones
import type { OrderProps } from 'src/sections/user/view/typeOderd';

import { create } from 'zustand';

import { endpoints_minchin, createAxiosInstance } from 'src/utils/axiosInstance';

interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  avatar: string;
  idAuth0: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MetaProps {
  currentPage: number;
  lastPage: number;
  next: number | null;
  perPage: number;
  prev: number | null;
  total: number;
}

export interface TicketUser {
  id: string;
  adultsQty: number;
  childrenQty: number;
  eventDate: string;
  orderItem: {
    id: string;
    productName: string;
    productType: 'ACCESS' | 'INTERACTION';
    quantity: number;
    startTime: string;
    endTime: string;
  }[];
  status: 'PROCESSING' | 'PAID' | 'FAILED' | 'ERROR_CREATING_CHARGE' | 'CHARGE_FAILED';
}

interface UserUpdate {
  name: string;
  phone: string;
  avatar: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  meta: MetaProps | null;
  filters: {
    page?: number;
    perPage?: number;
    status?: string;
    orderBy?: string;
    ticketDateFilter?: string;
  };
  tickets: TicketUser[];
  fetchUser: () => Promise<void>;
  logout: () => void;
  updateUser: (user: UserUpdate) => Promise<UserUpdate | undefined>;
  orderByID: (id: string) => Promise<OrderProps>;
  fetchTickets: ({
    page,
    perPage,
    status,
    orderBy,
    ticketDateFilter,
  }: {
    page?: number;
    perPage?: number;
    status?: 'PROCESSING' | 'PAID' | 'FAILED' | 'ERROR_CREATING_CHARGE' | 'CHARGE_FAILED';
    orderBy?: 'asc' | 'desc';
    ticketDateFilter?: 'past' | 'future';
  }) => Promise<void>;
}

export const keyUser = 'userMinchin';

export const useUserStore = create<UserState>((set) => {
  let initialUser = null;
  if (typeof window !== 'undefined') {
    initialUser = localStorage.getItem(keyUser)
      ? JSON.parse(localStorage.getItem(keyUser) || '{}')
      : null;
  }
  return {
    user: initialUser,
    tickets: [],
    loading: false,
    error: null,
    meta: null,
    filters: {
      page: 1,
      perPage: 5,
      status: '',
      orderBy: 'asc',
      ticketDateFilter: '',
    },

    fetchUser: async () => {
      try {
        set({ loading: true });
        const axiosInstance = createAxiosInstance();
        const response = await axiosInstance.get(endpoints_minchin.auth.me);
        set({ user: response.data.user });
        if (typeof window !== 'undefined') {
          localStorage.setItem(keyUser, JSON.stringify(response.data.user));
        }
        set({ loading: false });
      } catch (error) {
        set({ loading: false });
        throw error;
      }
    },

    updateUser: async (userData: UserUpdate) => {
      set({ loading: true });
      try {
        const axiosInstance = createAxiosInstance();
        const response = await axiosInstance.patch(endpoints_minchin.user.updateUser, userData);
        set({ loading: false, user: response.data });
        return response.data;
      } catch (error) {
        set({ loading: false });
        return undefined;
      }
    },
    logout: () => {
      set({ user: null });
      if (typeof window !== 'undefined') {
        localStorage.removeItem(keyUser);
      }
    },
    fetchTickets: async ({
      page = 1,
      perPage = 6,
      status = '',
      orderBy = 'asc',
      ticketDateFilter = 'past',
    }: {
      page?: number;
      perPage?: number;
      status?: 'PROCESSING' | 'PAID' | 'FAILED' | 'ERROR_CREATING_CHARGE' | 'CHARGE_FAILED' | '';
      orderBy?: 'asc' | 'desc';
      ticketDateFilter?: 'past' | 'future';
    }) => {
      set({ loading: true, error: null });
      try {
        const axiosInstance = createAxiosInstance();
        const params = new URLSearchParams();

        if (page) params.append('page', page.toString());
        if (perPage) params.append('perPage', perPage.toString());
        if (status) params.append('status', status);
        if (orderBy) params.append('orderBy', orderBy);
        if (ticketDateFilter) params.append('ticketDateFilter', ticketDateFilter);

        set({
          filters: {
            page: page || 1,
            perPage: perPage || 5,
            status: status || '',
            orderBy: orderBy || 'asc',
            ticketDateFilter: ticketDateFilter || '',
          },
        });

        const { data } = await axiosInstance.get(
          `${endpoints_minchin.user.orders}?${params.toString()}`
        );
        set({ tickets: data.data, loading: false, meta: data.meta });
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    },
    orderByID: async (id: string) => {
      const axiosInstance = createAxiosInstance();
      const { data } = await axiosInstance.get(endpoints_minchin.user.orderByID.replace(':id', id));
      return data;
    },
  };
});
