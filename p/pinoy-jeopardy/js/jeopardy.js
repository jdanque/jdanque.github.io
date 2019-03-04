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
      var categories = initCategories(5, data.categories);
      let $tableHeadRow = $(".jeopardy-table").find("thead>tr");

      $.each(categories, (i, c) => {
        $tableHeadRow.append(
          `<td data-id="${c.id}" data-category="${c.category}">${
            c.category
          }</td>`
        );
        let questionsPerCategory = _.filter(
          data.questions,
          q => q.category_id === c.id
        );

        let prize = 100;
        $.each(questionsPerCategory, (i, q) => {
          if ($(`.jeopardy-table > tbody > tr:eq(${i})`).length == 0) {
            $(".jeopardy-table > tbody").append(`<tr></tr>`);
          }
          var currentPrize = (i + 1) * prize;
          $(`.jeopardy-table > tbody > tr:eq(${i})`).append(
            `<td class="jeopardy-question" data-prize="${currentPrize}" data-ans="${
              q.answer
            }" data-ques="${q.question}">${currentPrize}</td>`
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

function initClickQuestionHandler() {
  $("body").on("click", "button.show-answer", e => {
    $(
      ".jeopardy-question-window .jeopardy-question-window--answer"
    ).slideDown();
    $(e.target).hide();
    $(".jeopardy-question-window").on("click.closeonce", () => {
      $(".jeopardy-question-window").dialog("close");
    });
  });

  $("body").on("click", ".jeopardy-question", e => {
    var $this = $(e.target);

    var category = $(`.jeopardy-table thead>tr>td:eq(${$this.index()})`).attr(
      "data-category"
    );

    $(".jeopardy-question-window .jeopardy-question-window--question").html(
      $this.attr("data-ques")
    );

    $(".jeopardy-question-window .jeopardy-question-window--answer").html(
      $this.attr("data-ans")
    );

    $(".jeopardy-question-window").dialog({
      title: `${category} for ${$this.attr("data-prize")}`,
      width: $(window).width() - 10,
      height: $(window).height() - 50,
      position: { my: "left top", at: "left top" },
      classes: {
        "ui-dialog": "jeopardy-background"
      },
      show: {
        effect: "scale",
        duration: 200
      },
      hide: {
        effect: "clip",
        duration: 200
      },
      close: (event, ui) => {
        $(
          ".jeopardy-question-window .jeopardy-question-window--answer"
        ).slideUp();
        $(".jeopardy-question-window button.show-answer").show();
        $(".jeopardy-question-window").off("click.closeonce");
      }
    });
  });
}

$(document).ready(() => {
  initTable();
  initClickQuestionHandler();
});
