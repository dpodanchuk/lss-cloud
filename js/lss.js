/**
 @author Arsen A. Gutsal
 Inspired by: http://codepen.io/agutsal/pen/QGjeVa
 */
(function() {
    // let's init the plugin, that we called "highlight".
    // We will highlight the words "hello" and "world",
    // and set the input area to a widht and height of 500 and 250 respectively.
    // $("#container").lssEditor({
    //     words: ["hello", "world"]
    // });
    window.onload = function() {
        rangy.init();

        // Enable buttons
        var controls = {
            atom: undefined,
            mark1: undefined,
            mark2: undefined,
            mark3: undefined,
            mark4: undefined,
            mark5: undefined,
            mark6: undefined,
            mark7: undefined,
            mark8: undefined,
            mark9: undefined,
            mark10: undefined
        };
        
        _.each(controls, (idx, it) => {
            if(_.isUndefined(controls[it])){
                controls[it] = document.getElementById(it);
            };
            controls[it].disabled = false;
            controls[it].classApplier = rangy.createClassApplier(`${it}`, {
                tagNames: ['span']
            });
            controls[it].ontouchstart =
                controls[it].onmousedown = (e) => {
                    if(e.target.classApplier){
                        e.target.classApplier.toggleSelection();
                    }

                    var parts = document.querySelectorAll(".atom span[class^=mark]")
                    , tree = document.querySelector('.tree');
                    tree.innerHTML = '';
                    _.each(parts, (it, idx) => {
                        const cn = it.cloneNode(true);
                        cn.className += ' invisible';
                        tree.appendChild(cn);

                        ramjet.transform(it, cn);
                        setTimeout(() => {cn.className = cn.className.replace(/invisible/,'');}, 500);
                    });
                    
                    return false;
                };
        });
    };
    
})();
