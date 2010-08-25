window.testing = true;

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
		.append('<input type="text" />')
		.append(
			$('<a href="#"/>')
				.html('Continue')
				.css({
					'color': 'yellow',
					'margin-left': 10
				})
				.click(function() {
					fn($('input', alert).val());
					alert.remove();
					return false;
				})
		);
}

module('fake data');

test('should create some fake data', function() {
	stop();
	if (window.test) {
		// do tests
	} else {
		stop();
		wait("Enter site name", function(site_name) {
			wait("Enter test name", function(test_name) {
				A_B.Cookies.set('site_name', site_name);
				A_B.Cookies.set('test_name', test_name);
				window.location.reload();
			});
		});
	}
});