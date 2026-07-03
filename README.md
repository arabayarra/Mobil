# Bölüş

Arkadaş grubuyla ortak masraf bölüşme uygulaması. Tatil, ev arkadaşlığı, kamp —
harcamaları kaydedin, kimin ne kadar borçlu/alacaklı olduğunu ve borçları en az
transferle kapatmanın yolunu anında görün.

React Native + Expo ile yazılmıştır. Veriler telefonda saklanır (AsyncStorage);
sunucu ve üyelik gerektirmez.

## Özellikler

- **Grup kurma** — grup adı ve üye isimleriyle (en az 2 kişi)
- **Harcama ekleme** — başlık, tutar, kim ödedi, kimler dahil
- **Bakiye durumu** — üye başına net alacak/borç, kuruşu kuruşuna
- **Kim kime öder?** — borçları en az transferle kapatan öneri listesi
- **Silme** — harcamayı basılı tutarak, grubu detay ekranından
- Karanlık/aydınlık tema (sistem ayarını takip eder)

## Çalıştırma

```bash
npm install
npm start
```

Telefonunuza [Expo Go](https://expo.dev/go) uygulamasını kurun ve terminalde
çıkan QR kodu okutun (iOS'ta Kamera, Android'de Expo Go içinden). Uygulama
telefonunuzda açılır; kodu her kaydettiğinizde anında yenilenir.

> Not: Bilgisayar ile telefonun aynı Wi-Fi ağında olması gerekir. Olmuyorsa
> `npx expo start --tunnel` deneyin.

## Proje yapısı

```
App.tsx                  Kök bileşen (tema + store + navigasyon)
src/
  Navigator.tsx          Ekranlar arası geçiş (basit stack)
  store.tsx              Veri deposu ve AsyncStorage kalıcılığı
  balances.ts            Net bakiye ve "kim kime öder" hesabı
  format.ts              TL biçimleme ve tutar ayrıştırma
  theme.ts               Renkler (aydınlık/karanlık)
  ui.tsx                 Ortak parçalar (buton, çip, avatar)
  screens/
    GroupsScreen.tsx     Grup listesi
    NewGroupScreen.tsx   Grup kurma
    GroupDetailScreen.tsx  Bakiyeler, ödemeler, harcama listesi
    AddExpenseScreen.tsx Harcama ekleme
```

## Hesap mantığı

Tutarlar kuruş cinsinden tam sayı olarak tutulur (kayan nokta hatası olmaz).
Bir harcama, dahil olan üyeler arasında eşit bölünür; bölümden artan kuruşlar
ilk katılımcılara birer birer dağıtılır, böylece grup toplamı her zaman sıfır
çıkar. "Kim kime öder" listesi, en büyük borçluyu en büyük alacaklıyla
eşleştiren açgözlü algoritmayla üretilir.

## Yol haritası

- [ ] Harcama düzenleme
- [ ] Eşit olmayan bölüşme (paylı/tutarlı)
- [ ] Grup özetini paylaşma (WhatsApp'a metin olarak)
- [ ] Bulut yedekleme / gruplara link ile katılma
