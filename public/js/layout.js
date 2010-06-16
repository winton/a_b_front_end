$(function() {
	$('.top a').click(function() {
		var class_name = $(this).attr('className').replace(' selected', '');
		$('.top a').not(this).removeClass('selected');
		if (class_name.length) {
			$(this).toggleClass('selected');
			$('.dialog.' + class_name).toggleClass('hide');
			$('.dialog:not(.' + class_name + ')').addClass('hide');
			$('.dialog.' + class_name + ':visible input:first').focus();
			return false;
		} else {
			$('.dialog').addClass('hide');
			return true;
		}
	});
	
	$('form').submit(function() {
		$('input.submit', this).val('One moment...').attr('disabled', true);
	});
});