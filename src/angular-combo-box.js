(function(){
    "use strict";

    angular.module("angularComboBox.tpl", [])
        .run(["$templateCache", function($templateCache){
            $templateCache.put("templates/angular-combo-box.tpl.html",
                "<div id=\"open-dropdown\"uib-dropdown uib-keyboard-nav is-open=\"isToggled\">"+
                "   <div class=\"input-group\">"+
                "       <input class=\"form-control\" autocomplete=\"off\" type=\"text\" ng-model=\"bindVal\" dropdown-display id=\"inputForCombo\">"+
                "       <span class=\"input-group-btn\" id=\"buttonForCombo\">"+
                "           <button class=\"btn btn-default\" style=\"background-color: white\" id=\"combo-button\">"+
                "               <span class=\"caret\"></span>"+
                "           </button>"+
                "       </span>"+
                "   </div>"+
                "   <ul class=\"uib-dropdown-menu\" style=\"margin: 0px;padding:0px;max-height: 134px;overflow-y: auto\" ng-style={'width':widthOfDropdown} role=\"menu\" aria-labelledby=\"combo-button\" id=\"comboDropDown\">"+
                "       <li ng-repeat=\"op in options | comboFilter:bindVal:config.optionLabel\" role=\"menuitem\">"+
                "           <a href=\"\" ng-click=\"onSelect(op)\">{{op[config.optionLabel]}}</a>"+
                "       </li>"+
                "   </ul>"+
                "</div>"
            );
        }]);

    var angularComboBox = angular.module("angularComboBox", ["angularComboBox.tpl", "ui.bootstrap"]);

    angularComboBox.directive("comboBox", [function (){
        return{
            restrict:'E',
            templateUrl:'templates/angular-combo-box.tpl.html',
            scope:{
                bindVal:'=ngModel',
                options:'=',
                config:'=',
                parentId:'@'
            },
            link:function(scope, ele, attrs){
                scope.isToggled = false;

                var inputElement = angular.element('#inputForCombo');
                var buttonForCombo = angular.element('#buttonForCombo');

                scope.widthOfDropdown = inputElement.width()+ 28 + 'px';

                scope.onSelect = function(selOption){
                    scope.bindVal=selOption;
                    scope.isToggled = false;
                };

                scope.$watch(function(){
                    return inputElement.width();
                }, function(newVal, oldVal){
                    scope.widthOfDropdown = inputElement.width()+ 28 + 'px';
                });

                if(scope.parentId){
                    var parentId= '#' + scope.parentId;
                    var parentElement = angular.element(parentId);
                    scope.$watch(function(){
                        return inputElement.offset().top;
                    }, function(newVal, oldVal){
                        var inputHeight = (inputElement.offset().top - parentElement.offset().top) + inputElement.height();
                        var bottomHeight = parentElement.height() - inputHeight;
                        if(bottomHeight < 134){
                            angular.element('#comboDropDown').addClass('combobox-dropup');
                        }else{
                            angular.element('#comboDropDown').removeClass('combobox-dropup');
                        }
                    });
                }

                scope.$watch('bindVal', function(newVal, oldVal){
                    if(newVal!== oldVal) {
                        if (angular.isDefined(attrs.ngChange)) {
                            scope.$parent.$eval(attrs.ngChange);
                        }
                    }
                });

                buttonForCombo.on('click', function(){
                    scope.isToggled = !scope.isToggled;
                    if(scope.isToggled){
                        angular.element('#open-dropdown').addClass("open");
                    }else{
                        angular.element('#open-dropdown').removeClass("open");
                    }

                });

                inputElement.on('click', function(){
                    scope.isToggled = !scope.isToggled;
                    if(scope.isToggled){
                        angular.element('#open-dropdown').addClass("open");
                    }else{
                        angular.element('#open-dropdown').removeClass("open");
                    }
                });

                inputElement.on('keyup', function(){
                    scope.isToggled = true;
                    if(scope.isToggled){
                        angular.element('#open-dropdown').addClass("open");
                    }else{
                        angular.element('#open-dropdown').removeClass("open");
                    }
                });

                scope.$watch('isToggled', function(){
                    if(scope.isToggled){
                        angular.element('#comboDropDown').addClass("open");
                    }else{
                        angular.element('#comboDropDown').removeClass("open");
                    }
                });

            }
        };
    }]);

    angularComboBox.directive('dropdownDisplay', [function(){
        return {
            restrict:'A',
            require:'ngModel',
            link: function(scope, ele, attrs, ngModelCtrl){

                ngModelCtrl.$parsers.push(function(viewVal){
                    return viewVal;
                });

                ngModelCtrl.$formatters.push(function(modelVal){
                    if(angular.isDefined(modelVal) && modelVal!==null && typeof modelVal === 'object'){
                        return modelVal[scope.config.optionLabel];
                    }
                    return modelVal;
                });
            }
        };
    }]);


    angularComboBox.filter('comboFilter', function(){
        return function (input, filterText, key) {
            var filteredList = [];
            if(filterText && filterText !== ''){
                var text;
                if(typeof filterText === 'object'){
                    text = filterText[key];
                }else{
                    text = filterText;
                }
                for(var i=0; i<input.length; i++){
                    if(angular.uppercase(input[i][key]).indexOf(angular.uppercase(text))!==-1){
                        filteredList.push(input[i]);
                    }
                }
                return filteredList;
            }
            return input;
        };
    });

})();