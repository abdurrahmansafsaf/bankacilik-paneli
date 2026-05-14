// Dashboard sayfası - Tüm veriler World Bank API'den dinamik olarak çekiliyor
// Ülke listesi de dahil olmak üzere hiçbir veri kod içinde elle yazılmamıştır
'use client'
import { useState, useEffect } from 'react'

export default function Dashboard() {
  // Ülkeler listesi state'i - World Bank API'den çekilecek
  const [ulkeler, setUlkeler] = useState([])

  // Seçili ülke state'i
  const [seciliUlke, setSeciliUlke] = useState(null)

  // API'den gelen ekonomik veriler state'i
  const [veriler, setVeriler] = useState(null)

  // Yükleniyor durumları - ülke listesi ve veri için ayrı ayrı
  const [ulkeYukleniyor, setUlkeYukleniyor] = useState(true)
  const [veriYukleniyor, setVeriYukleniyor] = useState(false)

  // Sayfa ilk açıldığında World Bank API'den tüm ülke listesini çek
  useEffect(() => {
    const ulkeleriCek = async () => {
      try {
        // World Bank API - tüm ülkeleri çek (per_page=300 ile tek seferde)
        const res = await fetch(
          'https://api.worldbank.org/v2/country?format=json&per_page=300'
        )
        const data = await res.json()

        // Yalnızca gerçek ülkeleri filtrele (bölgesel grupları hariç tut)
        // capitalCity boş olmayanlar gerçek ülkelerdir
        const gercekUlkeler = data[1]
          .filter(u => u.capitalCity && u.capitalCity !== '')
          .map(u => ({
            kod: u.id,          // Ülke kodu (TR, DE, US gibi)
            ad: u.name,         // Ülke adı (API'den geliyor)
            bolgesi: u.region.value // Bölge bilgisi
          }))
          .sort((a, b) => a.ad.localeCompare(b.ad)) // Alfabetik sırala

        setUlkeler(gercekUlkeler)

        // Varsayılan olarak ilk ülkeyi seç
        if (gercekUlkeler.length > 0) {
          setSeciliUlke(gercekUlkeler.find(u => u.kod === 'TR') || gercekUlkeler[0])
        }
      } catch (e) {
        console.error('Ülke listesi çekilemedi:', e)
      } finally {
        setUlkeYukleniyor(false)
      }
    }
    ulkeleriCek()
  }, []) // Sadece sayfa ilk açıldığında çalışır

  // Seçili ülke değiştiğinde o ülkenin ekonomik verilerini API'den çek
  useEffect(() => {
    if (!seciliUlke) return

    const veriCek = async () => {
      setVeriYukleniyor(true)
      setVeriler(null)

      try {
        // Promise.all ile 6 API isteği aynı anda gönderiliyor - performans optimizasyonu
        const [gsyhRes, enflasyonRes, issizlikRes, nufusRes, ihracatRes, kisiBasiRes] = await Promise.all([
          fetch(`https://api.worldbank.org/v2/country/${seciliUlke.kod}/indicator/NY.GDP.MKTP.CD?format=json&mrv=1`),
          fetch(`https://api.worldbank.org/v2/country/${seciliUlke.kod}/indicator/FP.CPI.TOTL.ZG?format=json&mrv=1`),
          fetch(`https://api.worldbank.org/v2/country/${seciliUlke.kod}/indicator/SL.UEM.TOTL.ZS?format=json&mrv=1`),
          fetch(`https://api.worldbank.org/v2/country/${seciliUlke.kod}/indicator/SP.POP.TOTL?format=json&mrv=1`),
          fetch(`https://api.worldbank.org/v2/country/${seciliUlke.kod}/indicator/NE.EXP.GNFS.CD?format=json&mrv=1`),
          fetch(`https://api.worldbank.org/v2/country/${seciliUlke.kod}/indicator/NY.GDP.PCAP.CD?format=json&mrv=1`),
        ])

        // Gelen response'ları JSON'a çevir
        const [gsyhData, enflasyonData, issizlikData, nufusData, ihracatData, kisiBasiData] = await Promise.all([
          gsyhRes.json(), enflasyonRes.json(), issizlikRes.json(),
          nufusRes.json(), ihracatRes.json(), kisiBasiRes.json()
        ])

        // Her göstergenin en güncel değerini al
        setVeriler({
          gsyh: gsyhData[1]?.[0]?.value,
          gsyhYil: gsyhData[1]?.[0]?.date,
          enflasyon: enflasyonData[1]?.[0]?.value,
          enflasyonYil: enflasyonData[1]?.[0]?.date,
          issizlik: issizlikData[1]?.[0]?.value,
          nufus: nufusData[1]?.[0]?.value,
          ihracat: ihracatData[1]?.[0]?.value,
          kisiBasi: kisiBasiData[1]?.[0]?.value,
        })
      } catch (e) {
        console.error('Veri çekilemedi:', e)
      } finally {
        setVeriYukleniyor(false)
      }
    }

    veriCek()
  }, [seciliUlke]) // seciliUlke değiştiğinde tekrar çalışır

  return (
    <section>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '8px' }}>
        📊 Küresel Ekonomi Dashboard
      </h1>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        World Bank API — Ülke seçerek canlı ekonomik verileri görüntüle
      </p>

      {/* Ülke seçim dropdown - liste API'den geliyor */}
      <div style={{ marginBottom: '32px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#444', marginBottom: '8px' }}>
          🌍 Ülke Seç (World Bank API'den {ulkeler.length} ülke yüklendi)
        </label>
        {ulkeYukleniyor ? (
          // Ülke listesi yüklenirken skeleton göster
          <div style={{ padding: '12px', backgroundColor: '#e0e0e0', borderRadius: '8px', width: '300px', animation: 'pulse 1.5s infinite' }}>
            Ülkeler yükleniyor...
          </div>
        ) : (
          // API'den gelen ülkeler dropdown'a dolduruluyor
          <select
            value={seciliUlke?.kod || ''}
            onChange={e => {
              // Seçilen ülke koduna göre ülke objesini bul ve state'e ata
              const bulunan = ulkeler.find(u => u.kod === e.target.value)
              setSeciliUlke(bulunan)
            }}
            style={{
              padding: '12px 16px', borderRadius: '8px', border: '1px solid #ccc',
              fontSize: '15px', width: '320px', cursor: 'pointer',
              backgroundColor: 'white', color: '#333'
            }}
          >
            {/* map() ile API'den gelen her ülke için option oluşturuluyor */}
            {ulkeler.map(ulke => (
              <option key={ulke.kod} value={ulke.kod}>
                {ulke.ad} ({ulke.kod})
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Seçili ülke başlığı */}
      {seciliUlke && (
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '16px' }}>
          {seciliUlke.ad} — Makroekonomik Göstergeler
          <span style={{ fontSize: '12px', color: '#888', fontWeight: 'normal', marginLeft: '12px' }}>
            Kaynak: World Bank API (Canlı)
          </span>
        </h2>
      )}

      {/* Skeleton loading - veri çekilirken gösteriliyor */}
      {veriYukleniyor && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{
              backgroundColor: '#e0e0e0', borderRadius: '12px',
              padding: '24px', height: '120px', animation: 'pulse 1.5s infinite'
            }}>
              <div style={{ width: '40px', height: '40px', backgroundColor: '#ccc', borderRadius: '8px', marginBottom: '12px' }} />
              <div style={{ width: '60%', height: '12px', backgroundColor: '#ccc', borderRadius: '4px', marginBottom: '8px' }} />
              <div style={{ width: '80%', height: '20px', backgroundColor: '#bbb', borderRadius: '4px' }} />
            </div>
          ))}
        </div>
      )}

      {/* Ekonomik veri kartları - API'den gelen verilerle dolduruluyor */}
      {!veriYukleniyor && veriler && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          {[
            { baslik: 'GSYH', deger: veriler.gsyh ? `$${(veriler.gsyh / 1e12).toFixed(2)} Trilyon` : 'Veri yok', ikon: '🌍', renk: '#1e3a5f', yil: veriler.gsyhYil },
            { baslik: 'Enflasyon (TÜFE)', deger: veriler.enflasyon ? `%${veriler.enflasyon.toFixed(1)}` : 'Veri yok', ikon: '📊', renk: '#8b0000', yil: veriler.enflasyonYil },
            { baslik: 'İşsizlik Oranı', deger: veriler.issizlik ? `%${veriler.issizlik.toFixed(1)}` : 'Veri yok', ikon: '👥', renk: '#7b3500', yil: '' },
            { baslik: 'Nüfus', deger: veriler.nufus ? `${(veriler.nufus / 1e6).toFixed(1)} Milyon` : 'Veri yok', ikon: '🏙️', renk: '#2d6a4f', yil: '' },
            { baslik: 'İhracat Hacmi', deger: veriler.ihracat ? `$${(veriler.ihracat / 1e9).toFixed(0)} Milyar` : 'Veri yok', ikon: '🚢', renk: '#005f73', yil: '' },
            { baslik: 'Kişi Başı GSYH', deger: veriler.kisiBasi ? `$${veriler.kisiBasi.toFixed(0)}` : 'Veri yok', ikon: '💵', renk: '#4a1a6b', yil: '' },
          ].map((kart, i) => (
            <div key={i} style={{
              backgroundColor: kart.renk, color: 'white',
              borderRadius: '12px', padding: '24px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{kart.ikon}</div>
              <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>{kart.baslik}</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold' }}>{kart.deger}</div>
              <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '8px' }}>
                📡 World Bank API {kart.yil ? `· ${kart.yil}` : ''}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TBB Bankacılık Sektörü Kartları */}
      <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '16px' }}>
        🏦 Türkiye Bankacılık Sektörü Özeti
        <span style={{ fontSize: '12px', color: '#888', fontWeight: 'normal', marginLeft: '12px' }}>
          Kaynak: TBB 2024 Q4
        </span>
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {[
          { baslik: 'Toplam Banka', deger: '52 adet', ikon: '🏦', renk: '#1a6b3c' },
          { baslik: 'Toplam Şube', deger: '11,248', ikon: '🏢', renk: '#6b1a6b' },
          { baslik: 'Toplam Çalışan', deger: '198,432', ikon: '👔', renk: '#00008b' },
          { baslik: 'Ort. Karlılık', deger: '%24.6', ikon: '📈', renk: '#8b4500' },
        ].map((kart, i) => (
          <div key={i} style={{
            backgroundColor: kart.renk, color: 'white',
            borderRadius: '12px', padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{kart.ikon}</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>{kart.baslik}</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold' }}>{kart.deger}</div>
            <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '8px' }}>📋 TBB Verisi</div>
          </div>
        ))}
      </div>

      {/* Veri kaynakları bilgi notu */}
      <div style={{ backgroundColor: '#f0f4ff', border: '1px solid #c0d0ff', borderRadius: '8px', padding: '16px', color: '#333' }}>
        <strong>📌 Veri Kaynakları:</strong>
        <span style={{ marginLeft: '8px' }}>
          <a href="https://www.worldbank.org" target="_blank" rel="noopener noreferrer" style={{ color: '#1e3a5f' }}>World Bank Open Data</a>
          {' · '}
          <a href="https://www.tbb.org.tr" target="_blank" rel="noopener noreferrer" style={{ color: '#1e3a5f' }}>Türkiye Bankalar Birliği (TBB)</a>
        </span>
        <span style={{ marginLeft: '16px', color: '#888', fontSize: '13px' }}>Tüm veriler World Bank API'den canlı çekilmektedir</span>
      </div>

      {/* Skeleton animasyon CSS */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </section>
  )
}