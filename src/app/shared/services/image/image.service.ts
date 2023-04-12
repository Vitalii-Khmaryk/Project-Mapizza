import { Injectable } from '@angular/core';
import { deleteObject, getDownloadURL, percentage, ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
@Injectable({
  providedIn: 'root'
})
export class ImageService {
  public uploadPercent = 0;

  constructor(
    private storage: Storage
  ) { }

  async uploadFile(folder: string, name: string, file: File | null): Promise<string> {
    const path = `${folder}/${name}`;
    let url = '';
    if (file) {
      try {
        const storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef, file);
        percentage(task).subscribe(data => {
          this.uploadPercent = data.progress;
        });
        await task;
        url = await getDownloadURL(storageRef);
      } catch (error: any) {
        console.error(error);
      }
    } else {
      console.log('wrong file');
    }
    return Promise.resolve(url);
  }

  deleteUploadFile(imagePath: string): Promise<void> {
    const task = ref(this.storage, imagePath);
    return deleteObject(task);
  }
}
