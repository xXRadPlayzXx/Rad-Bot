import fs from "fs"
import path from "path"
const readDir = async  (dir: string, baseFile: string): Promise<any> => {
    const files = fs.readdirSync(path.join(__dirname, dir))
    for (const file of files) {
      const stat = fs.lstatSync(path.join(__dirname, dir, file))
      if (stat.isDirectory()) {
        readDir(path.join(dir, file), baseFile)
      } else if (file !== baseFile) {
        const option = await import(path.join(__dirname, dir, file))
        return option
      }
    }
  }
export default readDir