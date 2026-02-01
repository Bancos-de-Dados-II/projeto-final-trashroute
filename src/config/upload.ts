import multer from 'multer'
import path from 'path'

export const upload = multer({
  storage: multer.diskStorage({
    destination: path.resolve('uploads'),
    filename(req, file, cb) {
      const uniqueName = `${Date.now()}-${file.originalname}`
      cb(null, uniqueName)
    }
  })
})
