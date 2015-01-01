CKEDITOR.plugins.add( 'simpleImage', {
    icons: 'simplaeImage',
    init: function( editor ) {
        editor.addCommand( 'simpleImage', new CKEDITOR.dialogCommand( 'simpleImageDialog' ) );
        console.log(editor.ui);
        editor.ui.addButton( 'simpleImage', {
            label: 'Insert simpleImage',
            command: 'simpleImage',
            toolbar: 'insert,100'
        });
    }
});
