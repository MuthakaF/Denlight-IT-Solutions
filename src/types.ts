export type FinancingPartnerId = 'watu' | 'onfon' | 'mogo';

export interface FinancingPartner {
  id: FinancingPartnerId;
  name: string;
  tagline: string;
  logoColor: string;
  badgeBg: string;
  badgeText: string;
  depositMinPercentage: number;
  maxDurationMonths: number;
  paymentFrequencies: ('daily' | 'weekly' | 'monthly')[];
  requirements: string[];
  description: string;
  features: string[];
}

export type ProductCategory =
  | 'smartphones'
  | 'tablets'
  | 'laptops-desktops'
  | 'printers-toners'
  | 'ups-power'
  | 'oraimo-accessories'
  | 'computer-peripherals'
  | 'cables-adapters'
  | 'networking-cctv';

export interface PhoneProduct {
  id: string;
  name: string;
  category: ProductCategory;
  brand: string;
  model: string;
  availablePartners?: FinancingPartnerId[];
  isAvailableInNaivasha: boolean;
  featured?: boolean;
  bestSeller?: boolean;
  badge?: string;
  imageUrl: string;
  priceKsh?: number;
  depositKsh?: number;
  rating?: number;
  reviewCount?: number;
  specs: Record<string, string>;
  colors?: { name: string; hex: string }[];
  description: string;
  laptopCondition?: 'ex-uk' | 'new';
}

export interface ServiceCategory {
  id: 'repair' | 'cctv-setup' | 'networking' | 'internet';
  title: string;
  shortDesc: string;
  iconName: string;
  features: string[];
  turnaroundTime: string;
  image: string;
}

export interface DiagnosticIssue {
  id: string;
  category: 'laptop' | 'desktop' | 'networking' | 'cctv';
  label: string;
  estimatedTime: string;
  commonCauses: string[];
}

export interface RepairTicket {
  ticketId: string;
  customerName: string;
  deviceModel: string;
  issue: string;
  status: 'Received' | 'Diagnosing' | 'Parts Installed' | 'Testing' | 'Ready for Pickup';
  receivedDate: string;
  estimatedCompletion: string;
  notes: string;
}

export interface CatalogFilterState {
  search: string;
  category: string;
  brand: string;
  partner: string;
  laptopCondition: string;
}
