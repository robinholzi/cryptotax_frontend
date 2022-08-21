
export const insertUrlParam = (key: string, value: string) => {
  if (window.history.pushState) {
      let searchParams = new URLSearchParams(window.location.search);
      searchParams.set(key, value);
      let newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + searchParams.toString();
      window.history.pushState({path: newurl}, '', newurl);
  }
}
// old logic: 
// var searchParams = new URLSearchParams(window.location.search);
// searchParams.set("tt", tab);
// window.location.search = searchParams.toString();

// to remove the specific key
export const removeUrlParameter = (paramKey: string) => {
  const url = window.location.href;
  console.log("url", url);
  var r = new URL(url);
  r.searchParams.delete(paramKey);
  const newUrl = r.href;
  console.log("r.href", newUrl);
  window.history.pushState({ path: newUrl }, '', newUrl);
}