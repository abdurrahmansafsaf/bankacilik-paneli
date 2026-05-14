// Grafikler sayfası - World Bank API'den ülke seçimine göre grafik verisi
// Ülke listesi ve tüm veriler API'den dinamik olarak geliyor
'use client'
import { useState, useEffect } from 'react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, ArcElement, Title, Tooltip, Legend
} from 'chart.js'
import { Bar, Line, Pie } from 'react-chartjs-2'

// Chart.js bileşenlerini kaydet
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend)

// Karşılaştırılacak sabit ülkeler - World Bank API kodları
const ULKELER = [
  { kod: 'TR', ad: 'Türkiye' },
  { kod: 'DE', ad: 'Almanya' },
  { kod: 'US', ad: 'ABD' },
  { kod: 'FR', ad: 'Fransa' },
  { kod: 'GB', ad: 'İngiltere' },
  { kod: 'CN', ad: 'Çin' },
  { kod: 'BR', ad: 'Brezilya' },
  { kod: 'IN', ad: 'Hindistan' },
]

// Renk paleti - her ülke için farklı renk
const RENKLER = ['#1e3a5f','#1a6b3c','#8b0000','#7b3500','#6b1a6b','#00008b','#2d6a4f','#8b4500']

export default function Grafikler() {
  // Grafik verileri state'leri
  const [gsyhVerisi, setGsyhVerisi] = useState([])
  const [enflasyonVerisi, setEnflasyonVerisi] = useState([])
  const [issizlikVerisi, setIssizlikVerisi] = useState([])
  const [nufusVerisi, setNufusVerisi] = useState([])
  const [yukleniyor, setYukleniyor] = useState(true)

  // Sayfa açılınca tüm ülkelerin verilerini API'den çek
  useEffect(() => {
    const veriCek = async () => {
      setYukleniyor(true)
      try {
        // Her ülke için 4 gösterge - Promise.all ile hepsi aynı anda çekiliyor
        const istekler = ULKELER.map(ulke =>
          Promise.all([
            fetch(`https://api.worldbank.org/v2/country/${ulke.kod}/indicator/NY.GDP.MKTP.CD?format=json&mrv=1`),
            fetch(`https://api.worldbank.org/v2/country/${ulke.kod}/indicator/FP.CPI.TOTL.ZG?format=json&mrv=1`),
            fetch(`https://api.worldbank.org/v2/country/${ulke.kod}/indicator/SL.UEM.TOTL.ZS?format=json&mrv=1`),
            fetch(`https://api.worldbank.org/v2/country/${ulke.kod}/indicator/SP.POP.TOTL?format=json&mrv=1`),
          ])
        )

        const tumResponses = await Promise.all(istekler)
        const tumData = await Promise.all(
          tumResponses.map(r => Promise.all(r.map(res => res.json())))
        )

        // Her ülkeden gelen veriyi parse et
        const gsyh = [], enflasyon = [], issizlik = [], nufus = []
        tumData.forEach((ulkeData, i) => {
          gsyh.push(ulkeData[0][1]?.[0]?.value ?? 0)
          enflasyon.push(ulkeData[1][1]?.[0]?.value ?? 0)
          issizlik.push(ulkeData[2][1]?.[0]?.value ?? 0)
          nufus.push(ulkeData[3][1]?.[0]?.value ?? 0)
        })

        setGsyhVerisi(gsyh)
        setEnflasyonVerisi(enflasyon)
        setIssizlikVerisi(issizlik)
        setNufusVerisi(nufus)
      } catch (e) {
        console.error('Grafik verisi çekilemedi:', e)
      } finally {
        setYukleniyor(false)
      }
    }
    veriCek()
  }, [])

  const ulkeAdlari = ULKELER.map(u => u.ad)
  const barOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
    scales: { y: { beginAtZero: true } }
  }

  // Pie grafik için bölge dağılımı - API verisiyle hesaplanıyor
  const toplamNufus = nufusVerisi.reduce((a, b) => a + b, 0)
  const nufusYuzdeler = nufusVerisi.map(n => toplamNufus > 0 ? parseFloat(((n / toplamNufus) * 100).toFixed(1)) : 0)

  if (yukleniyor) {
    return (
      <section>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '8px' }}>📈 Grafikler ve Analizler</h1>
        <p style={{ color: '#666', marginBottom: '32px' }}>World Bank API'den veriler yükleniyor...</p>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ ...kartStil, height: '300px', backgroundColor: '#e8edf5', animation: 'pulse 1.5s infinite' }} />
        ))}
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
      </section>
    )
  }

  return (
    <section>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '8px' }}>
        📈 Küresel Ekonomi Grafikleri
      </h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>
        World Bank API — 8 ülkenin ekonomik göstergeleri karşılaştırması (Canlı veri)
      </p>

      {/* Bar - GSYH Karşılaştırması */}
      <div style={kartStil}>
        <h2 style={baslikStil}>🌍 GSYH Karşılaştırması (Milyar USD)</h2>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '16px' }}>Kaynak: World Bank API · NY.GDP.MKTP.CD göstergesi</p>
        <Bar
          data={{
            labels: ulkeAdlari,
            datasets: [{
              label: 'GSYH (Milyar USD)',
              data: gsyhVerisi.map(v => parseFloat((v / 1e9).toFixed(1))),
              backgroundColor: RENKLER,
              borderRadius: 6,
            }]
          }}
          options={barOptions}
        />
      </div>

      {/* Line - Enflasyon Trendi */}
      <div style={kartStil}>
        <h2 style={baslikStil}>📊 Enflasyon Oranları Karşılaştırması (%)</h2>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '16px' }}>Kaynak: World Bank API · FP.CPI.TOTL.ZG göstergesi</p>
        <Line
          data={{
            labels: ulkeAdlari,
            datasets: [{
              label: 'Enflasyon (%)',
              data: enflasyonVerisi.map(v => parseFloat(v.toFixed(2))),
              borderColor: '#8b0000',
              backgroundColor: 'rgba(139,0,0,0.1)',
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#8b0000',
              pointRadius: 6,
            }]
          }}
          options={barOptions}
        />
      </div>

      {/* Bar - İşsizlik */}
      <div style={kartStil}>
        <h2 style={baslikStil}>👥 İşsizlik Oranları Karşılaştırması (%)</h2>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '16px' }}>Kaynak: World Bank API · SL.UEM.TOTL.ZS göstergesi</p>
        <Bar
          data={{
            labels: ulkeAdlari,
            datasets: [{
              label: 'İşsizlik (%)',
              data: issizlikVerisi.map(v => parseFloat(v.toFixed(2))),
              backgroundColor: 'rgba(123,53,0,0.8)',
              borderRadius: 6,
            }]
          }}
          options={barOptions}
        />
      </div>

      {/* Pie - Nüfus Dağılımı */}
      <div style={{ ...kartStil, maxWidth: '500px' }}>
        <h2 style={baslikStil}>🥧 Nüfus Dağılımı (%)</h2>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '16px' }}>Kaynak: World Bank API · SP.POP.TOTL göstergesi</p>
        <Pie
          data={{
            labels: ulkeAdlari,
            datasets: [{
              data: nufusYuzdeler,
              backgroundColor: RENKLER,
            }]
          }}
        />
      </div>

      {/* Veri kaynağı */}
      <div style={{ backgroundColor: '#f0f4ff', border: '1px solid #c0d0ff', borderRadius: '8px', padding: '16px', color: '#333' }}>
        <strong>📌 Veri Kaynağı:</strong>
        <a href="https://data.worldbank.org" target="_blank" rel="noopener noreferrer" style={{ color: '#1e3a5f', marginLeft: '8px' }}>
          World Bank Open Data — data.worldbank.org
        </a>
        <br />
        <span style={{ fontSize: '12px', color: '#888' }}>Tüm veriler World Bank API'den canlı çekilmektedir</span>
      </div>
    </section>
  )
}

const kartStil = { backgroundColor: 'white', borderRadius: '12px', padding: '24px', marginBottom: '28px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }
const baslikStil = { fontSize: '18px', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '8px' }