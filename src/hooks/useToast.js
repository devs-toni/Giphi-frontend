import Swal from "sweetalert2"

export const useToast = () => {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })

  const success = (msg) => {
    Toast.fire({
      icon: 'success',
      title: msg
    })
  }

  const failure = (msg) => {
    Toast.fire({
      icon: "error",
      title: msg
    })
  }

  return { success, failure }
}