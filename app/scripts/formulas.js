var Formulas = {}

Formulas.product = function(ranges) {
	// Multiply the values in the non-empty cells in the ranges

	if (Formulas.count(ranges) === 0) return 0;

	// PRODUCT takes only one range so just get the first element in the array
	var args = ranges[0];
	var result = 1;
	// iterate through all elements in the ranges to find the product of the elements
	args.forEach(function(argument) {
		if (argument !== undefined) {
			result *= argument;
		}
	});

	return result;
}

Formulas.sumproduct = function(ranges) {
	// Sum the elements in each range and multiply the result

	if (Formulas.count(ranges) === 0) return 0;

	var product = 1;

	// iterate through all rangess to multiply the sums
	ranges.forEach(function(array) {
		var sum = 0;
		// iterate through all elements in the current ranges to find the sum of the elements
		array.forEach(function(element) {
			if (element !== undefined) {
				sum += element;
			}
		});
		product *= sum;
	});

	return product;
}

Formulas.sum = function(ranges) {
	if (Formulas.count(ranges) === 0) return 0;

	// PRODUCT takes only one range so just get the first element in the array
	var range = ranges[0];
	var sum = 0;
	// iterate through all elements in the ranges to find the product of the elements
	range.forEach(function(argument) {
		if (argument !== undefined) {
			sum += argument;
		}
	});

	return sum;

}

Formulas.average = function(ranges) {
	// Compute the average value of a selected ranges

	var sum = Formulas.sum(ranges);

	var count = Formulas.count(ranges);
	if (count === 0) return 0;

	return sum/Formulas.count(ranges);
}

Formulas.count = function(ranges) {
	// Count the number of cells which contain a value in a selected ranges

	// COUNT takes only one ranges so just get the first element in the array
	var range = ranges[0];
	var result = 0;
	// iterate through all elements in the ranges to count the number of the set cells
	range.forEach(function(argument) {
		if (argument !== undefined) {
			result++;
		}
	});

	return result;	
}

Formulas.max = function(ranges) {
	// Find the max number in the range

	if (Formulas.count(ranges) === 0) return 0;

	// MAX takes only one ranges so just get the first element in the array
	var range = ranges[0];
	var max = Number.MIN_VALUE;;
	// iterate through all elements in the ranges to find the max number
	range.forEach(function(argument) {
		if (argument !== undefined) {
			if (argument > max) {
				max = argument;
			}
		}
	});

	return max;
}

Formulas.min = function(ranges) {
	// Find the min number in the range

	if (Formulas.count(ranges) === 0) return 0;

	// MIN takes only one ranges so just get the first element in the array
	var range = ranges[0];
	var min = Number.MAX_VALUE;;
	// iterate through all elements in the ranges to find the min number
	range.forEach(function(argument) {
		if (argument !== undefined) {
			if (argument < min) {
				min = argument;
			}
		}
	});

	return min;
}