import { LinkingOptions } from '@react-navigation/native';
import { TabParamList } from './types';

export const linking: LinkingOptions<TabParamList> = {
  prefixes: ['amrutam://', 'https://amrutam.com'],
  config: {
    screens: {
      ConsultationTab: {
        screens: {
          DoctorList: 'doctors',
          DoctorDetails: 'doctors/:doctorId',
          Booking: 'doctors/:doctorId/book',
          UpcomingConsultations: 'consultations/upcoming',
        },
      },
      ShopTab: {
        screens: {
          ProductList: 'shop',
          ProductDetails: 'shop/product/:productId',
          Cart: 'shop/cart',
          CheckoutSummary: 'shop/checkout',
        },
      },
      HealthRecordsTab: {
        screens: {
          Timeline: 'records',
          RecordDetails: 'records/:recordId',
        },
      },
    },
  },
};