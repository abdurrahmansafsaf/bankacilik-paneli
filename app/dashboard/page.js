// SEO Metadata - Arama motorları için sayfa başlığı ve açıklaması
export const metadata = {
  title: 'Dashboard | TBB Bankacılık Paneli',
  description: 'Türkiye bankacılık sektörü özet istatistikleri',
  keywords: 'bankacılık dashboard, TBB, Türkiye ekonomi, GSYH, enflasyon',
}

// World Bank API'den Türkiye verileri çeken asenkron fonksiyon (SSR - Sunucu taraflı)
async function getTurkiyeVerileri() {
  try {
    // 1. GSYH (Gayri Safi Yurt İçi Hasıla) verisi - NY.GDP.MKTP.CD göstergesi
    const gsyhRes = await fetch(
      'https://api.worldbank.org/v2/country/TR/indicator/NY.GDP.MKTP.CD?format=json&mrv=1',
      { next: { revalidate: 3600 } } // Her 1 saatte bir API'den taze veri çek
    )
    const gsyhData = await gsyhRes.json()
    const gsyh = gsyhData[1]?.[0]?.value // JSON dizisinin ikinci elemanından değer al

    // 2. Enflasyon (TÜFE) verisi - FP.CPI.TOTL.ZG göstergesi
    const enflasyonRes = await fetch(
      'https://api.worldbank.org/v2/country/TR/indicator/FP.CPI.TOTL.ZG?format=json&mrv=1',
      { next: { revalidate: 3600 } }
    )
    const enflasyonData = await enflasyonRes.json()
    const enflasyon = enflasyonData[1]?.[0]?.value

    // 3. İşsizlik oranı verisi - SL.UEM.TOTL.ZS göstergesi
    const issizlikRes = await fetch(
      'https://api.worldbank.org/v2/country/TR/indicator/SL.UEM.TOTL.ZS?format=json&mrv=1',
      { next: { revalidate: 3600 } }
    )
    const issizlikData = await issizlikRes.json()
    const issizlik = issizlikData[1]?.[0]?.value

    // 4. Nüfus verisi - SP.POP.TOTL göstergesi
    const nufusRes = await fetch(
      'https://api.worldbank.org/v2/country/TR/indicator/SP.POP.TOTL?format=json&mrv=1',
      { next: { revalidate: 3600 } }
    )
    const nufusData = await nufusRes.json()
    const nufus = nufusData[1]?.[0]?.value

    // 5. İhracat hacmi verisi - NE.EXP.GNFS.CD göstergesi
    const ihracatRes = await fetch(
      'https://api.worldbank.org/v2/country/TR/indicator/NE.EXP.GNFS.CD?format=json&mrv=1',
      { next: { revalidate: 3600 } }
    )
    const ihracatData = await ihracatRes.json()
    const ihracat = ihracatData[1]?.[0]?.value

    // 6. Kişi başı GSYH verisi - NY.GDP.PCAP.CD göstergesi
    const kisiBasiRes = await fetch(
      'https://api.worldbank.org/v2/country/TR/indicator/NY.GDP.PCAP.CD?format=json&mrv=1',
      { next: { revalidate: 3600 } }
    )
    const kisiBasiData = await kisiBasiRes.json()
    const kisiBasi = kisiBasiData[1]?.[0]?.value

    // Tüm değişkenleri döndür
    return { gsyh, enflasyon, issizlik, nufus, ihracat, kisiBasi }
  } catch (e) {
    // API hatası durumunda null değerler döndür, sayfa yine de açılsın
    return { gsyh: null, enflasyon: null, issizlik: null, nufus: null, ihracat: null, kisiBasi: null }
  }
}

// Ana Dashboard bileşeni - async çünkü sunucu taraflı veri çekiyor
export default async function Dashboard() {
  // API'den verileri çek, destructuring ile değişkenlere ata
  const { gsyh, enflasyon, issizlik, nufus, ihracat, kisiBasi } = await getTurkiyeVerileri()

  // World Bank API'den gelen 6 dinamik kart - veriler API'den canlı geliyor
  const apiKartlar = [
    {
      baslik: 'Türkiye GSYH',
      deger: gsyh ? `$${(gsyh / 1e12).toFixed(2)} Trilyon` : 'Veri yok',
      ikon: '🌍', renk: '#1e3a5f', kaynak: 'World Bank API'
    },
    {
      baslik: 'Enflasyon (TÜFE)',
      deger: enflasyon ? `%${enflasyon.toFixed(1)}` : 'Veri yok',
      ikon: '📊', renk: '#8b0000', kaynak: 'World Bank API'
    },
    {
      baslik: 'İşsizlik Oranı',
      deger: issizlik ? `%${issizlik.toFixed(1)}` : 'Veri yok',
      ikon: '👥', renk: '#7b3500', kaynak: 'World Bank API'
    },
    {
      baslik: 'Türkiye Nüfusu',
      deger: nufus ? `${(nufus / 1e6).toFixed(1)} Milyon` : 'Veri yok',
      ikon: '🏙️', renk: '#2d6a4f', kaynak: 'World Bank API'
    },
    {
      baslik: 'İhracat Hacmi',
      deger: ihracat ? `$${(ihracat / 1e9).toFixed(0)} Milyar` : 'Veri yok',
      ikon: '🚢', renk: '#2d6a4f', kaynak: 'World Bank API'
    },
    {
      baslik: 'Kişi Başı GSYH',
      deger: kisiBasi ? `$${kisiBasi.toFixed(0)}` : 'Veri yok',
      ikon: '💵', renk: '#4a1a6b', kaynak: 'World Bank API'
    },
  ]

  // TBB verilerinden gelen 4 statik kart
  const tbbKartlar = [
    { baslik: 'Toplam Banka', deger: '52 adet', ikon: '🏦', renk: '#1a6b3c', kaynak: 'TBB Verisi' },
    { baslik: 'Toplam Şube', deger: '11,248', ikon: '🏢', renk: '#6b1a6b', kaynak: 'TBB Verisi' },
    { baslik: 'Toplam Çalışan', deger: '198,432', ikon: '👔', renk: '#00008b', kaynak: 'TBB Verisi' },
    { baslik: 'Ort. Karlılık', deger: '%24.6', ikon: '📈', renk: '#8b4500', kaynak: 'TBB Verisi' },
  ]

  return (
    // Semantik HTML - section etiketi SEO için önemli
    <section>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '8px' }}>
        📊 Bankacılık Sektörü Dashboard
      </h1>
      <p style={{ color: '#666', marginBottom: '32px' }}>
        World Bank API + TBB verileri — Canlı ekonomik göstergeler
      </p>

      {/* World Bank API Kartları - 6 adet dinamik veri */}
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '16px' }}>
        🌍 Türkiye Makroekonomik Göstergeler
        <span style={{ fontSize: '12px', color: '#888', fontWeight: 'normal', marginLeft: '12px' }}>
          Kaynak: World Bank API (Canlı)
        </span>
      </h2>

      {/* CSS Grid ile responsive kart düzeni - ekran boyutuna göre otomatik sütun */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {apiKartlar.map((kart, i) => (
          <div key={i} style={{
            backgroundColor: kart.renk, color: 'white',
            borderRadius: '12px', padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{kart.ikon}</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>{kart.baslik}</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold' }}>{kart.deger}</div>
            <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '8px' }}>📡 {kart.kaynak}</div>
          </div>
        ))}
      </div>

      {/* TBB Kartları - 4 adet statik veri */}
      <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '16px' }}>
        🏦 Bankacılık Sektörü Özeti
        <span style={{ fontSize: '12px', color: '#888', fontWeight: 'normal', marginLeft: '12px' }}>
          Kaynak: TBB 2024 Q4
        </span>
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        {tbbKartlar.map((kart, i) => (
          <div key={i} style={{
            backgroundColor: kart.renk, color: 'white',
            borderRadius: '12px', padding: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{kart.ikon}</div>
            <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>{kart.baslik}</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold' }}>{kart.deger}</div>
            <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '8px' }}>📋 {kart.kaynak}</div>
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
        <span style={{ marginLeft: '16px', color: '#888', fontSize: '13px' }}>API verileri otomatik güncellenir</span>
      </div>
    </section>
  )
}