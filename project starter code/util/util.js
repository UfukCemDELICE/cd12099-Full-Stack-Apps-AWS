import fs from "fs";
import Jimp from "jimp";
import path from "path";
import axios from "axios";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tmpDir = path.join(__dirname, "tmp");

if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

export async function filterImageFromURL(inputURL) {
  try {
    console.log("Downloading image from URL:", inputURL);
    
    const response = await axios({
      method: "get",
      url: inputURL,
      responseType: "arraybuffer",
    });
    
    const buffer = Buffer.from(response.data, "binary");
    const photo = await Jimp.read(buffer);
    const outpath = path.join(tmpDir, `filtered.${Date.now()}.jpg`);

    await photo.resize(256, 256).quality(60).greyscale().writeAsync(outpath);

    console.log("Filtered image saved at:", outpath);
    return outpath;
  } catch (error) {
    console.error("Jimp processing error:", error);
    throw new Error("Image processing failed.");
  }
}


export async function deleteLocalFiles(files) {
  for (let file of files) {
    try {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        console.log("Deleted file:", file);
      }
    } catch (error) {
      console.error("Error deleting file:", file, error);
    }
  }
}
