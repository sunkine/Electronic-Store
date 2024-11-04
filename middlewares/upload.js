import multer from 'multer';
import path from 'path';

// Định nghĩa các cấu hình cho multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Thư mục nơi tệp sẽ được lưu
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Đặt tên tệp với thời gian và tên gốc
  }
});

// Tạo middleware multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn kích thước tệp tối đa là 5MB
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/; // Các định dạng tệp được phép
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb('Error: File type not supported!');
  }
});

export default upload;
