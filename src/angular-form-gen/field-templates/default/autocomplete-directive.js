fg.directive('fgAutocomplete', function ($timeout, $http) {

    return {
        link: function ($scope, $element) {

            // Ensure that the ng-repeat has finished by suspending the remove.

            $timeout(function () {
                var options = $scope.$parent.fieldSchema.options;
                var id = $scope.$parent.form.data[$scope.$parent.fieldSchema.name];

                if (id != undefined && id != '') {
                    var params = [];
                    params[options.valueAttr] = id;

                    var data = {
                        method: 'GET',
                        url: options.url + '&action=find&id=' + id,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };

                    $http(data).then(
                        function (res) {
                            if (res.data.status == 'success') {
                                $scope.temp = res.data[options.dataHolder][options.nameAttr];
                            }
                        }
                    );
                }
            }, 0);
        }
    }
});
