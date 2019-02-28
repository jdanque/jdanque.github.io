function loadJSON(path, success, error) {
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        if (success) success(JSON.parse(xhr.responseText));
      } else {
        if (error) error(xhr);
      }
    }
  };
  xhr.open("GET", path, true);
  xhr.send();
}

function loadCategory() {
  //   var category = JSON.parse(data);
  loadJSON(
    "https://jdanque.github.io/p/pinoy-jeopardy/data.json",
    function(data) {
      console.log(data);
    },
    function(xhr) {
      console.error(xhr);
    }
  );
}

loadCategory();
