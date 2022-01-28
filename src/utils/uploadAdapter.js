/* eslint-disable consistent-return */
/* eslint-disable no-multi-assign */
/* eslint-disable no-underscore-dangle */
import axios from "axios";

export default class UploadAdapter {
  constructor(loader) {
    // The file loader instance to use during the upload.
    this.loader = loader;
    this.url = process.env.VUE_APP_IMAGE_UPLOAD_URL;
  }

  // Starts the upload process.
  upload() {
    return this.loader.file.then(
      (file) =>
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        new Promise((resolve, reject) => {
          const formData = new FormData();
          const config = {
            headers: {
              "content-type": "application/x-www-form-urlencoded",
              accept: "multipart/form-data",
            },
          };

          formData.append("images", file, file.name);

          axios({
            method: "POST",
            url: this.url,
            data: formData,
            ...config,
          }).then((response) => {
            resolve({ 360: response.data });
          });
        })
    );
  }

  // Aborts the upload process.
  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  // Initializes the XMLHttpRequest object using the URL passed to the constructor.
  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());
    xhr.open("POST", this.url, true);
    debugger;
    xhr.setRequestHeader("Authorization", `Bearer ${localStorage.getItem("token")}`);
    xhr.setRequestHeader("Content-Type", `multipart/form-data`);

    xhr.responseType = "json";
  }

  // Initializes XMLHttpRequest listeners.
  _initListeners(resolve, reject, file) {
    const { xhr } = this;
    const { loader } = this;
    const genericErrorText = `Couldn't upload file: ${file.name}.`;

    //
    // xhr.addEventListener( 'error', () => reject( genericErrorText ) );
    // xhr.addEventListener( 'abort', () => reject() );
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

  // Prepares the data and sends the request.
  _sendRequest(file) {
    // Prepare the form data.
    const data = new FormData();

    data.append("media", file);

    // Send the request.
    this.xhr.send(data);
  }
}
