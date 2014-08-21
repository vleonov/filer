$(document).ready(
    function() {
        Gallery.init();
    }
);
var Gallery = {

    $modal: null,
    $img: null,
    $a: null,
    $cPrev: null,
    $cNext: null,
    $cClose: null,
    cSize: 0,
    padding: 20,
    isOpened: false,
    $aCurrent: null,
    pnCnt: 5,
    $aNext: [],
    $aPrev: [],
    timer: null,
    delay: 10,
    historyHack: false,

    init: function()
    {
        var matches,
            $a;

        $('a.c-gallery').click(
            function() {
                return Gallery.show(this);
            }
        );

        this.$modal = $('.modal');
        this.$img = $('img', this.$modal);
        this.$a = $('a', this.$modal);

        this.$cPrev = $('.c-gallery-prev');
        this.$cNext = $('.c-gallery-next');
        this.$cClose = $('.c-gallery-close');

        this.$cPrev.click(function() {
            Gallery._delay(function(){Gallery.prev()});
        });
        this.$cPrev.dblclick(function() {
            Gallery._cancelDelay();
            Gallery.fprev()
        });

        this.$cNext.click(function() {
            Gallery._delay(function(){Gallery.next()});
        });
        this.$cNext.dblclick(function() {
            Gallery._cancelDelay();
            Gallery.fnext()
        });

        this.$cClose.click(function() {
            Gallery.close();
        });

        this.cSize = $('div', this.$cPrev).outerHeight();

        window.addEventListener('popstate', function(e){
            Gallery.historyListen();
        }, false);
        this.historyListen(true);
    },

    show: function(a)
    {
        var $a = $(a),
            preview = $a.attr('data-preview');

        if (preview === undefined) {
            return true;
        }

        this.$img.attr('src', preview);
        this.$a.attr('href', $a.attr('href'));
        this.$modal.modal();
        this.isOpened = true;

        img = new Image();
        img.src = preview;
        img.onload = function() {
          Gallery._resize(this.width, this.height);
        }

        this.$aCurrent = $a;

        this._definePN();
        this._preShow();
        this._historyAdd();

        return false;
    },

    _resize: function(iWidth, iHeight)
    {
        var wWidth = $(window).innerWidth(),
            wHeight = $(window).innerHeight(),
            ipWidth = iWidth+this.padding*2,
            ipHeight = iHeight+this.padding*2,
            width,
            height,
            wDiff,
            hDiff,
            top,
            left,
            cSize,
            cMarginV,
            cMarginHP,
            cMarginHN;

        if (ipWidth > wWidth || ipHeight > wHeight) {
            wDiff = ipWidth / wWidth;
            hDiff = ipHeight / wHeight;
            if (wDiff > hDiff) {
                width = wWidth - this.padding*2;
                height = iHeight * (width / iWidth);
            } else {
                height = wHeight - this.padding*2;
                width = iWidth * (height / iHeight);
            }
        } else {
            width = iWidth;
            height = iHeight;
        }

        top = (wHeight-height)/2 - this.padding;
        left = (wWidth-width)/2 - this.padding;

        this.$modal.css(
            {
                'width': width+'px',
                'height': height+'px',
                'margin': this.padding+'px',
                'top': top+'px',
                'left': left+'px'
            }
        );

        cMarginV = (this.padding+height/2-this.cSize/2) + 'px ';
        cMarginHP = Math.max(0, (left/2-this.cSize/2)) + 'px ';
        cMarginHN = (left/2-this.cSize/2) + 'px ';

        this.$cPrev.css(
            {
                'top': top+'px',
                'width': left+this.padding+'px',
                'height': height+this.padding*2+'px'
            }
        );
        $('div', this.$cPrev).css('margin', cMarginV + '0 ' + cMarginV + cMarginHP);

        this.$cNext.css(
            {
                'top': top+'px',
                'width': left+this.padding+'px',
                'height': height+this.padding*2+'px'
            }
        );
        $('div', this.$cNext).css('margin', cMarginV + '0 ' + cMarginV + cMarginHN);

    },

    close: function()
    {
        if (this.isOpened) {
            this.$modal.modal('hide');
            this.$img.attr('src', '');
            this.$a.attr('href', '');
            this.isOpened = false;
            return false;
        }

        return true;
    },

    next: function()
    {
        if (this.isOpened && this.$aNext.length) {
            this.show(this.$aNext.shift());
            return false;
        }

        return true;
    },

    fnext: function()
    {
        if (this.isOpened && this.$aNext.length) {
            this.show(this.$aNext.pop());
            return false;
        }

        return true;
    },

    prev: function()
    {
        if (this.isOpened && this.$aPrev.length) {
            this.show(this.$aPrev.shift());
            return false;
        }

        return true;
    },

    fprev: function()
    {
        if (this.isOpened && this.$aPrev.length) {
            this.show(this.$aPrev.pop());
            return false;
        }

        return true;
    },

    _definePN: function()
    {
        this.$aNext = [];
        this.$aPrev = [];

        var $pNext = this.$aCurrent.parent(),
            $pPrev = this.$aCurrent.parent(),
            $next, $prev,
            i;

        for (i = 0; i<this.pnCnt; i++) {
            $next = $('a', $pNext.next());
            if ($next.length) {
                this.$aNext.push($next);
                $pNext = $next.parent();
            }

            $prev = $('a', $pPrev.prev());
            if ($prev.length) {
                this.$aPrev.push($prev);
                $pPrev = $prev.parent();
            }
        }
    },

    _preShow: function()
    {
        var $next = this.$aNext[0] !== undefined ? this.$aNext[0] : null,
            preview;

        if ($next) {
            preview = $next.attr('data-preview');
            if (preview) {
                img = new Image();
                img.src = preview;
            }
        }
    },

    _historyAdd: function()
    {
        this.historyHack = true;
        location = location.pathname + '#gallery' + this.$aCurrent.attr('data-i');
    },

    historyListen: function(isInit)
    {
        var isInit = isInit || false;

        if (this.historyHack) {
            return;
        } else if (!(matches = location.hash.match(/^#gallery(\d+)/))) {
            this.close();
            return;
        }

        this.historyHack = false;
        $a = $('a.c-gallery[data-i|=' + matches[1] + ']');
        if ($a.length) {
            this.show($a);
        }
    },

    _delay: function(callback)
    {
        this._cancelDelay();
        this.timer = setTimeout(callback, this.delay);
    },

    _cancelDelay: function()
    {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}