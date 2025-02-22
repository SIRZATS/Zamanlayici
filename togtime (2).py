import tkinter as tk
from tkinter import messagebox

class TimerApp:
    def __init__(self, root):
        self.root = root
        self.root.title("TOGTime")
        self.root.geometry("400x400")
        self.root.configure(bg='#F2E4D5')  # Kremsi beyaz arka plan

        # Uygulama ismi
        self.title_label = tk.Label(root, text="TOGTime", font=("Helvetica", 36, "bold"), bg='#F2E4D5', fg='#E74C3E')
        self.title_label.pack(pady=20)

        # Süre göstergesi
        self.time_label = tk.Label(root, text="Süre: 0 dakika 0 saniye", font=("Helvetica", 24), bg='#F2E4D5', fg='#E74C3E')
        self.time_label.pack(pady=20)

        # Toplam zaman göstergesi
        self.total_time_label = tk.Label(root, text="Toplam Zaman: 0 dakika 0 saniye", font=("Helvetica", 18), bg='#F2E4D5', fg='black')
        self.total_time_label.pack(pady=10)

        # Saat ve dakika giriş alanları
        self.hours_frame = tk.Frame(root, bg='#F2E4D5')
        self.hours_frame.pack(pady=5)

        self.hours_label = tk.Label(self.hours_frame, text="Saat:", font=("Helvetica", 16), bg='#F2E4D5', fg='black')
        self.hours_label.pack(side=tk.LEFT)

        self.hours_entry = tk.Entry(self.hours_frame, font=("Helvetica", 16), width=5)
        self.hours_entry.pack(side=tk.LEFT)

        self.minutes_frame = tk.Frame(root, bg='#F2E4D5')
        self.minutes_frame.pack(pady=5)

        self.minutes_label = tk.Label(self.minutes_frame, text="Dakika:", font=("Helvetica", 16), bg='#F2E4D5', fg='black')
        self.minutes_label.pack(side=tk.LEFT)

        self.minutes_entry = tk.Entry(self.minutes_frame, font=("Helvetica", 16), width=5)
        self.minutes_entry.pack(side=tk.LEFT)

        # Başlat, durdur, sıfırla butonları
        self.start_button = tk.Button(root, text="Başlat", command=self.start_timer, font=("Helvetica", 16), bg='#E74C3C', fg='white', relief='flat')
        self.start_button.pack(pady=10, padx=20)

        self.stop_button = tk.Button(root, text="Durdur", command=self.stop_timer, font=("Helvetica", 16), bg='#E74C3C', fg='white', relief='flat')
        self.stop_button.pack(pady=10, padx=20)

        self.reset_button = tk.Button(root, text="Sıfırla", command=self.reset_timer, font=("Helvetica", 16), bg='#E74C3C', fg='white', relief='flat')
        self.reset_button.pack(pady=10, padx=20)

        self.timer_running = False
        self.time_remaining = 0  # Geriye kalan süre
        self.total_time = 0  # Toplam zaman

        # Butonlar için hover efekti
        for button in [self.start_button, self.stop_button, self.reset_button]:
            button.bind("<Enter>", self.on_hover)
            button.bind("<Leave>", self.on_leave)

    def on_hover(self, event):
        event.widget.config(bg='#C0392B')

    def on_leave(self, event):
        event.widget.config(bg='#E74C3C')

    def start_timer(self):
        try:
            hours = int(self.hours_entry.get() or 0)  # Saat varsayılan olarak 0
            minutes = int(self.minutes_entry.get() or 0)  # Dakika varsayılan olarak 0
            if hours < 0 or minutes < 0 or minutes >= 60 or hours > 4:
                raise ValueError("Geçersiz giriş!")
            self.time_remaining = hours * 3600 + minutes * 60  # Saat ve dakikayı saniyeye çevir
            self.timer_running = True
            self.update_timer()
        except ValueError:
            messagebox.showerror("Hata", "Lütfen geçerli saat ve dakika girin!")

    def stop_timer(self):
        self.timer_running = False

    def reset_timer(self):
        self.time_remaining = 0  # Süreyi sıfırla
        # Toplam süre sıfırlanmayacak, sadece süre sıfırlanacak
        self.time_label.config(text="Süre: 0 dakika 0 saniye")  # Süreyi güncelle

    def update_timer(self):
        if self.timer_running:
            if self.time_remaining > 0:
                self.time_remaining -= 1
                self.total_time += 1  # Toplam süreyi güncelle

                # Süre ve toplam zamanı göster
                minutes_remaining = self.time_remaining // 60
                seconds_remaining = self.time_remaining % 60
                self.time_label.config(text=f"Süre: {minutes_remaining} dakika {seconds_remaining} saniye")

                # Toplam zamanı güncelle
                total_minutes = self.total_time // 60
                total_seconds = self.total_time % 60
                self.total_time_label.config(text=f"Toplam Zaman: {total_minutes} dakika {total_seconds} saniye")

                self.root.after(1000, self.update_timer)
            else:
                self.stop_timer()
                messagebox.showinfo("Süre Doldu!", "Süre doldu!")

if __name__ == "__main__":
    root = tk.Tk()
    app = TimerApp(root)
    root.mainloop()
import tkinter as tk
import time

class CountdownTimer:
    def __init__(self, master):
        self.master = master
        self.master.title("TOGTime")
        
        # Arka plan rengi
        self.master.configure(bg="#f5f5dc")  # Hafif krem rengi
        
        # Logo
        self.logo_image = tk.PhotoImage(file="logo.png")  # Logo dosya adı
        self.logo_label = tk.Label(master, image=self.logo_image, bg="#f5f5dc")
        self.logo_label.pack(side=tk.BOTTOM, anchor='se')  # Sağ alt köşe
        
        self.time_label = tk.Label(master, text="Süre (Dakika/Saniye):", bg="#f5f5dc")
        self.time_label.pack(pady=10)

        self.time_entry = tk.Entry(master, width=10)
        self.time_entry.pack(pady=10)

        self.start_button = tk.Button(master, text="Başlat", command=self.start_timer)
        self.start_button.pack(pady=10)

        self.reset_button = tk.Button(master, text="Sıfırla", command=self.reset_timer)
        self.reset_button.pack(pady=10)

        self.total_time_label = tk.Label(master, text="Toplam Geçen Süre: 0 dakika 0 saniye", bg="#f5f5dc")
        self.total_time_label.pack(pady=10)

        self.remaining_time_label = tk.Label(master, text="Kalan Süre: 0 dakika 0 saniye", bg="#f5f5dc")
        self.remaining_time_label.pack(pady=10)

        self.total_time = 0  # Toplam geçen süre
        self.is_running = False  # Timer çalışıp çalışmadığını kontrol etmek için

    def start_timer(self):
        input_time = self.time_entry.get()
        if input_time.isdigit():
            self.remaining_time = int(input_time) * 60  # Dakikayı saniyeye çevir
            self.is_running = True
            self.update_timer()

    def update_timer(self):
        if self.is_running and self.remaining_time > 0:
            mins, secs = divmod(self.remaining_time, 60)
            self.remaining_time_label.config(text=f"Kalan Süre: {mins} dakika {secs} saniye")
            self.total_time += 1
            self.update_total_time_label()
            self.remaining_time -= 1
            self.master.after(1000, self.update_timer)
        elif self.remaining_time == 0:
            self.remaining_time_label.config(text="Kalan Süre: 0 dakika 0 saniye")
            self.is_running = False  # Timer durdurulur

    def update_total_time_label(self):
        mins, secs = divmod(self.total_time, 60)
        self.total_time_label.config(text=f"Toplam Geçen Süre: {mins} dakika {secs} saniye")

    def reset_timer(self):
        self.is_running = False
        self.total_time = 0  # Sıfırlanır ama toplam süre sıfırlanmaz
        self.remaining_time_label.config(text="Kalan Süre: 0 dakika 0 saniye")
        self.update_total_time_label()

if __name__ == "__main__":
    root = tk.Tk()
    countdown_timer = CountdownTimer(root)
    root.mainloop()
import tkinter as tk
from tkinter import messagebox
from playsound import playsound
import threading

class CountdownTimer:
    def __init__(self, master):
        self.master = master
        self.master.title("TOGTime")

        # Arka plan rengi
        self.master.configure(bg="#f5f5dc")  # Hafif krem rengi

        # Logo
        self.logo_image = tk.PhotoImage(file="logo.png")  # Logo dosya adı
        self.logo_label = tk.Label(master, image=self.logo_image, bg="#f5f5dc")
        self.logo_label.pack(side=tk.BOTTOM, anchor='se')  # Sağ alt köşe

        self.time_label = tk.Label(master, text="Süre (Dakika/Saniye):", bg="#f5f5dc")
        self.time_label.pack(pady=10)

        self.time_entry = tk.Entry(master, width=10)
        self.time_entry.pack(pady=10)

        self.start_button = tk.Button(master, text="Başlat", command=self.start_timer)
        self.start_button.pack(pady=10)

        self.reset_button = tk.Button(master, text="Sıfırla", command=self.reset_timer)
        self.reset_button.pack(pady=10)

        self.total_time_label = tk.Label(master, text="Toplam Geçen Süre: 0 dakika 0 saniye", bg="#f5f5dc")
        self.total_time_label.pack(pady=10)

        self.remaining_time_label = tk.Label(master, text="Kalan Süre: 0 dakika 0 saniye", bg="#f5f5dc")
        self.remaining_time_label.pack(pady=10)

        self.total_seconds = 0
        self.elapsed_seconds = 0
        self.running = False

    def start_timer(self):
        if self.running:
            return

        try:
            input_time = int(self.time_entry.get())
            self.total_seconds = input_time * 60 if input_time < 60 else input_time * 3600
            self.running = True
            self.elapsed_seconds = 0

            self.update_timer()
        except ValueError:
            messagebox.showerror("Hata", "Lütfen geçerli bir sayı girin.")

    def update_timer(self):
        if self.running:
            if self.elapsed_seconds < self.total_seconds:
                self.elapsed_seconds += 1
                remaining_time = self.total_seconds - self.elapsed_seconds
                minutes, seconds = divmod(remaining_time, 60)
                self.remaining_time_label.config(text=f"Kalan Süre: {minutes} dakika {seconds} saniye")

                total_minutes, total_seconds = divmod(self.elapsed_seconds, 60)
                self.total_time_label.config(text=f"Toplam Geçen Süre: {total_minutes} dakika {total_seconds} saniye")

                self.master.after(1000, self.update_timer)
            else:
                self.running = False
                self.play_sound()  # Ses çalma
                self.show_completion_message()

    def play_sound(self):
        # Ses dosyasını çalmak için yeni bir thread oluşturun
        threading.Thread(target=playsound, args=("alarm_sound.mp3",)).start()  # Ses dosya adı

    def show_completion_message(self):
        messagebox.showinfo("Tamamlandı", "Süre doldu!")

    def reset_timer(self):
        self.running = False
        self.elapsed_seconds = 0
        self.total_seconds = 0
        self.total_time_label.config(text="Toplam Geçen Süre: 0 dakika 0 saniye")
        self.remaining_time_label.config(text="Kalan Süre: 0 dakika 0 saniye")
        self.time_entry.delete(0, tk.END)

if __name__ == "__main__":
    root = tk.Tk()
    timer = CountdownTimer(root)
    root.mainloop()
