{extends file='layout.tpl'}

{block "css"}
    <link href="css/gallery.css" rel="stylesheet">
{/block}

{block "js"}
    <script language="JavaScript" src="js/gallery.js"></script>
    <script language="JavaScript" src="js/controls.js"></script>
{/block}


{block "content"}

    {if $isImageOnly}

        {if $isPhotoOnly && $fileList|count == 1}
            <div class="file-alone-photo">
                <a href="{$fileList[0].url}" target="_blank">
                    <img src="{$fileList[0].previewUrl}" alt=""/>
                </a>
            </div>
        {else}
            {foreach $fileList as $i=>$file}
                <div class="file-photo">
                    <a class="c-gallery" name="gallery{$i}" href="{$file.url}" target="_blank" data-preview="{$file.previewUrl}" data-i="{$i}">
                        <img src="{$file.thumbUrl}"/>
                    </a>
                </div>
            {/foreach}

            <div class="modal hide">
                <div class="c-gallery-prev">
                    <div>
                        <i class="icon-arrow-left icon-white"></i>
                    </div>
                </div>
                <a target="_blank"><img src=""></a>
                <div class="c-gallery-next">
                    <div>
                        <i class="icon-arrow-right icon-white"></i>
                    </div>
                </div>
                <div class="c-gallery-close">
                    <div>
                        <i class="icon-remove icon-white"></i>
                    </div>
                </div>
            </div>
        {/if}

    {else}

        <table class="file-list">
            {foreach $fileList as $file}
                <tr>
                    <td class="file-name">
                        <a href="{$file.url}" target="_blank">{$file.name}</a>
                    </td>
                    <td class="file-size">{$file.size|size}</td>
                </tr>
            {/foreach}
        </table>

    {/if}

{/block}