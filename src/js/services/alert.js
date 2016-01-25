import sweetalert from 'sweetalert'

export const alert = {
  success (title, msg) {
    sweetalert({
      type: 'success',
      title: title || 'Success!',
      text: msg || undefined,
      confirmButtonColor: '#1fa589',
      confirmButtonText: 'Okay',
      customClass: 'sweetalert-fix'
    })
  },
  error (title, err = '') {
    let msg = err;
    msg = err.message ? err.message : msg;
    if (err.stack) {
      console.error(err.stack);
    }
    sweetalert({
      type: 'error',
      title: title || 'Error!',
      text: msg || undefined,
      confirmButtonColor: '#f65b4f',
      confirmButtonText: 'Okay',
      allowOutsideClick: true,
      customClass: 'sweetalert-fix'
    })
  }
}
