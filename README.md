# AnıHane 🌌 Sirius — Eren ve Özlem'in Dijital Anı Platformu

Bu proje **React + Vite + TypeScript + Supabase + TailwindCSS / Custom Styling** ile oluşturulmuş dijital anı ve kilitli günlük platformudur.

---

## 🚀 GitHub & Vercel Canlıya Alma Adımları

### 1️⃣ GitHub Reposuna Yükleme:
Masaüstündeki bu klasörün içinde Powershell veya Terminal açarak sırasıyla şu komutları çalıştırın:

```bash
git add .
git commit -m "AnıHane Sirius v1.0 Yayın Sürümü 🚀"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/ANIHANE_REPO_ADINIZ.git
git push -u origin main
```

---

### 2️⃣ Vercel'i GitHub'a Bağlama (Otomatik Yayınlama):
1. **[Vercel Dashboard](https://vercel.com/dashboard)** sitesine girip **"Add New..." -> "Project"** butonuna tıklayın.
2. **Import Git Repository** kısmından oluşturduğunuz GitHub reposunu seçin.
3. Framework olarak **Vite** otomatik algılanacaktır.
4. **"Deploy"** butonuna tıklayın!

🎉 Artık projeye her yeni dosya eklediğinizde veya `git push` yaptığınızda Vercel saniyeler içinde otomatik olarak canlı sitenizi güncelleyecektir.

---

## 🔒 Veri Güvenliği ve `yuklemeler` Klasörü

- **Verileriniz Asla Silinmez:** Anılar, mektuplar, şarkılar, hedefler ve profil resimleri **Supabase Bulut Veritabanı (Cloud Database)** üzerinde saklanır. Kod güncellense bile verileriniz 100% güvendedir.
- **`yuklemeler/` Klasörü:** Projede `yuklemeler/` adında özel bir klasör tanımlanmıştır ve `.gitignore` dosyasına eklenmiştir. Yerel bilgisayarınızda bu klasöre eklediğiniz özel dosyalar Git güncellemelerinde **asla silinmez veya ezilmez**.
