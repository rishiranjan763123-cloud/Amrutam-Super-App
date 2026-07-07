export type ConsultationStackParamList = {
  DoctorList: undefined;
  DoctorDetails: { doctorId: string };
  Booking: { doctorId: string; slotId: string; startTime: string; endTime: string };
  UpcomingConsultations: undefined;
};

export type ShopStackParamList = {
  ProductList: undefined;
  ProductDetails: { productId: string };
  Cart: undefined;
  CheckoutSummary: undefined;
};

export type HealthRecordsStackParamList = {
  Timeline: undefined;
  RecordDetails: { recordId: string };
};

export type TabParamList = {
  ConsultationTab: undefined;
  ShopTab: undefined;
  HealthRecordsTab: undefined;
};