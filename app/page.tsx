'use client'
import Link from 'next/link'

const menuKartlar = [
  { href: '/dashboard', ikon: '📊', baslik: 'Dashboard', aciklama: '8 Stat Card ile sektör özeti', renk: '#1e3a5f' },
  { href: '/bankalar', ikon: '🏦', baslik: 'Banka Listesi', aciklama: 'Arama, filtreleme, sıralama', renk: '#1a6b3c' },
  { href: '/yonetim', ikon: '⚙️', baslik: 'Yönetim (CRUD)', aciklama: 'Ekle, düzenle, sil', renk: '#7b3500' },
  { href: '/grafikler', ikon: '📈', baslik: 'Grafikler', aciklama: 'Bar, Line, Pie grafikleri', renk: '#6b1a6b' },
  { href: '/hakkinda', ikon: 'ℹ️', baslik: 'Hakkında', aciklama: 'Proje ve SEO detayları', renk: '#00008b' },
]

export default function AnaSayfa() {
  return (
    <section>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a4f 100%)',
        borderRadius: '16px', padding: '48px 32px', color: 'white',
        textAlign: 'center', marginBottom: '40px'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏦</div>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '12px' }}>
          TBB Bankacılık Sektörü Paneli
        </h1>
        <p style={{ fontSize: '18px', opacity: 0.85, marginBottom: '28px', maxWidth: '600px', margin: '0 auto 28px' }}>
          Türkiye Bankalar Birliği verilerini kullanan profesyonel analiz ve yönetim platformu
        </p>
        <Link href="/dashboard" style={{
          backgroundColor: 'white', color: '#1e3a5f', padding: '14px 32px',
          borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px'
        }}>
          📊 Dashboard'a Git →
        </Link>
      </div>

      {/* Menü Kartları */}
      <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '20px' }}>
        🗂️ Uygulama Modülleri
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px', marginBottom: '40px'
      }}>
        {menuKartlar.map((k, i) => (
          <Link key={i} href={k.href} style={{ textDecoration: 'none' }}>
            <div style={{
              backgroundColor: 'white', borderRadius: '12px', padding: '24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)', borderTop: `4px solid ${k.renk}`,
              cursor: 'pointer'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{k.ikon}</div>
              <h3 style={{ color: k.renk, fontWeight: 'bold', marginBottom: '6px' }}>{k.baslik}</h3>
              <p style={{ color: '#888', fontSize: '13px' }}>{k.aciklama}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Özellikler */}
      <div style={{ backgroundColor: '#f0f4ff', borderRadius: '12px', padding: '28px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '20px' }}>
          ✅ Proje Özellikleri
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
          {[
            '📡 TBB açık verisi ile API entegrasyonu',
            '📊 8 dinamik Stat Card (Dashboard)',
            '🔍 Arama, filtreleme ve sıralama (DataTable)',
            '➕ Modal formlarla tam CRUD yönetimi',
            '📈 Bar, Line ve Pie grafikleri (Chart.js)',
            '🔍 SEO optimizasyonu ve semantik HTML',
            '📱 Responsive tasarım (Mobile-first)',
            '⚡ Next.js App Router ile SSR performansı',
          ].map((o, i) => (
            <div key={i} style={{ backgroundColor: 'white', borderRadius: '8px', padding: '12px 16px', color: '#444', fontSize: '14px' }}>
              {o}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}