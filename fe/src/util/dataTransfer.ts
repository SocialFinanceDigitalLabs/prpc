import { v4 as uuidv4 } from 'uuid';

export class AttachedFileSerializer {
  /**
   * A class for managing JSON with file uploads. Supports both File and FileList
   * and replaces these with a `cid:` URL and attaches the file.
   *
   * Use with the custom serialiser option JSON.stringify:
   *
   * const files = new AttachedFileSerializer();
   * const json = JSON.stringify(data, files.serializer);
   *
   */
  files: Record<string, File> = {};
  serializer = (key: string, value: unknown): any => {
    if (value instanceof File) {
      const guid = uuidv4();
      this.files[guid] = value;
      return { __type__: 'file', cid: guid };
    } else if (value instanceof FileList) {
      const fileArray = [];
      for (let i = 0; i < value.length; i++) {
        fileArray.push(value[i]);
      }
      return fileArray;
    }
    return value;
  };
  formDataAppend = (formData: FormData): void => {
    Object.keys(this.files).forEach((k) => {
      formData.append(k, this.files[k]);
    });
  };
}
