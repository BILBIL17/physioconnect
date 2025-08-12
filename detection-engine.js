// Fungsi menghitung sudut Cobb dari 3 keypoints
export function estimateCobbAngle(keypoints) {
  // Ambil titik bahu & pinggul
  const leftShoulder = keypoints.find(p => p.name === 'left_shoulder');
  const rightShoulder = keypoints.find(p => p.name === 'right_shoulder');
  const leftHip = keypoints.find(p => p.name === 'left_hip');
  const rightHip = keypoints.find(p => p.name === 'right_hip');

  if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) return null;

  // Hitung slope garis bahu & pinggul
  const shoulderSlope = (rightShoulder.y - leftShoulder.y) / (rightShoulder.x - leftShoulder.x);
  const hipSlope = (rightHip.y - leftHip.y) / (rightHip.x - leftHip.x);

  // Konversi ke derajat
  const shoulderAngle = Math.atan(shoulderSlope) * 180 / Math.PI;
  const hipAngle = Math.atan(hipSlope) * 180 / Math.PI;

  // Cobb angle = selisih slope
  let cobb = Math.abs(shoulderAngle - hipAngle);
  cobb = Math.min(cobb, 180 - cobb); // normalisasi
  return Math.round(cobb * 100) / 100;
}

// Klasifikasi skoliosis
export function classifySeverity(angle) {
  if (angle < 10) return { label: "Normal", color: "#2e7d32" };
  if (angle < 25) return { label: "Ringan", color: "#ff9800" };
  return { label: "Perlu intervensi", color: "#f44336" };
}