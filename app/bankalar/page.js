// Bankalar sayfası - DataTable ile listeleme, arama, filtreleme ve sıralama
// 'use client' direktifi: useState hook kullandığımız için client component olarak işaretlendi
'use client'
import { useState } from 'react'
import { bankalar } from '@/lib/bankalar'

export default function Bankalar() {
  // Arama kutusu state'i - kullanıcının yazdığı metni tutar
  const [arama, setArama] = useState('')

  // Sıralama state'i - hangi sütuna göre, hangi yönde sıralandığını tutar
  const [siralama, setSiralama] = useState({ alan: 'sube', yon: 'azalan' })

  // Tür filtresi state'i - Tümü, Kamu, Özel veya Yabancı seçenekleri
  const [turFiltre, setTurFiltre] = useState('Tümü')

  // filter() ile arama ve tür filtrelemesi, sort() ile sıralama yapılıyor
  // Önce arama metnine göre filtrele, sonra türe göre filtrele, sonra sırala
  const filtrelenmis = bankalar
    .filter(b => b.ad.toLowerCase().includes(arama.toLowerCase()))
    .filter(b => turFiltre === 'Tümü' || b.tur === turFiltre)
    .sort((a, b) => {
      const carpan = siralama.yon === 'azalan' ? -1 : 1
      return (a[siralama.alan] - b[siralama.alan]) * carpan
    })

  // Sıralama toggle fonksiyonu - aynı sütuna tıklanırsa yön değişir, farklı sütuna tıklanırsa azalan başlar
  const siralamaToggle = (alan) => {
    setSiralama(prev =>
      prev.alan === alan
        ? { alan, yon: prev.yon === 'azalan' ? 'artan' : 'azalan' }
        : { alan, yon: 'azalan' }
    )
  }

  // Sıralama yönüne göre ok ikonu döndüren yardımcı fonksiyon
  const ok = (alan) => {
    if (siralama.alan !== alan) return '↕️'
    return siralama.yon === 'azalan' ? '🔽' : '🔼'
  }

  // Her banka türü için farklı renk - badge'lerde kullanılıyor
  const turRenk = { 'Kamu': '#1a6b3c', 'Özel': '#1e3a5f', 'Yabancı': '#7b3500' }

  return (
    // Semantik HTML - section etiketi SEO için önemli
    <section>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '8px' }}>
        🏦 Banka Listesi
      </h1>
      <p style={{ color: '#666', marginBottom: '24px' }}>TBB verilerine göre Türkiye'deki bankalar</p>

      {/* Arama kutusu ve tür filtre butonları */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {/* Controlled input - value ve onChange ile React state'e bağlı */}
        <input
          type="text"
          placeholder="🔍 Banka ara..."
          value={arama}
          onChange={e => setArama(e.target.value)}
          style={{
            padding: '10px 16px', borderRadius: '8px', border: '1px solid #ccc',
            fontSize: '14px', flex: 1, minWidth: '200px'
          }}
        />
        {/* Tür filtre butonları - aktif olan koyu renkle gösteriliyor */}
        {['Tümü', 'Kamu', 'Özel', 'Yabancı'].map(tur => (
          <button
            key={tur}
            onClick={() => setTurFiltre(tur)}
            aria-label={`${tur} bankalarını filtrele`}
            style={{
              padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              backgroundColor: turFiltre === tur ? '#1e3a5f' : '#e0e0e0',
              color: turFiltre === tur ? 'white' : '#333',
              fontWeight: turFiltre === tur ? 'bold' : 'normal'
            }}
          >
            {tur}
          </button>
        ))}
      </div>

      {/* DataTable - sütun başlıklarına tıklanarak sıralama yapılabiliyor */}
      <div style={{ overflowX: 'auto', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e3a5f', color: 'white' }}>
              <th style={th}>Banka Adı</th>
              <th style={th}>Tür</th>
              {/* Tıklanabilir sütun başlıkları - siralamaToggle fonksiyonu ile çalışıyor */}
              <th style={{ ...th, cursor: 'pointer' }} onClick={() => siralamaToggle('sube')}>
                Şube {ok('sube')}
              </th>
              <th style={{ ...th, cursor: 'pointer' }} onClick={() => siralamaToggle('calisan')}>
                Çalışan {ok('calisan')}
              </th>
              <th style={{ ...th, cursor: 'pointer' }} onClick={() => siralamaToggle('karlilik')}>
                Karlılık % {ok('karlilik')}
              </th>
              <th style={{ ...th, cursor: 'pointer' }} onClick={() => siralamaToggle('kredi')}>
                Kredi (Mlr ₺) {ok('kredi')}
              </th>
              <th style={{ ...th, cursor: 'pointer' }} onClick={() => siralamaToggle('mevduat')}>
                Mevduat (Mlr ₺) {ok('mevduat')}
              </th>
            </tr>
          </thead>
          <tbody>
            {/* map() ile her banka satırı oluşturuluyor, zebra şerit efekti için i % 2 kullanılıyor */}
            {filtrelenmis.map((b, i) => (
              <tr key={b.id} style={{ backgroundColor: i % 2 === 0 ? '#f9f9f9' : 'white' }}>
                <td style={td}><strong>{b.ad}</strong></td>
                <td style={td}>
                  {/* Banka türü badge'i - turRenk objesiyle dinamik renk */}
                  <span style={{
                    backgroundColor: turRenk[b.tur], color: 'white',
                    padding: '3px 10px', borderRadius: '20px', fontSize: '12px'
                  }}>
                    {b.tur}
                  </span>
                </td>
                <td style={td}>{b.sube.toLocaleString('tr-TR')}</td>
                <td style={td}>{b.calisan.toLocaleString('tr-TR')}</td>
                <td style={td}>
                  {/* Karlılık renk kodlaması: >30 yeşil, >15 turuncu, diğer kırmızı */}
                  <span style={{ color: b.karlilik > 30 ? '#1a6b3c' : b.karlilik > 15 ? '#8b4500' : '#8b0000', fontWeight: 'bold' }}>
                    %{b.karlilik}
                  </span>
                </td>
                <td style={td}>{b.kredi.toLocaleString('tr-TR')}</td>
                <td style={td}>{b.mevduat.toLocaleString('tr-TR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Kaç banka listelendiğini gösteren bilgi satırı */}
      <p style={{ color: '#888', fontSize: '13px', marginTop: '12px' }}>
        {filtrelenmis.length} banka listeleniyor
      </p>
    </section>
  )
}

// Tablo başlık stili - ayrı değişkende tutularak kod tekrarı önlendi
const th = {
  padding: '14px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold', whiteSpace: 'nowrap'
}

// Tablo hücre stili - ayrı değişkende tutularak kod tekrarı önlendi
const td = {
  padding: '12px 16px', fontSize: '14px', borderBottom: '1px solid #eee'
}