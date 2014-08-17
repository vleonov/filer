$( function() {

    "use strict";

    var $input = $('#fileupload'),
        $list = $('#filelist');

    init();


    function init()
    {
        var $form = $input.parents('form');
        $form.attr('action', $form.attr('action'));
        $input.change(handleFiles);
        $(document).on('click', '.js-file-delete', function() {deleteFile(this)});
        $(document).on('click', '.js-file-up', function() {upFile(this)});
        $(document).on('click', '.js-file-down', function() {downFile(this)});
    }

    function handleFiles()
    {
        var iframeId;

        iframeId = uploadFiles();
        for (var i = 0; i<$input[0].files.length; i++) {
            showFile($input[0].files[i], iframeId);
        }
    }

    function uploadFiles()
    {
        var id = 'file-upload-' + Math.round(Math.random() * 1e9),
            $iframe = $('<iframe></iframe>')
                .attr('name', id)
                .attr('id', id)
                .addClass('file-iframe')
                .load(function() {afterUpload(id)})
                .appendTo($('body'));

        $input.parents('form').attr('target', id).submit();

        return id;
    }

    function afterUpload(iframeId)
    {
        var $iframe = $('#' + iframeId),
            $rows,
            response = $iframe.contents().find('result').text(),
            result = $.parseJSON(response),
            id,
            i, ci;

        if (result.length == 0) {
            $rows = $('.iframe-' + iframeId);
            $rows.addClass('file-error');
            $('<i></i>').addClass('icon-remove').appendTo($('.file-status', $rows));
        } else {
            for (i = 0, ci = result.length; i<ci; i++) {
                id = 'file-' + result[i].name.length + '-' + result[i].size + '-' + iframeId;
                $rows = $('#' + id);
                if (result[i].error !== undefined) {
                    $rows.addClass('file-error');
                    $('<i></i>').addClass('icon-remove').appendTo($('.file-status', $rows));
                } else {
                    $rows.addClass('file-success');
                    if (result[i].thumb !== undefined) {
                        $('<img/>').attr('src', result[i].thumb.url)
                            .attr('width', parseInt(result[i].thumb.width / 2))
                            .attr('height', parseInt(result[i].thumb.height / 2))
                            .appendTo($('.file-thumb', $rows));
                    }
                    $('<input/>').attr('type', 'hidden')
                        .attr('name', 'file[]')
                        .val(result[i].url)
                        .appendTo($('.file-status', $rows));
                    $('<i></i>').addClass('icon-ok').appendTo($('.file-status', $rows));
                    $('.file-name', $rows).html('<a href="' + result[i].url + '" target="_blank">' + result[i].name + '</a>');
                }
            }
        }

        $('.file-save button').addClass('btn-primary').prop('disabled', false);
        $('.file-save select').prop('disabled', false);
        $iframe.detach();
    }

    function showFile(file, iframeId)
    {
        var id = 'file-' + file.name.length + '-' + file.size + '-' + iframeId,
            $row = $('<tr></tr>').attr('id', id).appendTo($list).addClass('iframe-' + iframeId),
            $status = $('<td></td>').addClass('file-status').appendTo($row),
            $thumb = $('<td></td>').addClass('file-thumb').appendTo($row),
            $name = $('<td></td>').html(file.name).addClass('file-name').appendTo($row),
            $size = $('<td></td>').html(fileSize(file.size)).addClass('file-size').appendTo($row),
            $sort = $('<td></td>').addClass('file-sort').appendTo($row),
            $iUp = $('<i></i>').addClass('icon-arrow-up').addClass('js-file-up').attr('title', 'Move file up').appendTo($sort),
            $iDown = $('<i></i>').addClass('icon-arrow-down').addClass('js-file-down').attr('title', 'Mobe file down').appendTo($sort),
            $delete = $('<td></td>').addClass('file-delete').appendTo($row),
            $iDelete = $('<i></i>').addClass('icon-trash').addClass('js-file-delete').attr('title', 'Delete file').appendTo($delete);
    }

    function deleteFile(ele)
    {
        $(ele).parents('tr').detach();
    }

    function upFile(ele)
    {
        var $tr = $(ele).parents('tr'),
            $upper = $($tr[0].previousSibling);

        if ($upper.length) {
            $tr.insertBefore($upper);
        }
    }

    function downFile(ele)
    {
        var $tr = $(ele).parents('tr'),
            $lower = $($tr[0].nextSibling);

        if ($lower.length) {
            $tr.insertAfter($lower);
        }
    }

    function fileSize(size)
    {
        var kbyte = 1024,
            mbyte = kbyte * 1024,
            gbyte = mbyte * 1204,
            measure;

        if (size < kbyte) {
            measure = 'b';
        } else if (size < mbyte) {
            measure = 'Kb';
            size = (size / kbyte).toFixed(2);
        } else if (size < gbyte) {
            measure = 'Mb';
            size = (size / mbyte).toFixed(2);
        } else {
            measure = 'Gb';
            size = (size / gbyte).toFixed(2);
        }

        return size + measure;
    }
});
