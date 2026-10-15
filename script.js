// Fungsi utama untuk memproses transaksi
function prosesTransaksi() {
    const qtyInputs = document.querySelectorAll(".qty-input");
    const diskonPersen = parseFloat(document.getElementById("diskon").value) || 0;
    const uangBayar = parseFloat(document.getElementById("bayar").value) || 0;

    let subtotal = 0;
    let daftarPesananHtml = "<ul style='padding-left: 15px; margin: 5px 0;'>";
    let daftarMenuString = [];
    let adaPesanan = false;

    // Periksa setiap menu dan jumlahnya
    qtyInputs.forEach(input => {
        let jumlah = parseInt(input.value) || 0;
        if (jumlah > 0) {
            adaPesanan = true;
            let namaMenu = input.getAttribute("data-nama");
            let hargaSatuan = parseFloat(input.getAttribute("data-harga"));
            let totalHargaItem = hargaSatuan * jumlah;

            subtotal += totalHargaItem;
            daftarMenuString.push(`${namaMenu} (${jumlah}x)`);
            daftarPesananHtml += `<li>${namaMenu} (${jumlah}x) - Rp ${totalHargaItem.toLocaleString('id-ID')}</li>`;
        }
    });

    if (!adaPesanan) {
        alert("Silakan masukkan jumlah porsi untuk minimal satu menu!");
        return;
    }

    daftarPesananHtml += "</ul>";

    const nilaiDiskon = (subtotal * diskonPersen) / 100;
    const totalAkhir = subtotal - nilaiDiskon;

    if (uangBayar < totalAkhir) {
        alert("Uang pembayaran kurang dari total belanja!");
        return;
    }

    const kembalian = uangBayar - totalAkhir;

    // Tampilkan Struk
    const strukDiv = document.getElementById("struk");
    const detailP = document.getElementById("detailTransaksi");
    strukDiv.style.display = "block";
    detailP.innerHTML = `
        <b>Menu Dipesan:</b>
        ${daftarPesananHtml}
        <hr style="border: 0; border-top: 1px solid var(--pink-medium); margin: 8px 0;">
        <b>Subtotal:</b> Rp ${subtotal.toLocaleString('id-ID')}<br>
        <b>Diskon (${diskonPersen}%):</b> - Rp ${nilaiDiskon.toLocaleString('id-ID')}<br>
        <b>Total Akhir:</b> <span style="color: var(--pink-dark); font-weight: bold;">Rp ${totalAkhir.toLocaleString('id-ID')}</span><br>
        <b>Uang Dibayar:</b> Rp ${uangBayar.toLocaleString('id-ID')}<br>
        <b>Kembalian:</b> <span style="font-weight: bold; color: green;">Rp ${kembalian.toLocaleString('id-ID')}</span>
    `;

    // Gabungkan nama menu untuk disimpan ke riwayat
    let gabunganMenu = daftarMenuString.join(", ");

    // Simpan ke LocalStorage
    simpanKeLocalStorage(gabunganMenu, totalAkhir, kembalian);
    tampilkanRiwayat();
}

// Simpan data ke localStorage
function simpanKeLocalStorage(menu, total, kembalian) {
    let riwayat = JSON.parse(localStorage.getItem("riwayatKasir")) || [];
    let transaksiBaru = {
        menu: menu,
        total: total,
        kembalian: kembalian
    };
    riwayat.push(transaksiBaru);
    localStorage.setItem("riwayatKasir", JSON.stringify(riwayat));
}

// Tampilkan data dari localStorage ke tabel (diurutkan dari yang terbaru)
function tampilkanRiwayat() {
    let riwayat = JSON.parse(localStorage.getItem("riwayatKasir")) || [];
    let tabel = document.getElementById("tabelRiwayat");
    tabel.innerHTML = "";

    // Tampilkan dari bawah ke atas (terbaru di atas)
    riwayat.slice().reverse().forEach(item => {
        let row = tabel.insertRow();
        row.insertCell(0).innerText = item.menu;
        row.insertCell(1).innerText = "Rp " + item.total.toLocaleString('id-ID');
        row.insertCell(2).innerText = "Rp " + item.kembalian.toLocaleString('id-ID');
    });
}

// Hapus riwayat dari localStorage
function hapusRiwayat() {
    if (confirm("Yakin ingin menghapus semua riwayat transaksi?")) {
        localStorage.removeItem("riwayatKasir");
        tampilkanRiwayat();
        document.getElementById("struk").style.display = "none";
    }
}

// Muat riwayat saat halaman pertama kali dibuka
window.onload = function() {
    tampilkanRiwayat();
}