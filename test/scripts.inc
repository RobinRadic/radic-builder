

<script src="jquery.js"></script>



<script>
    var code = $('pre code');
   // code.html(code.html().replace("\n", ""));

    function line(txt, type){

        var types = {
            ok: 'check',
            warning: 'warning',
            error: 'close',
            info: 'info-circle'
        };

        var txtclass = '';
        if(typeof type === 'undefined'){
            txtclass = 'class="header"';
        }

        $('body').append('<div class="bullet"><i class="fa fa-' + types[type] + '">&nbsp;</i><span '+txtclass+'>' + txt + '</span></div>');
    }

    function error(txt){
        line(txt, 'error');
    }
    function ok(txt){
        line(txt, 'ok');
    }
    function warning(txt){
        line(txt, 'warning');
    }
    function info(txt){
        line(txt, 'info');
    }
    function header(txt){
        line(txt);
    }

    function output(inp) {
        document.body.appendChild(document.createElement('pre')).innerHTML = inp;
    }

    function syntaxHighlight(json) {
        console.log('typeof json', typeof json);
        json = typeof json === 'object' ? JSON.stringify(json, undefined, 4) : json;
        json = json.replace(/&/g, '&').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }


            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    var obj = {a:1, 'b':'foo', c:[false,'false',null, 'null', {d:{e:1.3e5,f:'1.3e5'}}]};
    var str = JSON.stringify(obj, undefined, 4);


    ///output(str);

    function showcode(txt){
        output(syntaxHighlight(txt));
    }
    function showscript(id){
        showcode(unescape($('#' + id).html()));
    }
    /*
     line('jQuery loaded');
     line('sadf', 'error');
     line('sadf', 'ok');
     line('asdf', 'warning');
     line('asdf', 'info');
     */
</script>

