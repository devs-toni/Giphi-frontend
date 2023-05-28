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

  const askForDelete = () => {
    return Swal.fire({
      title: 'Seguro que quieres eliminar?',
      text: "Esta acción no se puede revertir!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    })
  }

  return { success, failure, askForDelete }
}