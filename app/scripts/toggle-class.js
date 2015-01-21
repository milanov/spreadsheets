
 function getNewFormatClass(className, formatClass, classGroup) {
    'use strict';

    if (className.indexOf(formatClass) !== -1) {
        return className;
    }

    $.each(classGroup, function(index, cls) {
        className = className.replace(cls, '');
    });
    className = className.replace('  ', ' ');

    className += ' ' + formatClass;
    return className;
}

function getNewFormatClassSingle(className, formatClass) {
    'use strict';

    if (className.indexOf(formatClass) !== -1) {
        className = className.replace(formatClass, '');
        className = className.replace('  ', ' ');

        return className;
    }

    className += ' ' + formatClass;
    return className;
}

function toggleClass(currentClassesString, formatClass, classGroup) {
    'use strict';

    var className;
    if (!currentClassesString) {
        className = formatClass;
    } else if (classGroup) {
        className = getNewFormatClass(currentClassesString, formatClass, classGroup);
    } else {
        className = getNewFormatClassSingle(currentClassesString, formatClass);
    }

    return className;
}


