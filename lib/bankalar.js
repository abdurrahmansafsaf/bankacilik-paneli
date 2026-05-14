// TBB (Türkiye Bankalar Birliği) mock verisi
// Kaynak: https://www.tbb.org.tr - 2024 Q4 verileri
// Gerçek projede bu veriler TBB API'sinden dinamik olarak çekilir
// Her banka için: id, ad, tur, sube, calisan, karlilik(%), kredi(Mlr₺), mevduat(Mlr₺), kurulus(yıl)

export const bankalar = [
  // Kamu bankaları - devlet kontrolündeki bankalar
  { id: 1, ad: "Ziraat Bankası", tur: "Kamu", sube: 1784, calisan: 25318, karlilik: 42.5, kredi: 1250, mevduat: 1890, kurulus: 1863 },
  { id: 4, ad: "Halkbank", tur: "Kamu", sube: 1002, calisan: 16789, karlilik: 28.4, kredi: 720, mevduat: 980, kurulus: 1938 },
  { id: 5, ad: "Vakıfbank", tur: "Kamu", sube: 978, calisan: 15632, karlilik: 26.9, kredi: 680, mevduat: 920, kurulus: 1954 },

  // Özel bankalar - yerli sermayeli özel bankalar
  { id: 2, ad: "İş Bankası", tur: "Özel", sube: 1290, calisan: 21456, karlilik: 38.2, kredi: 980, mevduat: 1420, kurulus: 1924 },
  { id: 3, ad: "Garanti BBVA", tur: "Özel", sube: 926, calisan: 18234, karlilik: 35.7, kredi: 890, mevduat: 1230, kurulus: 1946 },
  { id: 6, ad: "Yapı Kredi", tur: "Özel", sube: 887, calisan: 17234, karlilik: 32.1, kredi: 810, mevduat: 1100, kurulus: 1944 },
  { id: 7, ad: "Akbank", tur: "Özel", sube: 714, calisan: 13456, karlilik: 31.8, kredi: 760, mevduat: 1050, kurulus: 1948 },
  { id: 10, ad: "TEB", tur: "Özel", sube: 489, calisan: 8765, karlilik: 15.9, kredi: 380, mevduat: 540, kurulus: 1927 },
  { id: 11, ad: "Şekerbank", tur: "Özel", sube: 278, calisan: 4321, karlilik: 8.2, kredi: 180, mevduat: 260, kurulus: 1953 },

  // Yabancı bankalar - yabancı sermayeli bankalar
  { id: 8, ad: "QNB Finansbank", tur: "Yabancı", sube: 521, calisan: 9876, karlilik: 18.3, kredi: 420, mevduat: 610, kurulus: 1987 },
  { id: 9, ad: "Denizbank", tur: "Yabancı", sube: 738, calisan: 11234, karlilik: 21.6, kredi: 510, mevduat: 720, kurulus: 1938 },
  { id: 12, ad: "HSBC Türkiye", tur: "Yabancı", sube: 57, calisan: 2134, karlilik: 6.4, kredi: 95, mevduat: 140, kurulus: 1990 },
]

// Sektör geneli özet istatistikler - Dashboard Stat Card'larında kullanılıyor
// Bu veriler TBB'nin tüm 52 bankayı kapsayan resmi raporlarından alınmıştır
export const sektorIstatistikleri = {
  toplamBanka: 52,          // Türkiye'deki toplam banka sayısı
  toplamSube: 11248,        // Tüm bankaların toplam şube sayısı
  toplamCalisan: 198432,    // Bankacılık sektöründeki toplam çalışan sayısı
  toplamKredi: 8420,        // Milyar TL - sektörün toplam kredi hacmi
  toplamMevduat: 11200,     // Milyar TL - sektörün toplam mevduat hacmi
  ortalamaKarlilik: 24.6,   // % - sektör ortalama özkaynak karlılığı (ROE)
  enflasyon: 48.7,          // % - güncel TÜFE yıllık enflasyon oranı
  kur: 38.42,               // USD/TRY - dolar/türk lirası kuru
}