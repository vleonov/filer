{extends file='layout.tpl'}

{block "js"}
    <script language="JavaScript" src="js/filer.js"></script>
    <script language="JavaScript" src="js/floatOptions.js"></script>
{/block}

{block "css"}
    <link href="css/floatOptions.css" rel="stylesheet">
{/block}

{block "content"}

    <div class="file-uploader">
        <div class="file-input">
            <div class="btn btn-success btn-large">
                <i class="icon-plus icon-white"></i>
                Add files...
            </div>
            <form action="upload/{$huid}" method="post" enctype="multipart/form-data">
                <input id="fileupload" type="file" name="files[]" multiple="multiple">
            </form>
        </div>
        <div class="file-save">
            <form action="/upload/{$huid}/save" method="post">
                <select name="ttl" id="fileupload-ttl" class="select-large js-float-options" disabled="disabled" data-text="Store for">
                    <option value="ff" data-text="ten minutes">Store for ten minutes</option>
                    <option value="ff" data-text="one hour">          one hour</option>
                    <option value="ff" data-text="one day">          one day</option>
                    <option value="ff" data-text="one week">          one week</option>
                    <option value="ff" data-text="one month">          one month</option>
                </select>
                <button id="fileupload-save" type="submit" class="btn btn-large" disabled="disabled">
                    Upload
                </button>
            </form>
        </div>
        <table id="filelist" class="file-list"></table>
    </div>
{/block}