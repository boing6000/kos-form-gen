fg.directive('fgFieldUpload', function() {
    return {
        scope: {
            fgFieldUpload: '='
        },
        link: function(scope, element, attrs){
            element.on('click', function () {
                var dlg = new XPROFileDialog({
                    url: attrs['url'],
                    onSelect: function (data) {
                        scope.fgFieldUpload(data.url);
                    }
                });
            });
        }
    };
});