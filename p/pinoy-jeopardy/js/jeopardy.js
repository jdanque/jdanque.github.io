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

function initTable() {
  //   var category = JSON.parse(data);
  loadJSON(
    "https://raw.githubusercontent.com/jdanque/jdanque.github.io/master/p/pinoy-jeopardy/js/data.json",
    function(data) {
      console.log(data);
    },
    function(xhr) {
      console.error(xhr);
    }
  );
}

loadCategory();
