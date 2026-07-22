# Track My Way Expo

Bu proje `https://preview--track-my-way-13.lovable.app` adresini Expo Go içinde iOS uygulaması gibi açan hafif bir WebView kabuğudur.

## Çalıştırma

```bash
npm install
npx expo start
```

Terminalde QR kod çıkınca iPhone'da Expo Go ile okut.

## Notlar

- Bu yapı Expo Go ile test/kullanım içindir.
- App Store'a gönderilecek bağımsız iOS uygulaması için daha sonra EAS Build gerekir.
- Hedef URL değişirse `App.js` içindeki `APP_URL` değerini güncelle.
