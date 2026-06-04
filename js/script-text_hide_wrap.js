<script src="js/jquery.min.js"></script>
(function($) {

    $.fn.iComputerSlide = function(options) {

        options = $.extend({
            height: 200,
            btnClose: "Close",
            btnOpen: "Open"
        }, options);

        makeWrap = function($element, options) {
            return '<div class="io_item">' +
                '<div class="io_item_wrap" style="max-height:' + options.height + 'px">' + $element[0].outerHTML +
                '<div class="io_trans"></div>' +
                '</div>' +
                '<div class="io_button_wrap">' +
                '<a class="io_button btn_close">' + options.btnClose + '</a>' +
                '<a class="io_button btn_open">' + options.btnOpen + '</a>' +
                '</div>' +
                '</div>';
        };

        $(document).on("click", ".io_button", function() {
            $(this).parents(".io_item").toggleClass("open");
        });

        return this.each(function() {
            var $element = $(this);
            $element.replaceWith(makeWrap($element, options));
        });
    };
})(jQuery);

$(function() {

    $(".item_text").iComputerSlide({
        height: 150,
        btnClose: "Свернуть",
        btnOpen: "Читать"
    });
});
