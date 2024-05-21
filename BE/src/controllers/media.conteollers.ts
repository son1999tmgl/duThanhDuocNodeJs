import { NextFunction, Request, Response } from 'express';
import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';

export const upLoadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const form = formidable({
    uploadDir: path.resolve('./media/images'),
    // keepExtensions: true,
    // maxFiles: 2,
    multiples: true,
    createDirsFromUploads: true,
    allowEmptyFiles: false
  });
  await form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
    } else {
      const optimizePromises = [];
      const fileNames = [];
      for (const file of Object.values(files)) {
        if (Array.isArray(file)) {
          for (const f of file) {
            optimizePromises.push(optimizeImage(f.filepath));
            fileNames.push(f.newFilename);
          }
        }
      }
      await Promise.all(optimizePromises);
      return res.json({ fileNames });
    }
  });
};

export const upLoadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const form = formidable({
    uploadDir: path.resolve('./media/videos'),
    keepExtensions: true,
    maxFiles: 5,
    multiples: true,
    createDirsFromUploads: true,
    allowEmptyFiles: false
  });
  const [fields, files] = await form.parse(req);
  return res.json({ fields, files });
};

export const getImageController = async (req: Request, res: Response, next: NextFunction) => {
  const fileName = req.params.filename;
  const imgPath = path.resolve(`./media/images/${fileName}.jpeg`);
  if (fs.existsSync(imgPath)) return res.sendFile(imgPath);
  else return res.json({ message: 'not file' });
};
async function optimizeImage(filePath: string) {
  try {
    const optimizedFilePath = `${filePath.split('.')[0]}.jpeg`;

    await sharp(filePath)
      .resize(800, 600) // Resize ảnh về kích thước 800x600
      .jpeg({ quality: 80 }) // Chuyển đổi sang định dạng JPEG với chất lượng 80%
      .toFile(optimizedFilePath); // Lưu file đã optimized
    await fs.promises.unlink(filePath);
  } catch (err) {
    console.error('Error optimizing image:', err);
  }
}
