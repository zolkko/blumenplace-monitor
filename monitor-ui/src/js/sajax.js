export default {
  post: function post(url, data) {
    return new Promise(function(resolve, reject) {
      let req = new XMLHttpRequest();
      req.open("POST", url);
      req.setRequestHeader("Content-Type", "application/json; charset=utf-8")
      req.onload = function() {
        if (req.status === 200) {
          resolve(req.response);
        } else {
          reject(new Error(req.statusText));
        }
      };

      req.onerror = function() {
        reject(new Error("Network error"));
      };

      req.send(data);
    });
  }
}
