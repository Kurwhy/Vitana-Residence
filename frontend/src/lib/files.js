export function canUseImage(file) {
  const extension = file.name.split('.').pop()?.toLowerCase()
  const allowedExtension = ['jpg', 'jpeg', 'png'].includes(extension)
  const allowedType = ['image/jpeg', 'image/png'].includes(file.type)
  if (!allowedExtension && !allowedType) {
    return 'Format foto harus JPG, JPEG, atau PNG.'
  }
  if (file.size > 2 * 1024 * 1024) {
    return 'Ukuran foto maksimal 2 MB.'
  }
  return null
}
