/* eslint-disable consistent-return */
/* eslint-disable no-multi-assign */
/* eslint-disable no-underscore-dangle */
import axios from "axios";

export default class UploadAdapter {
  constructor(loader) {
    this.loader = loader;
    this.url = process.env.VUE_APP_IMAGE_UPLOAD_URL;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);

          const formData = new FormData();
          formData.append("images", file, file.name);

          axios({
            method: "POST",
            url: this.url,
            data: formData,
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }).then((response) => {
            resolve({ 360: response.data });
          });
        })
    );
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());

    xhr.open("POST", this.url, true);
    xhr.setRequestHeader("Authorization", `Bearer ${localStorage.getItem("token")}`);
    xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.responseType = "json";
  }

  _initListeners(resolve, reject, file) {
    const { xhr } = this;
    const { loader } = this;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;

    xhr.addEventListener("error", () => reject(genericErrorText));
    xhr.addEventListener("abort", () => reject());
    xhr.addEventListener("load", () => {
      const { response } = xhr;

      if (!response || response.error) {
        return reject(response && response.error ? response.error.message : genericErrorText);
      }

      resolve({
        default: response.url,
      });
    });

    if (xhr.upload) {
      xhr.upload.addEventListener("progress", (evt) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }
}
