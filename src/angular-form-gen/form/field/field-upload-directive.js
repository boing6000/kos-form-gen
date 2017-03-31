fg.directive('fgFieldUpload', function() {
    return {
        scope: {
            fgFieldUpload: '='
        },
        link: function(scope, element, attrs){
            var dlg = new XPROFileDialog({
                url: attrs['url'],
                onSelect: function (data) {
                    scope.fgFieldUpload(data.url);
                }
            });

            element.on('click', function () {
                dlg.open();
            });
        }
    };
});