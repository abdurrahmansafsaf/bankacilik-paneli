// Yönetim sayfası - Full CRUD işlemleri (Create, Read, Update, Delete)
// Modal formlar ile banka ekleme, düzenleme ve silme işlemleri yapılıyor
// 'use client' direktifi: useState hook kullandığımız için client component olarak işaretlendi
'use client'
import { useState } from 'react'
import { bankalar as ilkVeri } from '@/lib/bankalar'

// Boş form şablonu - yeni banka eklerken veya formu sıfırlarken kullanılır
const boshForm = { ad: '', tur: 'Özel', sube: '', calisan: '', karlilik: '', kredi: '', mevduat: '', kurulus: '' }

export default function Yonetim() {
  // Liste state'i - başlangıçta TBB mock verisiyle doluyor, CRUD işlemleriyle güncelleniyor
  const [liste, setListe] = useState(ilkVeri)

  // Modal state'i - hangi modalın açık olduğunu tutar: 'ekle' | 'duzenle' | 'sil' | null
  const [modal, setModal] = useState(null)

  // Seçilen banka state'i - düzenle veya sil işlemi için hangi banka seçildi
  const [secilen, setSecilen] = useState(null)

  // Form state'i - modal içindeki input alanlarının değerlerini tutar
  const [form, setForm] = useState(boshForm)

  // Hata state'i - form validasyon hatalarını tutar, hatalı alanlarda kırmızı border gösterir
  const [hata, setHata] = useState({})

  // Modal açma fonksiyonu - tip ve banka parametresi alır
  // Düzenle/sil için banka verisiyle, ekle için boş formla açılır
  const modalAc = (tip, banka = null) => {
    setModal(tip)
    setSecilen(banka)
    setForm(banka ? { ...banka } : boshForm) // Spread operator ile form doldurulur
    setHata({})
  }

  // Modal kapatma fonksiyonu - tüm state'leri sıfırlar
  const modalKapat = () => { setModal(null); setSecilen(null); setForm(boshForm) }

  // Form validasyon fonksiyonu - zorunlu alanları kontrol eder
  // Hata varsa hata state'ini günceller ve false döndürür
  const dogrula = () => {
    const hatalar = {}
    if (!form.ad.trim()) hatalar.ad = 'Banka adı zorunludur'
    if (!form.sube || form.sube <= 0) hatalar.sube = 'Geçerli şube sayısı girin'
    if (!form.calisan || form.calisan <= 0) hatalar.calisan = 'Geçerli çalışan sayısı girin'
    if (!form.karlilik) hatalar.karlilik = 'Karlılık oranı zorunludur'
    if (!form.kredi || form.kredi <= 0) hatalar.kredi = 'Kredi miktarı zorunludur'
    if (!form.mevduat || form.mevduat <= 0) hatalar.mevduat = 'Mevduat miktarı zorunludur'
    setHata(hatalar)
    return Object.keys(hatalar).length === 0 // Hata yoksa true döner
  }

  // CREATE - Yeni banka ekleme fonksiyonu
  // Date.now() ile benzersiz id oluşturulur, + operatörü ile string'ler sayıya çevrilir
  const ekle = () => {
    if (!dogrula()) return // Validasyon geçmezse işlemi durdur
    const yeni = { ...form, id: Date.now(), sube: +form.sube, calisan: +form.calisan, karlilik: +form.karlilik, kredi: +form.kredi, mevduat: +form.mevduat, kurulus: +form.kurulus }
    setListe([...liste, yeni]) // Spread operator ile yeni banka listeye eklenir
    modalKapat()
  }

  // UPDATE - Banka düzenleme fonksiyonu
  // map() ile seçilen banka güncellenir, diğerleri değişmez
  const duzenle = () => {
    if (!dogrula()) return // Validasyon geçmezse işlemi durdur
    setListe(liste.map(b => b.id === secilen.id
      ? { ...form, id: secilen.id, sube: +form.sube, calisan: +form.calisan, karlilik: +form.karlilik, kredi: +form.kredi, mevduat: +form.mevduat }
      : b
    ))
    modalKapat()
  }

  // DELETE - Banka silme fonksiyonu
  // filter() ile seçilen banka listeden çıkarılır
  const sil = () => {
    setListe(liste.filter(b => b.id !== secilen.id))
    modalKapat()
  }

  // Her banka türü için farklı renk - badge'lerde kullanılıyor
  const turRenk = { 'Kamu': '#1a6b3c', 'Özel': '#1e3a5f', 'Yabancı': '#7b3500' }

  return (
    // Semantik HTML - section etiketi SEO için önemli
    <section>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e3a5f', margin: 0 }}>⚙️ Banka Yönetimi</h1>
          <p style={{ color: '#666', margin: '4px 0 0' }}>Banka ekle, düzenle veya sil</p>
        </div>
        {/* Yeni banka ekleme butonu - modalAc('ekle') fonksiyonunu tetikler */}
        <button onClick={() => modalAc('ekle')} style={btnYesil}>+ Yeni Banka Ekle</button>
      </div>

      {/* CRUD Tablosu - Her satırda Düzenle ve Sil butonları bulunuyor */}
      <div style={{ overflowX: 'auto', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead>
            <tr style={{ backgroundColor: '#1e3a5f', color: 'white' }}>
              {/* Sütun başlıkları map() ile oluşturuluyor */}
              {['Banka Adı', 'Tür', 'Şube', 'Çalışan', 'Karlılık %', 'İşlemler'].map(h => (
                <th key={h} style={th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Her banka için satır oluşturuluyor, zebra şerit için i % 2 kullanılıyor */}
            {liste.map((b, i) => (
              <tr key={b.id} style={{ backgroundColor: i % 2 === 0 ? '#f9f9f9' : 'white' }}>
                <td style={td}><strong>{b.ad}</strong></td>
                <td style={td}>
                  {/* Dinamik renk badge'i - turRenk objesiyle */}
                  <span style={{ backgroundColor: turRenk[b.tur], color: 'white', padding: '3px 10px', borderRadius: '20px', fontSize: '12px' }}>
                    {b.tur}
                  </span>
                </td>
                <td style={td}>{b.sube.toLocaleString('tr-TR')}</td>
                <td style={td}>{b.calisan.toLocaleString('tr-TR')}</td>
                <td style={td}>%{b.karlilik}</td>
                <td style={td}>
                  {/* Düzenle butonu - seçilen bankayı modalAc'a gönderir */}
                  <button onClick={() => modalAc('duzenle', b)} style={btnMavi}>✏️ Düzenle</button>
                  {/* Sil butonu - onay modalı açar */}
                  <button onClick={() => modalAc('sil', b)} style={btnKirmizi}>🗑️ Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p style={{ color: '#888', fontSize: '13px', marginTop: '12px' }}>{liste.length} banka kayıtlı</p>

      {/* Modal - modal state null değilse gösteriliyor */}
      {modal && (
        // Arkaplan overlay'ine tıklanınca modal kapanıyor
        <div onClick={modalKapat} style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          {/* e.stopPropagation() ile modal içine tıklanınca kapanması engelleniyor */}
          <div onClick={e => e.stopPropagation()} style={{ backgroundColor: 'white', borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>

            {/* SİL MODAL - Onay sorusu gösterir */}
            {modal === 'sil' && (
              <>
                <h2 style={{ color: '#8b0000', marginBottom: '16px' }}>🗑️ Banka Sil</h2>
                <p><strong>{secilen?.ad}</strong> bankasını silmek istediğinize emin misiniz?</p>
                <p style={{ color: '#888', fontSize: '13px' }}>Bu işlem geri alınamaz.</p>
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button onClick={sil} style={{ ...btnKirmizi, flex: 1, padding: '12px' }}>Evet, Sil</button>
                  <button onClick={modalKapat} style={{ ...btnGri, flex: 1, padding: '12px' }}>İptal</button>
                </div>
              </>
            )}

            {/* EKLE / DÜZENLE MODAL - Form alanları gösterir */}
            {(modal === 'ekle' || modal === 'duzenle') && (
              <>
                <h2 style={{ color: '#1e3a5f', marginBottom: '24px' }}>
                  {modal === 'ekle' ? '➕ Yeni Banka Ekle' : '✏️ Banka Düzenle'}
                </h2>

                {/* Form alanları dinamik olarak map() ile oluşturuluyor - kod tekrarını önler */}
                {[
                  { label: 'Banka Adı *', key: 'ad', type: 'text', placeholder: 'Örn: Ziraat Bankası' },
                  { label: 'Şube Sayısı *', key: 'sube', type: 'number', placeholder: 'Örn: 500' },
                  { label: 'Çalışan Sayısı *', key: 'calisan', type: 'number', placeholder: 'Örn: 10000' },
                  { label: 'Karlılık (%) *', key: 'karlilik', type: 'number', placeholder: 'Örn: 25.5' },
                  { label: 'Kredi (Milyar ₺) *', key: 'kredi', type: 'number', placeholder: 'Örn: 500' },
                  { label: 'Mevduat (Milyar ₺) *', key: 'mevduat', type: 'number', placeholder: 'Örn: 800' },
                  { label: 'Kuruluş Yılı', key: 'kurulus', type: 'number', placeholder: 'Örn: 1950' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key} style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#444', marginBottom: '6px' }}>{label}</label>
                    {/* Controlled input - her değişimde form state güncelleniyor */}
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: hata[key] ? '1px solid red' : '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                    {/* Validasyon hatası varsa kırmızı mesaj göster */}
                    {hata[key] && <span style={{ color: 'red', fontSize: '12px' }}>{hata[key]}</span>}
                  </div>
                ))}

                {/* Banka türü select dropdown */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#444', marginBottom: '6px' }}>Banka Türü</label>
                  <select value={form.tur} onChange={e => setForm({ ...form, tur: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }}>
                    <option>Kamu</option>
                    <option>Özel</option>
                    <option>Yabancı</option>
                  </select>
                </div>

                {/* Form gönderme ve iptal butonları */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  {/* Modal tipine göre ekle veya güncelle fonksiyonu çağrılıyor */}
                  <button onClick={modal === 'ekle' ? ekle : duzenle} style={{ ...btnYesil, flex: 1, padding: '12px' }}>
                    {modal === 'ekle' ? '➕ Ekle' : '✏️ Güncelle'}
                  </button>
                  <button onClick={modalKapat} style={{ ...btnGri, flex: 1, padding: '12px' }}>İptal</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

// Stil sabitleri - kod tekrarını önlemek için ayrı değişkenlerde tutuldu
const th = { padding: '14px 16px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold' }
const td = { padding: '12px 16px', fontSize: '14px', borderBottom: '1px solid #eee' }
const btnYesil = { backgroundColor: '#1a6b3c', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginRight: '8px' }
const btnMavi = { backgroundColor: '#1e3a5f', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', marginRight: '8px', fontSize: '13px' }
const btnKirmizi = { backgroundColor: '#8b0000', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }
const btnGri = { backgroundColor: '#666', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }