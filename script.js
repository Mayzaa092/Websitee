// Fungsi untuk menampilkan pesan
function showMessage(message, type) {
    const messageEl = document.getElementById('message');
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `message ${type}`;
        messageEl.style.display = 'block';
        
        // Sembunyikan pesan setelah 5 detik
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }
}

// Fungsi untuk mengirim form ke webhook Discord
async function submitForm(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const spinner = document.getElementById('spinner');
    
    // Tampilkan loading state
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    spinner.style.display = 'inline-block';
    
    // Ambil data form
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('messageInput').value;
    
    try {
        // Format data untuk Discord Webhook
        const discordData = {
            content: null,
            embeds: [
                {
                    title: "📧 New Contact Form Submission",
                    color: 3447003, // Warna biru
                    fields: [
                        {
                            name: "Name",
                            value: name,
                            inline: true
                        },
                        {
                            name: "Email",
                            value: email,
                            inline: true
                        },
                        {
                            name: "Message",
                            value: message.length > 1024 ? message.substring(0, 1020) + "..." : message,
                            inline: false
                        },
                        {
                            name: "Timestamp",
                            value: new Date().toLocaleString('id-ID'),
                            inline: true
                        }
                    ],
                    footer: {
                        text: "Contact Form - Constructive Design"
                    }
                }
            ],
            username: "WebHook BOT",
            avatar_url: "https://cdn.discordapp.com/embed/avatars/0.png"
        };

        const response = await fetch('https://discordapp.com/api/webhooks/1442995157203947540/dUqw4fUXmwMJ5ViYH6L4cqhEoCaMuCLATgylBUSFlYaxUPdGpQs-fCzfqG0MlkKViMR2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(discordData)
        });
        
        if (response.ok) {
            showMessage('Pesan berhasil dikirim! Kami akan segera menghubungi Anda.', 'success');
            // Reset form
            document.getElementById('contactForm').reset();
        } else {
            const errorText = await response.text();
            console.error('Discord API Error:', errorText);
            throw new Error(`Discord API error: ${response.status}`);
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.', 'error');
    } finally {
        // Sembunyikan loading state
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        spinner.style.display = 'none';
    }
}

// Sidebar Navigation
const items = document.querySelectorAll(".sidebar .item");
const pageContents = document.querySelectorAll(".page-content");

items.forEach(item => {
    item.addEventListener("click", () => {
        // Hapus semua aktif
        items.forEach(i => {
            i.classList.remove("active");
            i.querySelector(".line").classList.remove("active");
        });

        pageContents.forEach(content => {
            content.classList.remove("active");
        });

        // Aktifkan item yang diklik
        item.classList.add("active");
        item.querySelector(".line").classList.add("active");

        // Ambil halaman dari atribut
        const page = item.getAttribute("data-page");

        // Tampilkan konten yang sesuai
        const targetContent = document.querySelector(`.${page}-content`);
        if (targetContent) {
            targetContent.classList.add("active");
        }

        // Tambahkan event listener untuk form contact jika halaman contact
        if (page === 'contact') {
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                contactForm.addEventListener('submit', submitForm);
            }
        }
    });
});

// Event listener untuk form contact (saat halaman dimuat)
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', submitForm);
    }
});