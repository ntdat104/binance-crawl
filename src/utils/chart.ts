export const closeLegend = () => {
  const iframe = document?.getElementsByTagName("iframe")[0] as any;
  iframe?.contentWindow?.document
    ?.querySelector("div[data-name=legend] > div:last-child > div:first-child")
    .click();
};

export const getParameterByName = (name: string) => {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null
    ? ""
    : decodeURIComponent(results[1].replace(/\+/g, " "));
};

export const fetchNews = async () => {
  const response = await fetch(
    "https://demo-feed-data.tradingview.com/tv_news"
  );
  const xml = await response.text();
  const parser = new DOMParser();
  const dom = parser.parseFromString(xml, "application/xml");
  const items = dom.querySelectorAll("item");

  return Array.from(items).map((item) => {
    const title = item.querySelector("title")?.textContent;
    const link = item.querySelector("link")?.textContent;
    // const description =
    //   item.querySelector("description")?.textContent ?? "";
    const pubDate = item.querySelector("pubDate")?.textContent as any;
    const contentNode = Array.from(item.childNodes).find(
      (el: any) => el.tagName === "content:encoded"
    );
    let decodedContent = "";
    if (contentNode) {
      const tempElement = document.createElement("div");
      tempElement.innerHTML = contentNode.textContent ?? "";
      decodedContent = tempElement.innerText;
    }
    return {
      // fullDescription: decodedContent,
      link,
      published: new Date(pubDate).valueOf(),
      shortDescription: decodedContent
        ? decodedContent.slice(0, 150) + "..."
        : "",
      source: "TradingView",
      title,
    };
  });
};
