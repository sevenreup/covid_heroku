import fs from 'fs-extra';
import path from 'path';

export default class Cacher {
    public static writedata(file: string, jsonOBJ: Object) {
        fs.outputFile(path.resolve(__dirname, '../cache/data', file), JSON.stringify(jsonOBJ, null, 2))
            .catch(error => console.log(error));
    }
}