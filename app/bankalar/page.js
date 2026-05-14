// Bankalar sayfası - World Bank API'den ülke seçimine göre bankacılık verileri
// Dropdown: API'den 200+ ülke, Tablo: seçilen ülkenin bankacılık göstergeleri
'use client'
import { useState, useEffect } from 'react'

// Bankacılık göstergeleri - World Bank API gösterge kodları
const GOSTERGELER = [
  { kod: 'FS.AST.DOMS.GD.ZS', ad: 'Yurt İçi Kredi', birim: '% GSYH' },
  { kod: 'FD.AST.PRVT.GD.ZS', ad: 'Özel Sektör Kredisi', birim: '% GSYH' },
  { kod: 'FD.RES.LIQU.AS.ZS', ad: 'Banka Likidite Oranı', birim: '%' },
  { kod: 'FB.BNK.CAPA.ZS', ad: 'Sermaye Yeterliliği', birim: '%' },
  { kod: 'FB.AST.NPER.ZS', ad: 'Takipteki Krediler', birim: '%' },
  { kod: 'NY.GDP.MKTP.CD', ad: 'GSYH', birim: 'USD' },
  { kod: 'FP.CPI.TOTL.ZG', ad: 'Enflasyon', birim: '%' },
  { kod: 'SL.UEM.TOTL.ZS', ad: 'İşsizlik Oranı', birim: '%' },
]

export default function Bankalar() {
  const [ulkeler, setUlkeler] = useState([])
  const [seciliUlke, setSeciliUlke] = useState(null)
  const [rows, setRows] = useState([])
  const [ulkeYukleniyor, setUlkeYukleniyor] = useState(true)
  const [veriYukleniyor, setVeriYukleniyor] = useState(false)
  const [arama, setArama] = useState('')
  const [siralama, setSiralama] = useState({ alan: 'gosterge', yon: 'artan' })

  // Sayfa açılınca World Bank API'den tüm ülkeleri çek
  useEffect(() => {
    const ulkeleriCek = async () => {
      try {
        const res = await fetch('https://api.worldbank.org/v2/country?format=json&per_page=300')
        const data = await res.json()
        // Sadece gerçek ülkeler - capitalCity boş olmayanlar
        const liste = data[1]
          .filter(u => u.capitalCity && u.capitalCity !== '')
          .map(u => ({ kod: u.id, ad: u.name, bolge: u.region.value }))
          .sort((a, b) => a.ad.localeCompare(b.ad))
        setUlkeler(liste)
        // Varsayılan: Türkiye
        const tr = liste.find(u => u.kod === 'TR')
        setSeciliUlke(tr || liste[0])
      } catch (e) {
        console.error('Ülkeler çekilemedi:', e)
      } finally {
        setUlkeYukleniyor(false)
      }
    }
    ulkeleriCek()
  }, [])

  // Ülke seçilince o ülkenin bankacılık verilerini çek
  useEffect(() => {
    if (!seciliUlke) return
    const veriCek = async () => {
      setVeriYukleniyor(true)
      setRows([])
      try {
        // Tüm göstergeler için aynı anda API isteği gönder
        const responses = await Promise.all(
          GOSTERGELER.map(g =>
            fetch(`https://api.worldbank.org/v2/country/${seciliUlke.kod}/indicator/${g.kod}?format=json&mrv=1`)
          )
        )
        const dataList = await Promise.all(responses.map(r => r.json()))

        // Her göstergenin en güncel değerini al
        const sonuclar = dataList.map((data, i) => {
          const item = data[1]?.[0]
          return {
            id: GOSTERGELER[i].kod,
            gosterge: GOSTERGELER[i].ad,
            kod: GOSTERGELER[i].kod,
            birim: GOSTERGELER[i].birim,
            deger: item?.value ?? null,
            yil: item?.date ?? '-',
          }
        })
        setRows(sonuclar)
      } catch (e) {
        console.error('Veri çekilemedi:', e)
      } finally {
        setVeriYukleniyor(false)
      }
    }
    veriCek()
  }, [seciliUlke])

  // Sıralama toggle
  const siralamaToggle = (alan) => {
    setSiralama(prev =>
      prev.alan === alan
        ? { alan, yon: prev.yon === 'azalan' ? 'artan' : 'azalan' }
        : { alan, yon: 'artan' }
    )
  }
  const ok = (alan) => siralama.alan !== alan ? '↕️' : siralama.yon === 'azalan' ? '🔽' : '🔼'

  // Değeri formatla
  const formatDeger = (deger, birim) => {
    if (deger === null) return <span style={{ color: '#aaa' }}>Veri yok</span>
    if (birim === 'USD') return `$${(deger / 1e9).toFixed(1)} Milyar`
    return `${deger.toFixed(2)}${birim === '%' || birim.includes('%') ? '%' : ''}`
  }

  // Renk kodlaması
  const degerRenk = (deger, kod) => {
    if (deger === null) return '#999'
    if (kod === 'FB.AST.NPER.ZS') return deger > 5 ? '#8b0000' : deger > 2 ? '#8b4500' : '#1a6b3c'
    if (kod === 'FP.CPI.TOTL.ZG') return deger > 20 ? '#8b0000' : deger > 10 ? '#8b4500' : '#1a6b3c'
    return '#1e3a5f'
  }

  // Durum etiketi
  const durumEtiketi = (deger, kod) => {
    if (deger === null) return null
    let metin = '', renk = ''
    if (kod === 'FB.AST.NPER.ZS') {
      metin = deger > 5 ? 'Kritik' : deger > 2 ? 'Dikkat' : 'İyi'
      renk = deger > 5 ? '#8b0000' : deger > 2 ? '#8b4500' : '#1a6b3c'
    } else if (kod === 'FP.CPI.TOTL.ZG') {
      metin = deger > 20 ? 'Kritik' : deger > 10 ? 'Yüksek' : 'Stabil'
      renk = deger > 20 ? '#8b0000' : deger > 10 ? '#8b4500' : '#1a6b3c'
    } else if (kod === 'FB.BNK.CAPA.ZS') {
      metin = deger > 10 ? 'Güçlü' : deger > 6 ? 'Yeterli' : 'Zayıf'
      renk = deger > 10 ? '#1a6b3c' : deger > 6 ? '#8b4500' : '#8b0000'
    } else return null
    return (
      <span style={{
        backgroundColor: renk, color: 'white',
        padding: '2px 8px', borderRadius: '12px', fontSize: '11px', marginLeft: '8px'
      }}>
        {metin}
      </span>
    )
  }

  // Filtrele ve sırala
  const filtrelenmis = rows
    .filter(r => r.gosterge.toLowerCase().includes(arama.toLowerCase()))
    .sort((a, b) => {
      const carpan = siralama.yon === 'azalan' ? -1 : 1
      if (siralama.alan === 'deger') return ((a.deger ?? -Infinity) - (b.deger ?? -Infinity)) * carpan
      if (siralama.alan === 'yil') return (a.yil > b.yil ? 1 : -1) * carpan
      return a.gosterge.localeCompare(b.gosterge) * carpan
    })

  return (
    <section>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '8px' }}>
        🏦 Küresel Bankacılık Verileri
      </h1>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        World Bank API — Ülke seçerek bankacılık sektörü göstergelerini görüntüle
      </p>

      {/* Ülke dropdown - liste API'den geliyor */}
      <div style={{ marginBottom: '28px' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', color: '#444', marginBottom: '8px' }}>
          🌍 Ülke Seç
          <span style={{ fontWeight: 'normal', color: '#888', marginLeft: '8px' }}>
            ({ulkeler.length} ülke — World Bank API)
          </span>
        </label>
        {ulkeYukleniyor ? (
          <div style={{ padding: '12px 16px', backgroundColor: '#e0e0e0', borderRadius: '8px', width: '320px', animation: 'pulse 1.5s infinite' }}>
            Ülkeler yükleniyor...
          </div>
        ) : (
          <select
            value={seciliUlke?.kod || ''}
            onChange={e => setSeciliUlke(ulkeler.find(u => u.kod === e.target.value))}
            style={{
              padding: '12px 16px', borderRadius: '8px', border: '2px solid #1e3a5f',
              fontSize: '15px', width: '320px', cursor: 'pointer', backgroundColor: 'white', color: '#333'
            }}
          >
            {ulkeler.map(u => (
              <option key={u.kod} value={u.kod}>{u.ad} ({u.kod})</option>
            ))}
          </select>
        )}
        {seciliUlke && (
          <p style={{ marginTop: '8px', fontSize: '13px', color: '#888' }}>
            📍 Bölge: {seciliUlke.bolge}
          </p>
        )}
      </div>

      {/* Seçili ülke başlığı */}
      {seciliUlke && (
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e3a5f', marginBottom: '16px' }}>
          {seciliUlke.ad} — Bankacılık Sektörü Göstergeleri
          <span style={{ fontSize: '12px', color: '#888', fontWeight: 'normal', marginLeft: '12px' }}>
            Kaynak: World Bank API (Canlı)
          </span>
        </h2>
      )}

      {/* Arama */}
      <div style={{ marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="🔍 Gösterge ara..."
          value={arama}
          onChange={e => setArama(e.target.value)}
          style={{
            padding: '10px 16px', borderRadius: '8px', border: '1px solid #ccc',
            fontSize: '14px', width: '280px'
          }}
        />
      </div>

      {/* Skeleton loading */}
      {veriYukleniyor && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} style={{
              height: '52px', backgroundColor: '#e8edf5', borderRadius: '8px',
              animation: 'pulse 1.5s infinite'
            }} />
          ))}
        </div>
      )}

      {/* DataTable */}
      {!veriYukleniyor && filtrelenmis.length > 0 && (
        <>
          <div style={{ overflowX: 'auto', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
              <thead>
                <tr style={{ backgroundColor: '#1e3a5f', color: 'white' }}>
                  <th style={{ ...th, cursor: 'pointer' }} onClick={() => siralamaToggle('gosterge')}>
                    Bankacılık Göstergesi {ok('gosterge')}
                  </th>
                  <th style={th}>Gösterge Kodu</th>
                  <th style={{ ...th, cursor: 'pointer' }} onClick={() => siralamaToggle('deger')}>
                    Değer {ok('deger')}
                  </th>
                  <th style={th}>Birim</th>
                  <th style={{ ...th, cursor: 'pointer' }} onClick={() => siralamaToggle('yil')}>
                    Yıl {ok('yil')}
                  </th>
                  <th style={th}>Durum</th>
                </tr>
              </thead>
              <tbody>
                {filtrelenmis.map((r, i) => (
                  <tr key={r.id} style={{ backgroundColor: i % 2 === 0 ? '#f9f9f9' : 'white' }}>
                    <td style={td}><strong>{r.gosterge}</strong></td>
                    <td style={td}>
                      <span style={{
                        backgroundColor: '#e8edf5', color: '#1e3a5f',
                        padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold'
                      }}>
                        {r.kod}
                      </span>
                    </td>
                    <td style={{ ...td, fontWeight: 'bold', color: degerRenk(r.deger, r.kod) }}>
                      {formatDeger(r.deger, r.birim)}
                    </td>
                    <td style={td}>{r.birim}</td>
                    <td style={td}>{r.yil}</td>
                    <td style={td}>{durumEtiketi(r.deger, r.kod)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ color: '#888', fontSize: '13px', marginTop: '12px' }}>
            {filtrelenmis.length} gösterge · Kaynak: World Bank API (Canlı)
          </p>
        </>
      )}

      {/* Veri kaynağı */}
      <div style={{ backgroundColor: '#f0f4ff', border: '1px solid #c0d0ff', borderRadius: '8px', padding: '16px', color: '#333', marginTop: '16px' }}>
        <strong>📌 Veri Kaynağı:</strong>
        <a href="https://data.worldbank.org" target="_blank" rel="noopener noreferrer" style={{ color: '#1e3a5f', marginLeft: '8px' }}>
          World Bank Open Data — data.worldbank.org
        </a>
        <br />
        <span style={{ fontSize: '12px', color: '#888' }}>
          Tüm veriler World Bank API'den canlı çekilmektedir · api.worldbank.org
        </span>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>
    </section>
  )
}

const th = { padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap' }
const td = { padding: '12px 16px', fontSize: '14px', borderBottom: '1px solid #eee' }