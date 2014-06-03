$(document).ready(
    function() {
        Control.init();
    }
);

var Control = {

    init: function()
    {
        $(document).keydown(function(e) {
            return Control.keyDown(e);
        }).keyup(function(e) {
            return Control.keyUp(e);
        });

        $('.c-check').click(function() {
            return Control.check(this);
        });

        $('.c-bulk-check').click(function() {
            return Control.bulkCheck(this);
        })

    },

    keyDown: function(event)
    {

        if (event.altKey || event.ctrlKey || event.shiftKey) {
            return true;
        }

        switch (event.keyCode) {
            case 27: // esc
                return Gallery.close();
            case 37: // left
            case 38: // up
                return Gallery.prev();
            case 39: // right
            case 40: // down
                return Gallery.next();
            case 33: // pgup
                return Gallery.fprev();
            case 34: // pgdown
                return Gallery.fnext();
        }

        return true;
    },

    keyUp: function(event)
    {
        switch (event.keyCode) {
            case 17: // ctrl
                return PhotoControls.toggle();
        }
    },

    check: function(c)
    {
        var $c = $(c),
            $checkbox = $('.e-check', $c),
            isChecked = $checkbox.val() > 0 ? true : false;

        if (!$checkbox.length) {
            return true;
        }

        if (!isChecked) {
            $checkbox.val('1');
            $c.addClass('m-checked');
        } else {
            $checkbox.val('0');
            $c.removeClass('m-checked');
        }

        return false;
    },

    bulkCheck: function(c)
    {
        var $c = $(c),
            selector = $c.attr('data-check'),
            isCheck,
            $checks,
            $checkboxes;

        if (!selector) {
            return false;
        }

        if ($c.hasClass('v-all')) {
            isCheck = true;
        } else if ($c.hasClass('v-zero')) {
            isCheck = false;
        } else {
            return false;
        }

        $checks = $(selector + ' .c-check');
        $checkboxes = $('.e-check', $checks);

        if (isCheck) {
            $checks.addClass('m-checked');
            $checkboxes.val('1');
        } else {
            $checks.removeClass('m-checked');
            $checkboxes.val('0');
        }

        console.log($checks.length);
    }
}