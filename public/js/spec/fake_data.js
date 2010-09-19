function wait(msg, fn) {
	var alert = $('<div id="alert"/>')
		.html(msg + ":&nbsp;&nbsp;")
		.css({
			background: 'red',
			color: 'white',
			'font-family': $('h1').css('font-family'),
			'font-weight': 'bold',
			'margin-bottom': '8px',
			padding: '8px'
		})
		.prependTo('body')
		.append(
			$('<input type="text" />')
				.keyup(function(e) {
					if (e.keyCode == 13)
						submit();
				})
		)
		.append(
			$('<a href="#"/>')
				.html('Continue')
				.css({
					'color': 'yellow',
					'margin-left': 10
				})
				.click(submit)
		);
	$('input[type=text]', alert).focus();
	function submit() {
		fn($('input', alert).val());
		alert.remove();
		return false;
	}
}

module('fake data');

test('should create some fake data', function() {
	if (window.category && window.test) {
		start();
		expect(2);
		a_b({ 'Logged in': true });
		equals(typeof a_b(window.category, window.test).visit(), 'string');
		equals(typeof a_b(window.category, window.test).convert(), 'string');
	} else {
		stop();
		wait("Enter site name", function(site_name) {
			wait("Enter category name", function(category_name) {
				wait("Enter test name", function(test_name) {
					A_B.Cookies.set('category_name', category_name);
					A_B.Cookies.set('site_name', site_name);
					A_B.Cookies.set('test_name', test_name);
					window.location.reload();
				});
			});
		});
	}
});