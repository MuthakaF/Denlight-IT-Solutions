import { FinancingPartner } from '../types';

export const FINANCING_PARTNERS: FinancingPartner[] = [
  {
    id: 'watu',
    name: 'WATU Simu',
    tagline: 'Lipa Mdogo Mdogo for Samsung Galaxy A07',
    logoColor: '#00A859',
    badgeBg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400',
    badgeText: 'Samsung A07 Exclusive',
    depositMinPercentage: 15,
    maxDurationMonths: 12,
    paymentFrequencies: ['daily', 'weekly', 'monthly'],
    requirements: [
      'Original Kenyan National ID Card',
      'Active Safaricom M-Pesa Line (Min 6 Months Old)',
      'Initial Deposit (Determined by WATU at Shop)',
      'Next of Kin Contact Details'
    ],
    description: 'WATU Simu provides exclusive Lipa Mdogo Mdogo financing specifically for the Samsung Galaxy A07 at Denlight IT Solutions. Small initial deposit with daily/weekly M-Pesa repayments.',
    features: [
      'Exclusive to Samsung Galaxy A07 smartphone',
      'Instant shop registration on Kariuki Chotara road, Naivasha',
      'Convenient daily M-Pesa installment payments',
      'Full device warranty & insurance cover included'
    ]
  },
  {
    id: 'onfon',
    name: 'OnFon Mobile',
    tagline: 'Financing for Tecno, Infinix, Itel, ZTE, Xiaomi & Oppo',
    logoColor: '#0052CC',
    badgeBg: 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:bg-blue-500/20 dark:text-blue-400',
    badgeText: 'OnFon Partner',
    depositMinPercentage: 20,
    maxDurationMonths: 10,
    paymentFrequencies: ['daily', 'weekly', 'monthly'],
    requirements: [
      'Valid Kenyan National ID',
      'Registered Mobile Money Account (M-Pesa / Airtel Money)',
      'Deposit payment at shop',
      'Alternative phone contact'
    ],
    description: 'OnFon Mobile offers device financing for smartphone brands including Tecno, Infinix, Itel, ZTE, Xiaomi, and Oppo (excludes Samsung and Nokia). Walk into Denlight IT Solutions on Kariuki Chotara road, Naivasha to register.',
    features: [
      'Supports Tecno, Infinix, Itel, ZTE, Xiaomi & Oppo',
      'Excludes Samsung & Nokia devices',
      '100% digital verification with zero paperwork',
      'Flexible payment term choices (3, 6, or 9 months)'
    ]
  },
  {
    id: 'mogo',
    name: 'MOGO Kenya',
    tagline: 'Lipa Mdogo Mdogo for Oppo, Tecno, Infinix & Itel ONLY',
    logoColor: '#FF6B00',
    badgeBg: 'bg-red-500/10 text-red-600 border-red-500/20 dark:bg-red-500/20 dark:text-red-400',
    badgeText: 'MOGO Partner',
    depositMinPercentage: 18,
    maxDurationMonths: 12,
    paymentFrequencies: ['weekly', 'monthly'],
    requirements: [
      'Kenyan ID / Alien ID',
      'M-Pesa statement or active line history',
      'Deposit payment (Set by MOGO at shop)',
      'Physical visit to Denlight Shop Naivasha'
    ],
    description: 'MOGO Kenya provides structured smartphone financing strictly for Oppo, Tecno, Infinix, and Itel phones ONLY. None other (excludes Samsung, Nokia, ZTE, Xiaomi, etc.).',
    features: [
      'Supports Oppo, Tecno, Infinix & Itel ONLY',
      'Excludes Samsung, Nokia, ZTE, Xiaomi & all other brands',
      'Extended repayment schedules up to 12 months',
      'Simple weekly automated M-Pesa repayments'
    ]
  }
];
