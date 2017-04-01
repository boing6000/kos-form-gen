fg.directive('fgFieldUpload', function () {
    return {
        restrict: 'E',
        scope: {
            url: '='
        },
        require: '^ngModel',
        templateUrl: 'angular-form-gen/form/field/upload.ng.html',
        link: function (scope, element, attrs, ngModel) {
            var dlg = new XPROFileDialog({
                url: scope.url,
                onSelect: function (data) {
                    ngModel.$setViewValue(data.context.file);
                    ngModel.$render();

                    scope.hasModel = true;
                    scope.hasImage = false;

                    switch (data.context.ext) {
                        case 'jpg':
                        case 'png':
                        case 'jpeg':
                            scope.preview(data);
                            break;
                    }
                }
            });
            scope.hasModel = false;
            scope.hasimage = false;
            scope.uploadStr = scope.hasModel ? 'Trocar' : 'Buscar';

            ngModel.$render = function () {
                element.find('input').val(ngModel.$viewValue);
            };

            scope.clear = function(){
                ngModel.$setViewValue('');
                ngModel.$render();
                scope.hasModel = false;
                scope.hasimage = false;

                element.find('.image-preview').popover('destroy');

            };

            scope.upload = function(){
                dlg.open();
            };

            scope.preview = function(data){

                element.find('.image-preview').popover({
                    trigger: 'hover',
                    html:true,
                    title: "<strong>Preview</strong>",
                    content: "",
                    placement:'auto'
                });

                // scope.hasImage = true;

                var img = $('<img/>', {
                    width:250,
                    height:200
                });

                img.attr('src', data.url);
                element.find(".image-preview").attr("data-content",angular.element(img)[0].outerHTML).popover('show');

            };

        }
    };
});