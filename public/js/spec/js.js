window.testing = true;

function cookieToJson() {
	var data = eval('(' + A_B.Cookies.get('a_b_s') + ')');
	return data;
}

function setup() {
	reset_a_b();
	A_B.Cookies.set('a_b', null);
	A_B.Cookies.set('a_b_i', null);
	A_B.Cookies.set('a_b_s', null);
}

module('visit', { setup: setup });

test('should return the variant name', function() {
	equals(a_b('category', 'test').visit(), 'v1');
});

test('should return the variant name every time', function() {
  a_b('test').visit();
  equals(a_b('category', 'test').visit(), 'v1');
});

test('should set cookie', function() {
	a_b('category', 'test').visit();
	same(cookieToJson(), { "v": [2] });
});

test("should maintain state if called more than once", function() {
	a_b('category', 'test').visit();
	a_b('category', 'test').visit();
	same(cookieToJson(), { "v": [2] });
});

test("should return the variant name if variant specified and selected", function() {
  equals(a_b('category', 'test').visit(), 'v1');
});

test("should return nil if variant specified and not selected", function() {
	a_b('category', 'test').visit('v1');
	equals(a_b('category', 'test').visit('v2'), null);
});

test("should accept a block and pass the selected variant name to it", function() {
	expect(1);
	a_b('category', 'test').visit(function(variant) {
		equals(variant, 'v1');
	});
});

test("should accept a block for a specific variant", function() {
	expect(1);
	a_b('category', 'test').visit('v1', function() {
		ok(true);
	});
});

test("should not call a block for a specific variant if the variant is not selected", function() {
	a_b('category', 'test').visit('v2', function() {
		ok(false);
	});
});

test("should accept a hash with extra boolean values", function() {
	a_b('category', 'test', { e: true }).visit('v1');
	same(cookieToJson(), { "v": [2], "e": { "e": true } });
});

module('convert', {
	setup: function() {
		setup();
		a_b('category', 'test').visit();
	}
});

test("should return the variant name", function() {
	equals(a_b('category', 'test').convert(), 'v1');
});

test("should return the variant name every time", function() {
	a_b('category', 'test').convert();
	equals(a_b('category', 'test').convert(), 'v1');
});

test("should set cookie", function() {
	a_b('category', 'test').convert();
	same(cookieToJson(), { "v": [2], "c": [2] });
});

test("should maintain state if called more than once", function() {
	a_b('category', 'test').convert();
	a_b('category', 'test').convert();
	same(cookieToJson(), { "v": [2], "c": [2] });
});

test("should return the variant name if variant specified and selected", function() {
  equals(a_b('category', 'test').convert('v1'), 'v1');
});

test("should return nil if variant specified and not selected", function() {
	a_b('category', 'test').convert('v1');
	equals(a_b('category', 'test').convert('v2'), null);
});

test("should accept a block and pass the selected variant name to it", function() {
	expect(1);
	a_b('category', 'test').convert(function(variant) {
		same(variant, 'v1');
	});
});

test("should accept a block for a specific variant", function() {
	expect(1);
	a_b('category', 'test').convert('v1', function() {
		ok(true);
	});
});

test("should not call a block for a specific variant if the variant is not selected", function() {
	a_b('category', 'test').convert('v2', function() {
		ok(false);
	});
});

test("should accept a hash with extra boolean values", function() {
	a_b('category', 'test', { e: true }).convert('v1');
	same(cookieToJson(), { "v": [2], "c": [2], "e": { "e": true } });
});

var called, requested, timer;
module('API', {
	setup: function() {
		setup();
		called = 0;
		requested = 0;
		// This should resemble API.request without the json-p call
		A_B.API.request = function() {
			called += 1;
			clearTimeout(timer);
			timer = setTimeout(function() { requested += 1; }, 10);
		};
	}
});

test("should be called when the data structure changes", function() {
	expect(1);
	a_b('category', 'test').visit('v1');
	a_b('category', 'test').visit('v2');
	a_b('category', 'test').convert('v1');
	a_b('category', 'test').convert('v2');
	equals(called, 2);
});

test("should only send one request after a number of simultaneous calls", function() {
	expect(1);
	stop();
	a_b('category', 'test').visit('v1');
	a_b('category', 'test').convert('v1');
	setTimeout(function() {
		start();
		equals(requested, 1);
	}, 100);
});