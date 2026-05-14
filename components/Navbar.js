'use client'
import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [menuAcik, setMenuAcik] = useState(false)
  const [genislik, setGenislik] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )

  if (typeof window !== 'undefined') {
    window.onresize = () => setGenislik(window.innerWidth)
  }

  const mobil = genislik < 768

  return (
    <nav style={{ backgroundColor: '#1e3a5f', color: 'white', padding: '12px 24px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        {/* Logo */}
        <Link href="/" style={{ color: 'white', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
          🏦 TBB Panel
        </Link>

        {/* Hamburger - sadece mobilde */}
        {mobil && (
          <button
            onClick={() => setMenuAcik(!menuAcik)}
            style={{ background: 'none', border: '1px solid white', color: 'white', padding: '4px 10px', cursor: 'pointer', borderRadius: '4px', fontSize: '18px' }}
            aria-label="Menüyü aç/kapat"
          >
            {menuAcik ? '✕' : '☰'}
          </button>
        )}

        {/* Masaüstü Menü */}
        {!mobil && (
          <ul style={{ display: 'flex', gap: '24px', listStyle: 'none', margin: 0, padding: 0 }}>
            <li><Link href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>📊 Dashboard</Link></li>
            <li><Link href="/bankalar" style={{ color: 'white', textDecoration: 'none' }}>🏦 Bankalar</Link></li>
            <li><Link href="/yonetim" style={{ color: 'white', textDecoration: 'none' }}>⚙️ Yönetim</Link></li>
            <li><Link href="/grafikler" style={{ color: 'white', textDecoration: 'none' }}>📈 Grafikler</Link></li>
            <li><Link href="/hakkinda" style={{ color: 'white', textDecoration: 'none' }}>ℹ️ Hakkında</Link></li>
          </ul>
        )}
      </div>

      {/* Mobil Menü - açılır */}
      {mobil && menuAcik && (
        <ul style={{ listStyle: 'none', margin: '12px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <li><Link href="/dashboard" onClick={() => setMenuAcik(false)} style={{ color: 'white', textDecoration: 'none' }}>📊 Dashboard</Link></li>
          <li><Link href="/bankalar" onClick={() => setMenuAcik(false)} style={{ color: 'white', textDecoration: 'none' }}>🏦 Bankalar</Link></li>
          <li><Link href="/yonetim" onClick={() => setMenuAcik(false)} style={{ color: 'white', textDecoration: 'none' }}>⚙️ Yönetim</Link></li>
          <li><Link href="/grafikler" onClick={() => setMenuAcik(false)} style={{ color: 'white', textDecoration: 'none' }}>📈 Grafikler</Link></li>
          <li><Link href="/hakkinda" onClick={() => setMenuAcik(false)} style={{ color: 'white', textDecoration: 'none' }}>ℹ️ Hakkında</Link></li>
        </ul>
      )}
    </nav>
  )
}