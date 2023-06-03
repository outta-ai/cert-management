export function dataURItoUint8Array(dataURI: string) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  let byteString = "";
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(dataURI.split(",")[1]);
  else byteString = decodeURIComponent(dataURI.split(",")[1]);

  // separate out the mime component
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to a typed array
  const array = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    array[i] = byteString.charCodeAt(i);
  }

  return {
    data: array,
    mime: mimeString,
  };
}
