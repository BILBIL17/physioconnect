// Toggle mobile menu
document.getElementById('menuToggle').onclick = () => {
  document.getElementById('navMenu').classList.toggle('show');
};

// Tab navigation
const tabs = document.querySelectorAll('.nav a');
tabs.forEach(tab => {
  tab.onclick = e => {
    e.preventDefault();
    const target = tab.getAttribute('href').substring(1);
    // deactivate all
    document.querySelectorAll('.tab-content').forEach(s=>s.classList.remove('active'));
    document.querySelectorAll('.nav a').forEach(a=>a.classList.remove('active'));
    // activate selected
    document.getElementById(target).classList.add('active');
    tab.classList.add('active');
    if(window.innerWidth < 768) document.getElementById('navMenu').classList.remove('show');
  };
});

// Inisialisasi fitur dasar (contoh: tether Leaflet untuk map, Chart.js untuk grafik, dsb.)
window.addEventListener('DOMContentLoaded', ()=>{
  // Panggil initChat(), initSearch(), initTracking(), initMap() ...
});