# angularjs-combo-box
AngularJs Combo-box with dropdown and input

##Inputs for directive

* ng-model : value that needs to be binded
* options  : list that needs to be present in dropdown
* config   : Object that takes 'optionLabel' as key and value is property on list item that needs to be displayed in dropdown
* parent-id: 'id' of parent element for dropdown to display up or down depending on space


###Disclaimer:

I'm not sure why 'is-open' attribute of 'uib-dropdown' is not working, so I have manually added & removed class when clicked on dropdown & on focus of input element.
