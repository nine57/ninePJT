$(document).ready(function () {
  $(".upload-btn").on("click", function (e) {
    e.preventDefault();
    const popupContainer = $(".popup-container");
    popupContainer.addClass("active");
  });

  $(".submit-btn").on("click", function (e) {
    e.preventDefault();
    const popupContainer = $(".popup-container");
    popupContainer.removeClass("active");
  });

  $("#add-person").on("click", function (e) {
    var selectedOptions = [];
    $(".select-box option:selected").each(function () {
      selectedOptions.push($(this).text());
    });
    $("#selected-options").empty();
    selectedOptions.forEach(function (optionText) {
      var appendItem = "<div class='select-person'>" + optionText + "</div>";
      $("#selected-options").append(appendItem);
    });
    $("#selected-options-input").val(selectedOptions.join(","));
  });
});
