function showPassword(el) {
  console.log(el.previousElementSibling)
    let x = el.previousElementSibling
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }