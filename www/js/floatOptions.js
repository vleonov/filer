$( function() {

    "use strict";

    var $selects = $('.js-float-options');
    $selects.change(optionChange).each(optionChange);

    function optionChange() {

        var $select = $(this),
            selectText = $select.data('text'),
            $options = $('option', $select),
            $selected = $select.selectedIndex;

        $options.each(function(i, option) {

            var $option = $(option),
                optionText = $option.data('text'),
                selectLength = selectText.length,
                emptyText = '&hellip;';

            if (option.selected) {
                $option.text(selectText + ' ' + optionText);
            } else {
                $option.html(emptyText + ' ' + optionText);
            }
        });
    }

});