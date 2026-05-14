// Grafikler sayfası - Chart.js ile veri görselleştirme
// Bar, Line ve Pie grafikleri kullanılarak bankacılık verileri analiz ediliyor
// 'use client' direktifi: Chart.js tarayıcı taraflı çalıştığı için gerekli
'use client'
import { bankalar } from '@/lib/bankalar'
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, ArcElement,
  Title, Tooltip, Legend
} from 'chart.js'
import { Bar, Line, Pie } from 'react-chartjs-2'

// Chart.js bileşenlerini kaydet - kullanılacak grafik tipleri buraya ekleniyor
// Bu kayıt yapılmadan grafikler render edilemez
ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, ArcElement,
  Title, Tooltip, Legend
)

export default function Grafikler() {
  // map() ile bankalar dizisinden grafik için gerekli veriler çıkarılıyor
  const isimler = bankalar.map(b => b.ad)       // X ekseni etiketleri
  const subeler = bankalar.map(b => b.sube)      // Şube sayıları - Bar grafiği için
  const karlıliklar = bankalar.map(b => b.karlilik) // Karlılık oranları - Line grafiği için
  const krediler = bankalar.map(b => b.kredi)    // Kredi hacimleri - Bar grafiği için

  // Banka türlerine göre sayım - Pie grafik için veri hazırlanıyor
  // forEach ile her bankanın türüne göre sayaç artırılıyor
  const turSayilari = { Kamu: 0, Özel: 0, Yabancı: 0 }
  bankalar.forEach(b => turSayilari[b.tur]++)

  // Her banka için farklı renk - Bar grafiğinde her sütun farklı renkle gösteriliyor
  const renkler = [
    '#1e3a5f','#1a6b3c','#7b3500','#8b0000','#6b1a6b',
    '#00008b','#2d6a4f','#8b4500','#1a4a6b','#4a1a6b',
    '#6b4a1a','#1a6b6b'
  ]

  // Tüm grafiklerde ortak kullanılan ayarlar - kod tekrarını önler
  const barOptions = {
    responsive: true, // Ekran boyutuna göre otomatik boyutlanma
    plugins: { legend: { position: 'top' } }, // Lejant üstte gösteriliyor
    scales: { y: { beginAtZero: true } } // Y ekseni sıfırdan başlıyor
  }

  return (
    // Semantik HTML - section etiketi SEO için önemli
    <section>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '8px' }}>
        📈 Grafikler ve Analizler
      </h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>
        TBB verilerine göre bankacılık sektörü görsel analizi
      </p>

      {/* Bar Grafik - Şube Sayıları karşılaştırması */}
      <div style={kartStil}>
        <h2 style={baslikStil}>🏢 Banka Şube Sayıları</h2>
        <Bar
          data={{
            labels: isimler,
            datasets: [{
              label: 'Şube Sayısı',
              data: subeler,
              backgroundColor: renkler, // Her banka farklı renk
              borderRadius: 6,
            }]
          }}
          options={barOptions}
        />
      </div>

      {/* Line Grafik - Karlılık oranlarının trendi */}
      <div style={kartStil}>
        <h2 style={baslikStil}>📊 Banka Karlılık Oranları (%)</h2>
        <Line
          data={{
            labels: isimler,
            datasets: [{
              label: 'Karlılık (%)',
              data: karlıliklar,
              borderColor: '#1e3a5f',
              backgroundColor: 'rgba(30,58,95,0.1)', // Yarı saydam dolgu
              tension: 0.4, // Eğri yumuşatma - 0 düz çizgi, 1 tam eğri
              fill: true,
              pointBackgroundColor: '#1e3a5f',
              pointRadius: 5,
            }]
          }}
          options={barOptions}
        />
      </div>

      {/* Bar Grafik - Kredi hacimlerinin karşılaştırması */}
      <div style={kartStil}>
        <h2 style={baslikStil}>💳 Kredi Hacimleri (Milyar ₺)</h2>
        <Bar
          data={{
            labels: isimler,
            datasets: [{
              label: 'Kredi (Milyar ₺)',
              data: krediler,
              backgroundColor: 'rgba(26,107,60,0.8)', // Yeşil ton - kredi pozitif çağrışım
              borderRadius: 6,
            }]
          }}
          options={barOptions}
        />
      </div>

      {/* Pie Grafik - Banka türü dağılımı (Kamu/Özel/Yabancı) */}
      <div style={{ ...kartStil, maxWidth: '500px' }}>
        <h2 style={baslikStil}>🥧 Banka Türü Dağılımı</h2>
        <Pie
          data={{
            labels: ['Kamu', 'Özel', 'Yabancı'],
            datasets: [{
              data: [turSayilari.Kamu, turSayilari['Özel'], turSayilari.Yabancı],
              backgroundColor: ['#1a6b3c', '#1e3a5f', '#7b3500'], // Yeşil, lacivert, kahve
            }]
          }}
        />
      </div>
    </section>
  )
}

// Grafik kartı stili - her grafik ayrı bir kartta gösteriliyor
const kartStil = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '24px',
  marginBottom: '28px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.1)'
}

// Grafik başlık stili - tutarlı görünüm için ayrı değişkende
const baslikStil = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#1e3a5f',
  marginBottom: '20px'
}