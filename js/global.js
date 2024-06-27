function showPassword() {
    let x = document.querySelector('.password-toggle');
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }