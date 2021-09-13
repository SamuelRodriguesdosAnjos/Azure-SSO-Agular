export class ParseHelper {

    public toString(value: any): string {

        if (value) {
            return value.toString();
        }

        return value;

    }

    public toNumber(value: any): number {
        return Number(value);
    }

    public toFloat(value: any, fractionDigits?: number): number {

        if (fractionDigits) {

            value = this.toNumber(value).toFixed(fractionDigits);
            return parseFloat(value);

        } else {
            return parseFloat(value);
        }

    }

    public toArray(value: string, split: string): Array<string> {
        return value.split(split);
    }

    public toAtob(value: string): string {
        return window.atob(value);
    }

    public toBtoa(value: string): string {
        return window.btoa(value);
    }

    public toJSON(value: string): any {
        return JSON.parse(value);
    }

    public toStringify(value: any): string {
        return JSON.stringify(value);
    }

    public toFile(blob: Blob): Promise<any> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = () => resolve({ data: reader.result, size: blob.size });
            reader.onerror = error => reject(error);
        });
    }

    public toBase64(file: File): Promise<any> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve({ data: reader.result, fileName: file.name });
            reader.onerror = error => reject(error);
        });
    }

    public toRGB(colorName?: string, hex?: string): any {

        if (colorName) {

          let div = document.createElement('div');
          div.style.color = colorName;
          const color = window.getComputedStyle(div).color;
          return color;

        }

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : null;

    }

    public toHEX(colorName?: string, rgb?: string): string {

        if (colorName) {

            const rgbValue = this.toRGB(colorName);
            const hex = this.toHEX(null, rgbValue);
            return hex;

        }

        const regex = /rgb *\( *([0-9]{1,3}) *, *([0-9]{1,3}) *, *([0-9]{1,3}) *\)/;
        const values = regex.exec(rgb);

        if (values.length !== 4) {
            return rgb;
        }

        const r = Math.round(parseFloat(values[1]));
        const g = Math.round(parseFloat(values[2]));
        const b = Math.round(parseFloat(values[3]));

        return '#'
            + (r + 0x10000).toString(16).substring(3).toUpperCase()
            + (g + 0x10000).toString(16).substring(3).toUpperCase()
            + (b + 0x10000).toString(16).substring(3).toUpperCase();

    }

}
