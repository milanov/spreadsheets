(function() {
    'use strict';

    describe('toggleClass', function() {

        describe('Toggling a single class', function() {
            it('should add the given class if not present even if it is the first one', function() {
                var classBeingToggled = 'greenClass';

                toggleClass('', classBeingToggled).should.be.equal(classBeingToggled);
                toggleClass(undefined, classBeingToggled).should.be.equal(classBeingToggled);
            });

            it('should add the given single class if not present and preserve the current ones', function() {
                var classBeingToggled = 'pinkClass',
                    classes = 'class1 class2';

                var resultingString = toggleClass(classes, classBeingToggled);
                wordsIn(resultingString).should.be.equalAsSets(['pinkClass', 'class1', 'class2']);
            });

            it('should remove the given class if present even if it"s the only one', function() {
                var classBeingToggled = 'greenClass';

                var resultingString = toggleClass(classBeingToggled, classBeingToggled);
                wordsIn(resultingString).should.be.empty;
            });

            it('should remove the given class if present and preserve the other ones', function() {
                var classBeingToggled = 'greenClass',
                    classes = 'greenClass redClass pinkClass';

                var resultingString = toggleClass(classes, classBeingToggled);
                wordsIn(resultingString).should.be.equalAsSets(['redClass', 'pinkClass']);
            });
        });

        describe('Toggling a class from a group of classes', function() {
            it('should add the given class if not present even if it\'s the first one', function() {
                var classBeingToggled = 'greenClass',
                    classGroup = [classBeingToggled, 'redClass', 'blueClass'];

                toggleClass('', classBeingToggled, classGroup).should.be.equal(classBeingToggled);
                toggleClass(undefined, classBeingToggled, classGroup).should.be.equal(classBeingToggled);
            });

             it('should add the given class if not present and preserve the current ones', function() {
                var classBeingToggled = 'pinkClass',
                    classes = 'class1 class2',
                    classGroup = [classBeingToggled, 'redClass', 'blueClass'];

                var resultingString = toggleClass(classes, classBeingToggled, classGroup);
                wordsIn(resultingString).should.be.equalAsSets(['pinkClass', 'class1', 'class2']);
            });

            it('should keep the given class if present even if it is the only one', function() {
                var classBeingToggled = 'greenClass',
                    classGroup = [classBeingToggled, 'redClass', 'blueClass'];

                var resultingString = toggleClass(classBeingToggled, classBeingToggled, classGroup);
                wordsIn(resultingString).should.be.equalAsSets([classBeingToggled]);
            });

            it('should keep the given class if present and preserve the other ones too', function() {
                var classBeingToggled = 'greenClass',
                    classes = 'greenClass class1 class2',
                    classGroup = [classBeingToggled, 'redClass', 'blueClass'];

                var resultingString = toggleClass(classes, classBeingToggled, classGroup);
                wordsIn(resultingString).should.be.equalAsSets([classBeingToggled, 'class1', 'class2']);
            });

            it('should add the given class if not present and remove ones from its group even if it\'s the first one', function() {
                var classBeingToggled = 'greenClass',
                    classes = 'redClass',
                    classGroup = [classBeingToggled, 'redClass', 'blueClass'];

                var resultingString = toggleClass(classes, classBeingToggled, classGroup);
                wordsIn(resultingString).should.be.equalAsSets([classBeingToggled]);
            });

            it('should add the given class if not present, remove ones from its group and preserve the others', function() {
                var classBeingToggled = 'greenClass',
                    classes = 'redClass class1 class2',
                    classGroup = [classBeingToggled, 'redClass', 'blueClass'];

                var resultingString = toggleClass(classes, classBeingToggled, classGroup);
                wordsIn(resultingString).should.be.equalAsSets([classBeingToggled, 'class1', 'class2']);
            });
        });
    });
})();
