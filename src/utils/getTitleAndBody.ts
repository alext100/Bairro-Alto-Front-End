export default function getTitleAndBody(item: string) {
  const data = {
    title: "",
    body: "",
  };
  const parser = new DOMParser();
  const doc = parser.parseFromString(item, "text/html");
  const title = doc.getElementsByTagName("h1")[0];
  data.title = title.innerText;
  doc.body.removeChild(title);
  data.body = doc.body.innerHTML;
  return data;
}
