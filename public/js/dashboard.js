$(function() {
	
	addLastClassToSelectables();
	
	$('.add').click(function() {
		var type = $(this).attr('rel');
		$('.selectable.new').each(function(i, item) {
			$(item).remove();
		});
		var form = $('<form/>').append(
			$('<input/>').attr({
				name: 'name',
				type: 'text'
			})
		);
		$(this)
			.parent()
				.after(
					$('<div/>')
						.addClass('selectable')
						.addClass('new')
						.append(form)
				);
		form.submit(function() {
			var name = $('input', this).val();
			$.post(
				'/' + type + '/create.json',
				{ name: name },
				null,
				'json'
			);
			$(this).parent().replaceWith(
				$('<div/>').addClass('selectable').html(name)
			);
			return false;
		});
		addLastClassToSelectables();
		$('input', $(this).parent().next()).select();
	});
	
	function addLastClassToSelectables() {
		var fn = function(el, row_length) {
			$('.selectable', el).each(function(i, item) {
				if (((i+1) % row_length) == 0)
					$(item).addClass('last');
				else
					$(item).removeClass('last');
			});
		};
		$('.dashboard .span-12').each(function() {
			fn(this, 3);
		});
		$('.dashboard .span-24').each(function() {
			fn(this, 6);
		});
	}
});