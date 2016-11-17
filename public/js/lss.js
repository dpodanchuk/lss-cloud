/**
 @author Arsen A. Gutsal
 */
(function() {
    $(() => {

        const getDocumentContent = (doc, versionIdx) => {
            if(_.isUndefined(versionIdx) === false){
                return doc.versions[versionIdx];
            } else {
                return doc.content;
            }
        };
        
        $('#version-list').on('change', (e) => {
            var doc = $('#container').data('document')
            , v = $('#version-list').val();

            $('#container')
                .data('version-id', v)
                .get(0).innerHTML = getDocumentContent(doc, v);
        });
        
        $('#document-list').on('change', (e) => {
            const params = $(e.target).val()?{q:{_id:$(e.target).val()}}:{};
            $.get('/api/document/find', params, (results) => {
                if(results.length) {
                    const doc = results[0];
                    
                    $('#version-list').html('');
                    _.each(doc.versions, (it, idx) => {
                        const o = $('<option/>');
                        o.val(idx);
                        o.text(idx);
                        
                        $('#version-list').append(o);
                    });
                    
                    const v = doc.versions.length?$('#version-list').val():undefined;

                    console.log(v);
                    $('#container')
                        .data('document', doc)
                        .data('document-id', doc._id)
                        .data('version-id', v)
                        .get(0).innerHTML = getDocumentContent(doc, v);
                };
            });
        });
        
        $('#saveChanges').on('click', (e) => {
            var body = {};
            // $('.tree > span').each((idx, it) => {
            //     body[$(it).attr('class')] = $(it).text();
            // });

            body = JSON.stringify({
                versions: [
                    $('#container').html()
                ]
            });

            const _id = $('#container').data('document-id');
            console.log(body);


	$.ajax({
	    method: 'POST',
	    url: `/api/document/update/${_id}`,
            contentType: 'application/json',
            dataType: 'json',
	    data: body,
	    success: (data, textStatus) => {
                console.log(data, textStatus);
	    },
            error: (err) => {
                console.log(err);
            }
	});
            
        });
        
        $.get('/api/document/find', (result) => {
            _.each(result, (it, idx) => {
                const o = $('<option/>');
                o.attr('value', it._id);
                o.text(it.title);
                $('#document-list').append(o);
            });
            $('#document-list').trigger('change');
        });
    });
    
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
                tagNames: ['span'],
                onElementCreate: (el, classApplier) => {
                    console.log(rangy.getSelection().rangeCount);
                    $(el).data('range', rangy.getSelection().getRangeAt(0));
                }               
            });
            controls[it].ontouchstart =
                controls[it].onmousedown = (e) => {
                    if(e.target.classApplier){
                        e.target.classApplier.toggleSelection();
                    }

                    var parts = document.querySelectorAll(".atom span[class^=mark]")
                    , tree = $('.tree');
                    tree.html('');
                    _.each(parts, (it, idx) => {
                        const cn = $(it).clone();
                        cn.addClass('invisible');
                        cn.data('range', parts);
                        tree.append(cn);

                        ramjet.transform(it, cn.get(0));
                        setTimeout(() => {cn.removeClass('invisible')}, 500);
                    });
                    
                    return false;
                };
        });
    };
    
})();

