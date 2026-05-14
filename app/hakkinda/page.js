// SEO Metadata - Next.js App Router'da her sayfa için ayrı tanımlanır
export const metadata = {
  title: 'Hakkında | TBB Bankacılık Paneli',
  description: 'TBB Bankacılık Paneli hakkında bilgi, kullanılan teknolojiler ve veri kaynakları',
  keywords: 'TBB, Türkiye Bankalar Birliği, bankacılık paneli, finansal analiz, Next.js',
  openGraph: {
    title: 'TBB Bankacılık Sektörü Performans Paneli',
    description: 'Türkiye bankacılık sektörünü analiz eden profesyonel dashboard',
    type: 'website',
  }
}

const teknolojiler = [
  { ad: 'Next.js 15', aciklama: 'React tabanlı full-stack framework', renk: '#000000', ikon: '▲' },
  { ad: 'React 19', aciklama: 'Kullanıcı arayüzü kütüphanesi', renk: '#61dafb', ikon: '⚛️' },
  { ad: 'Tailwind CSS', aciklama: 'Utility-first CSS framework', renk: '#06b6d4', ikon: '🎨' },
  { ad: 'Chart.js', aciklama: 'Grafik ve veri görselleştirme', renk: '#ff6384', ikon: '📊' },
  { ad: 'TBB API / Mock Data', aciklama: 'Türkiye Bankalar Birliği verileri', renk: '#1e3a5f', ikon: '🏦' },
]

const menuler = [
  { ad: 'Dashboard', aciklama: '8 adet dinamik Stat Card ile sektör özeti', ikon: '📊' },
  { ad: 'Banka Listesi', aciklama: 'Arama, filtreleme ve sıralama özellikli DataTable', ikon: '🏦' },
  { ad: 'Yönetim (CRUD)', aciklama: 'Modal formlarla banka ekleme, düzenleme ve silme', ikon: '⚙️' },
  { ad: 'Grafikler', aciklama: 'Bar, Line ve Pie grafikleriyle görsel analiz', ikon: '📈' },
  { ad: 'Hakkında', aciklama: 'Proje detayları ve SEO optimizasyonu', ikon: 'ℹ️' },
]

export default function Hakkinda() {
  return (
    <section>
      {/* Semantik HTML etiketleri - SEO için önemli */}
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '8px' }}>
          ℹ️ Proje Hakkında
        </h1>
        <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.6' }}>
          Bu proje, Türkiye Bankalar Birliği (TBB) verilerini kullanarak
          Türkiye bankacılık sektörünün performansını analiz eden
          profesyonel bir admin dashboard uygulamasıdır.
        </p>
      </header>

      {/* Proje Amacı */}
      <article style={kartStil}>
        <h2 style={baslikStil}>🎯 Proje Amacı</h2>
        <p style={{ color: '#444', lineHeight: '1.8' }}>
          Bankacılık sektöründeki temel göstergeleri (şube sayısı, çalışan sayısı,
          karlılık oranları, kredi ve mevduat hacimleri) interaktif bir arayüzle
          sunmak ve karar vericilere anlık veri analizi imkânı sağlamaktır.
        </p>
        <ul style={{ marginTop: '16px', paddingLeft: '20px', color: '#444', lineHeight: '2' }}>
          <li>✅ Açık veri kaynaklarından API entegrasyonu</li>
          <li>✅ SEO optimizasyonu ve semantik HTML kullanımı</li>
          <li>✅ Admin dashboard ile CRUD işlemleri</li>
          <li>✅ DataTable ile listeleme ve arama</li>
          <li>✅ Modal formlarla veri yönetimi</li>
          <li>✅ Chart.js ile görsel analiz</li>
          <li>✅ Responsive tasarım (Mobile-first)</li>
        </ul>
      </article>

      {/* Menü Yapısı */}
      <article style={kartStil}>
        <h2 style={baslikStil}>🗂️ Uygulama Menüleri</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
          {menuler.map((m, i) => (
            <div key={i} style={{ backgroundColor: '#f0f4ff', borderRadius: '10px', padding: '16px', borderLeft: '4px solid #1e3a5f' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{m.ikon}</div>
              <strong style={{ color: '#1e3a5f' }}>{m.ad}</strong>
              <p style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}>{m.aciklama}</p>
            </div>
          ))}
        </div>
      </article>

      {/* Teknolojiler */}
      <article style={kartStil}>
        <h2 style={baslikStil}>🛠️ Kullanılan Teknolojiler</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {teknolojiler.map((t, i) => (
            <div key={i} style={{ backgroundColor: '#f9f9f9', borderRadius: '10px', padding: '16px', borderTop: `4px solid ${t.renk}` }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{t.ikon}</div>
              <strong style={{ color: '#333' }}>{t.ad}</strong>
              <p style={{ color: '#888', fontSize: '13px', marginTop: '4px' }}>{t.aciklama}</p>
            </div>
          ))}
        </div>
      </article>

      {/* SEO Açıklaması */}
      <article style={kartStil}>
        <h2 style={baslikStil}>🔍 SEO Optimizasyonu</h2>
        <p style={{ color: '#444', lineHeight: '1.8', marginBottom: '16px' }}>
          Bu projede aşağıdaki SEO teknikleri uygulanmıştır:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {[
            { baslik: 'Dinamik Metadata', aciklama: 'Her sayfa için ayrı title ve description tanımlandı' },
            { baslik: 'Semantik HTML', aciklama: '<main>, <section>, <article>, <header>, <footer> etiketleri kullanıldı' },
            { baslik: 'OpenGraph', aciklama: 'Sosyal medya paylaşımları için og: etiketleri eklendi' },
            { baslik: 'Keywords', aciklama: 'Her sayfaya ilgili anahtar kelimeler atandı' },
            { baslik: 'Erişilebilirlik', aciklama: 'aria-label ve alt etiketleri ile WCAG uyumu sağlandı' },
            { baslik: 'Performans', aciklama: "Next.js'in sunucu taraflı render (SSR) özelliği kullanıldı" },
          ].map((s, i) => (
            <div key={i} style={{ backgroundColor: '#f0fff4', borderRadius: '8px', padding: '14px', border: '1px solid #c0e0c0' }}>
              <strong style={{ color: '#1a6b3c', fontSize: '14px' }}>✅ {s.baslik}</strong>
              <p style={{ color: '#555', fontSize: '13px', marginTop: '4px' }}>{s.aciklama}</p>
            </div>
          ))}
        </div>
      </article>

      {/* Veri Kaynağı */}
      <footer style={{ ...kartStil, backgroundColor: '#1e3a5f', color: 'white' }}>
        <h2 style={{ ...baslikStil, color: 'white' }}>📌 Veri Kaynakları</h2>
        <p style={{ lineHeight: '1.8', opacity: 0.9 }}>
          🏦 <strong>TBB (Türkiye Bankalar Birliği)</strong> —
          <a href="https://www.tbb.org.tr" target="_blank" rel="noopener noreferrer"
            style={{ color: '#90cdf4', marginLeft: '8px' }}>www.tbb.org.tr</a>
        </p>
        <p style={{ lineHeight: '1.8', opacity: 0.9 }}>
          📊 <strong>TCMB (Türkiye Cumhuriyet Merkez Bankası)</strong> —
          <a href="https://www.tcmb.gov.tr" target="_blank" rel="noopener noreferrer"
            style={{ color: '#90cdf4', marginLeft: '8px' }}>www.tcmb.gov.tr</a>
        </p>
        <p style={{ marginTop: '16px', fontSize: '13px', opacity: 0.7 }}>
          © 2024 TBB Bankacılık Paneli — Web Tasarım Final Projesi
        </p>
      </footer>
    </section>
  )
}

const kartStil = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: '28px',
  marginBottom: '24px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
}

const baslikStil = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#1e3a5f',
  marginBottom: '16px'
}
