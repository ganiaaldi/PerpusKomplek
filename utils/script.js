
function validateFormLogin() {
    if (document.getElementById("username").value === "" || document.getElementById("password").value === "")
    {
      alert('Nomor anggota dan kata sandi tidak boleh kosong.')
    }
    else {
        window.location.href = "content.html";
    }
}
