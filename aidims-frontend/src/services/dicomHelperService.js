// Mapping từ imagingType (backend) sang typeCode
export const imagingTypeToTypeCode = (imagingType) => {
  if (!imagingType) return '';
  
  const typeMap = {
    'x-ray': 'XR',
    'ct': 'CT',
    'mri': 'MRI',
    'us': 'US',
    'ultrasound': 'US',
    'mammography': 'MG',
    'fluoroscopy': 'FL',
    'pet-ct': 'PET',
    'pet': 'PET',
    'spect': 'SP'
  };
  
  return typeMap[imagingType.toLowerCase()] || '';
};

// Mapping từ imagingType sang tên hiển thị
export const convertImagingTypeToStudyType = (type) => {
  if (!type) return '';
  
  const typeNameMap = {
    'x-ray': 'X-quang thường',
    'ct': 'CT Scanner',
    'mri': 'MRI',
    'us': 'Siêu âm',
    'ultrasound': 'Siêu âm',
    'pet-ct': 'PET-CT',
    'pet': 'PET-CT',
    'spect': 'SPECT',
    'fluoroscopy': 'Fluoroscopy',
    'mammography': 'Mammography'
  };
  
  return typeNameMap[type.toLowerCase()] || type;
};

// Danh sách vùng chụp đơn giản (như trong hình)
export const SIMPLE_BODY_PARTS = [
  'Tứ chi',
  'Ngực',
  'Bụng',
  'Đầu',
  'Cột sống',
  'Khung chậu',
  'Khác'
];

// Mapping từ giá trị đơn giản sang backend value (nếu cần)
export const SIMPLE_TO_BACKEND_MAP = {
  'Tứ chi': 'limbs',
  'Ngực': 'chest',
  'Bụng': 'abdomen',
  'Đầu': 'head',
  'Cột sống': 'spine',
  'Khung chậu': 'pelvis',
  'Khác': 'other'
};

// Lấy danh sách vùng chụp đơn giản
export const getSimpleBodyParts = () => {
  return SIMPLE_BODY_PARTS.map(label => ({
    label,
    value: SIMPLE_TO_BACKEND_MAP[label] || label.toLowerCase()
  }));
};