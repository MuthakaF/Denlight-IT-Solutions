import { ServiceCategory, DiagnosticIssue, RepairTicket } from '../types';
import { SITE_IMAGES } from '../config/productImages';

export const SERVICES_DATA: ServiceCategory[] = [
  {
    id: 'repair',
    title: 'Computer & Laptop Repair',
    shortDesc: 'Hardware diagnostic, LED/OLED screen replacement, motherboard repairs, SSD/RAM speed upgrades & OS installation.',
    iconName: 'Laptop',
    turnaroundTime: '1 to 24 Hours',
    image: SITE_IMAGES.serviceComputerRepair,
    features: [
      'Cracked LED/OLED screen replacement (HP, Dell, Lenovo, ASUS, Acer, Apple)',
      'High-speed SSD upgrades & RAM expansion for ultra-fast boot speeds',
      'Motherboard liquid damage cleanup & chip-level repair',
      'Battery replacement & power jack / charging port repair',
      'Genuine Windows 11 / 10 installation, Office activation & antivirus'
    ]
  },
  {
    id: 'cctv-setup',
    title: 'CCTV Camera Installation & Security Setup',
    shortDesc: 'Complete indoor & outdoor CCTV surveillance camera installation, NVR/DVR setup, and remote mobile phone live viewing for premises in Naivasha.',
    iconName: 'ShieldCheck',
    turnaroundTime: 'Same Day / Next Day On-Site',
    image: SITE_IMAGES.serviceCctvSecurity,
    features: [
      'Hikvision & Dahua 2MP / 5MP HD night vision camera setup',
      'Remote live mobile phone viewing setup via 4G/Wi-Fi',
      'Retail shop, residential home & flower farm surveillance design',
      'Continuous motion detection & hard drive DVR/NVR recording',
      'Physical maintenance & camera repositioning in Naivasha'
    ]
  },
  {
    id: 'networking',
    title: 'Structured Networking & Wi-Fi Setup',
    shortDesc: 'Professional LAN cabling, Wi-Fi router setup, network switch configuration, and firewall protection for homes & offices in Naivasha.',
    iconName: 'Network',
    turnaroundTime: 'Same Day On-Site',
    image: SITE_IMAGES.serviceNetworkingWifi,
    features: [
      'Cat6 Gigabit Ethernet LAN structured cabling & patch panels',
      'Dual-band & Mesh Wi-Fi coverage booster setup',
      'Router, switch & access point configuration (TP-Link, Tenda, MikroTik)',
      'High-speed Ethernet cable termination & socket installation',
      'Network troubleshooting & cable fault testing in Naivasha'
    ]
  },
  {
    id: 'internet',
    title: 'Internet Connectivity & Hotspot Setup',
    shortDesc: 'Dedicated internet links, high-speed point-to-point wireless installation, and hotspot portal setup for commercial premises and farms.',
    iconName: 'Wifi',
    turnaroundTime: '1 to 2 Days Installation',
    image: SITE_IMAGES.serviceInternetHotspot,
    features: [
      'Point-to-Point (P2P) long-range wireless links for farms, lodges & estates in Naivasha',
      'M-Pesa automated Wi-Fi hotspot portal installation for cafes & apartments',
      '4G/5G LTE outdoor router setup with directional antenna boosters',
      'Backup link auto-failover configuration',
      'On-site technical support from Kariuki Chotara road, Naivasha'
    ]
  }
];

export const DIAGNOSTIC_ISSUES: DiagnosticIssue[] = [
  {
    id: 'laptop-screen',
    category: 'laptop',
    label: 'Broken or Flickering Laptop Screen',
    estimatedTime: '2 - 4 Hours',
    commonCauses: ['Accidental drop damage', 'Damaged display flex cable', 'Backlight LED failure']
  },
  {
    id: 'laptop-slow',
    category: 'laptop',
    label: 'Laptop Running Extremely Slow / Freezing',
    estimatedTime: '1 - 2 Hours',
    commonCauses: ['Old Mechanical HDD bottleneck (Needs High-Speed SSD Upgrade)', 'Corrupted Windows OS or virus infection', 'Low RAM capacity']
  },
  {
    id: 'laptop-power',
    category: 'laptop',
    label: 'Laptop Won\'t Turn On or Charge',
    estimatedTime: '2 - 6 Hours',
    commonCauses: ['Faulty DC power jack', 'Blown motherboard power IC', 'Dead battery or damaged charger']
  },
  {
    id: 'cctv-setup-needed',
    category: 'cctv',
    label: 'CCTV Camera System Installation & Phone Viewing Setup',
    estimatedTime: 'Same Day On-Site',
    commonCauses: ['Home or business security protection needed', 'Need live phone monitoring while away']
  },
  {
    id: 'net-wifi-deadzones',
    category: 'networking',
    label: 'Weak Wi-Fi Signal / Dead Zones in Office or Home',
    estimatedTime: 'Same Day On-Site',
    commonCauses: ['Concrete wall interference', 'Single router coverage limitation', 'Outdated Wi-Fi router']
  }
];

export const INITIAL_REPAIR_TICKETS: RepairTicket[] = [
  {
    ticketId: 'DEN-8821',
    customerName: 'Peter K.',
    deviceModel: 'HP EliteBook 840 G5',
    issue: '512GB NVMe SSD Upgrade & Internal Cleaning',
    status: 'Ready for Pickup',
    receivedDate: '2026-07-26',
    estimatedCompletion: '2026-07-27',
    notes: 'Windows 11 Pro freshly installed with driver suite. Ready for pickup at Kariuki Chotara road shop.'
  },
  {
    ticketId: 'DEN-8822',
    customerName: 'Grace N.',
    deviceModel: 'Dell Inspiron 15 3511',
    issue: 'Screen Replacement (15.6" FHD LED)',
    status: 'Testing',
    receivedDate: '2026-07-27',
    estimatedCompletion: '2026-07-27',
    notes: 'New original panel fitted. Color and brightness test in progress.'
  },
  {
    ticketId: 'DEN-8823',
    customerName: 'Naivasha Commercial Complex',
    deviceModel: '4x Hikvision 5MP CCTV Camera Set',
    issue: 'On-Site CCTV Installation & Mobile Phone Sync',
    status: 'Diagnosing',
    receivedDate: '2026-07-27',
    estimatedCompletion: '2026-07-28',
    notes: 'Technician dispatched from Kariuki Chotara road shop for cabling.'
  }
];
