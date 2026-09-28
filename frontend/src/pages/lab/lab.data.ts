// Responsibility: Static definitions and catalog of diagnostic tests and options for lab orders

export const commonLabTests = [
  'Complete Blood Count (CBC)',
  'Blood Sugar (Fasting)',
  'Blood Sugar (PP)',
  'HbA1c',
  'Lipid Profile',
  'Liver Function Test (LFT)',
  'Kidney Function Test (KFT)',
  'Thyroid Function Test (TFT)',
  'Urine Routine',
  'Stool Routine',
  'X-Ray Chest PA',
  'ECG',
  'Ultrasound',
  'CT Scan',
  'Blood Culture',
  'COVID-19 RT-PCR',
] as const;

export const sampleTypeOptions = [
  { value: 'blood', label: 'Blood' },
  { value: 'urine', label: 'Urine' },
  { value: 'stool', label: 'Stool' },
  { value: 'sputum', label: 'Sputum' },
  { value: 'swab', label: 'Swab' },
  { value: 'imaging', label: 'Imaging / None' },
];

export const urgencyOptions = [
  { value: 'routine', label: 'Routine' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'stat', label: 'STAT (Immediate)' },
];
