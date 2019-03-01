function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

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

function initCategories(minCount, categoryData) {
  let _categories = [];

  while (minCount != _categories.length) {
    var tempID = getRandom(0, categoryData.length);
    var temp = categoryData[tempID];

    if (_categories.length > 0) {
      if (
        _.findIndex(
          _categories,
          o => o.id == temp.id || o.category == temp.category
        ) > -1
      ) {
        continue;
      }
    }
    _categories.push(temp);
  }

  return _categories;
}

function initTable() {
  console.log("Initializing table..");
  loadJSON(
    "https://jdanque.github.io/p/pinoy-jeopardy/js/data.json",
    function(data) {
      var categories = initCategories(3, data.categories);
      let $tableHeadRow = $(".jeopardy-table").find("thead>tr");

      $.each(categories, (i, c) => {
        $tableHeadRow.append(`<td data-id="${c.id}">${c.category}</td>`);
        let questionsPerCategory = _.filter(
          data.questions,
          q => q.category_id === c.id
        );

        let prize = 100;
        $.each(questionsPerCategory, (i, q) => {
          if ($(`.jeopardy-table > tbody > tr:eq(${i})`).length == 0) {
            $(".jeopardy-table > tbody").append(`<tr></tr>`);
          }

          $(`.jeopardy-table > tbody > tr:eq(${i})`).append(
            `<td class="jeopardy-question" data-ans="${q.answer}" data-ques="${
              q.question
            }">${(i + 1) * prize}</td>`
          );
        });
      });

      console.log("Done initializing table");
    },
    function(xhr) {
      console.error(xhr);
    }
  );
}

initTable();
