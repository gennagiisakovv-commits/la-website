
Spry.Utils.addLoadListener(function() {

// http://usefulscript.ru/current_time_new.php
// Добавлены в HTML строки 78-80
function clock() {
  var d = new Date();
  var day = d.getDate();
  var hours = d.getHours();
  var minutes = d.getMinutes();
  var seconds = d.getSeconds();

  month = new Array(
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря"
  );
  days = new Array(
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота"
  );

  if (day <= 9) day = "0" + day;
  if (hours <= 9) hours = "0" + hours;
  if (minutes <= 9) minutes = "0" + minutes;
  if (seconds <= 9) seconds = "0" + seconds;

  date_date =
    day +
    " " +
    month[d.getMonth()] +
    " " +
    d.getFullYear() +
    " г. (" +
    days[d.getDay()] +
    ")";
  date_time = hours + ":" + minutes + ":" + seconds;

  if (document.layers) {
    document.layers.date.document.write(date_time);
    document.layers.date.document.close();
    document.layers.time.document.write(date_time);
    document.layers.time.document.close();
  } else {
    document.getElementById("date").innerHTML = date_date;
    document.getElementById("time").innerHTML = date_time;
  }
  setTimeout("clock()", 1000);
}
clock();



(function ($) {
  $.fn.iComputerSlide = function (options) {
    options = $.extend(
      {
        height: 200,
        btnClose: "Close",
        btnOpen: "Open",
      },
      options
    );

    makeWrap = function ($element, options) {
      return (
        '<div class="io_item">' +
        '<div class="io_item_wrap" style="max-height:' +
        options.height +
        'px">' +
        $element[0].outerHTML +
        '<div class="io_trans"></div>' +
        "</div>" +
        '<div class="io_button_wrap">' +
        '<a class="io_button btn_close">' +
        options.btnClose +
        "</a>" +
        '<a class="io_button btn_open">' +
        options.btnOpen +
        "</a>" +
        "</div>" +
        "</div>"
      );
    };

    $(document).on("click", ".io_button", function () {
      $(this).parents(".io_item").toggleClass("open");
    });

    return this.each(function () {
      var $element = $(this);
      $element.replaceWith(makeWrap($element, options));
    });
  };
})(jQuery);

$(function () {
  $(".item_text").iComputerSlide({
    height: 150,
    btnClose: "Свернуть",
    btnOpen: "Читать больше",
  });
});



$(document).ready(function () {
  $.fn.animate_Text = function () {
    var string = this.text();
    return this.each(function () {
      var $this = $(this);
      $this.html(string.replace(/./g, '<span class="new">$&</span>'));
      $this.find("span.new").each(function (i, el) {
        setTimeout(function () {
          $(el).addClass("div_opacity");
        }, 20 * i);
      });
    });
  };
  $("#example").show();
  $("#example").animate_Text();
});


});
