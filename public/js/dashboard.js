window.Dashboard = function(sites) {
	var queue = $({});
	
	$(function() {
		addLastClassToSelectables();

		$('.add').click(function() {
			var filter = $(this).parents('.filter');
			var id = filter.attr('id');

			removeSelectablesWithForms();
			
			if (id != 'tests') {
				var form = $('<form/>').append(
					$('<input/>').attr({
						name: 'name',
						type: 'text'
					})
				);
				
				var div = $('<div/>')
					.addClass('selectable')
					.addClass('new')
					.append(form);
			
				filter.append(div);
				div.click();
				addLastClassToSelectables();
				
				$('input', form).select();

				form.submit(function() {
					var name = $('input', this).val();
					var post, site;

					if (id == 'envs' || id == 'categories') {
						site = byName(sites, $('#sites .selected').text());
						post = { name: name, site_id: site.id };
						site[id] = site[id] || [];
						site[id].push(post);
					} else {
						post = { name: name };
						sites.push(post);
						post = $.extend({ include: [ 'envs', 'categories' ] }, post);
					}

					var selectable = createSelectable(name);
					$(this).parents('.selectable').replaceWith(selectable);
					addLastClassToSelectables();
					selectable.click();

					queue.queue(function() {
						$.post(
							'/' + id + '.json',
							post,
							function(response) {
								var modified = $.map(site ? site[id] : sites, function(item) {
									if (item.name == name)
										return response;
									else
										return item;
								});
								if (site)
									site[id] = modified;
								else
									sites = modified;
								queue.dequeue();
							},
							'json'
						);
					});

					return false;
				});
			} else {
				$('#tests .dialog').remove();
				$('#tests .header').after($('#tests_form_template').val());
				
				var dialog = $('#tests .dialog');
				
				$('.submit', dialog).before(
					$('#tests_form_variant_template').tmpl({ control: true })
				);
				$('input:first', dialog).focus();
				
				$('.cancel', dialog).click(function() {
					dialog.remove();
					return false;
				});
				
				$('form', dialog).submit(function() {
					var form = $(this);
					var submits = $('.submit input', form);
					
					$(submits[0]).attr({
						'disabled': true,
						'value': 'One moment...'
					});
					$(submits[1]).remove();
					
					var category = $('#categories .selected').text();
					var site = $('#sites .selected').text();
					var data = form.serialize() + '&category=' + category;
					
					queue.queue(function() {
						$.post(
							'/tests.json',
							data,
							function(response) {
								category = byName(byName(sites, site).categories, category);
								category.tests = category.tests || [];
								category.tests.push(response);
								queue.dequeue();
								$('#categories .selected').click().click();
							},
							'json'
						);
					});
					
					return false;
				});
			}
		});
		
		$('#tests .variants').live('keyup', function() {
			if ($('#tests .variants[value=]').length < 1)
				$('#tests .dialog .submit').before(
					$('#tests_form_variant_template').tmpl()
				);
		});
		
		$('#tests .edit a').live('click', function() {
			
		});
		
		$('#tests .remove a').live('click', function() {
			if (!confirm('Are you sure?'))
				return;
			
			var site = byName(sites, $('#sites .selected').text());
			var category = byName(site.categories, $('#categories .selected').text());
			var test = $(this).closest('table');
			var id = test.attr('id').match(/\d+/)[0];
			
			test.remove();
			category.tests = $.grep(category.tests, function(item) {
				return (item.id != id);
			});
			
			queue.queue(function() {
				$.post(
					'/tests.json',
					{ '_method': 'DELETE', id: id },
					function() { queue.dequeue(); },
					'json'
				);
			});
		});

		$('.selectable:not(.new)').live('click', function() {
			var filter = $(this).parents('.filter');
			var id = filter.attr('id');
			
			$(this).toggleClass('selected');
			hideNextAll(filter);
			
			if ($(this).hasClass('selected')) {
				var target = filter.next();
				var target_id = target.attr('id');
				var site = byName(sites, $('#sites .selected').text());
				
				filter.children('.selected').not(this).click();
				$('.remove', filter).removeClass('hide');
				target.removeClass('hide');
				
				if (target_id != 'tests') {
					if (target_id && site[target_id]) {
						target.children('.selectable').remove();
						
						$.each(site[target_id], function(i, item) {
							target.append(createSelectable(item.name));
						});
						
						addLastClassToSelectables();
					}
				} else {
					var category = byName(site.categories, $('#categories .selected').text());
					var env = $('#envs .selected').text();
					
					target.children(':not(.header)').remove();
					
					if (category.tests)
						$.each(category.tests, function(i, test) {
							$('#tests').append(
								$('#test_template').tmpl({ test: test, env: env })
							);
						});
					else
						$('#tests .add').click();
				}
			} else
				$('.remove', filter).addClass('hide');
		});
		
		$('.header > .remove').live('click', function() {
			if (!confirm('Are you sure?'))
				return;
			
			var filter = $(this).parents('.filter');
			var id = filter.attr('id');
			var selected = $('.selectable.selected', filter);
			var name = selected.text();
			
			$(this).addClass('hide');
			hideNextAll(filter);
			selected.remove();
			
			if (id == 'sites')
				sites = withoutName(sites, name);
			else {
				var site = byName(sites, $('#sites .selected').text());
				site[id] = withoutName(site[id], name);
			}
			
			queue.queue(function() {
				$.post(
					'/' + id + '.json',
					{ '_method': 'DELETE', name: name },
					function() { queue.dequeue(); },
					'json'
				);
			});
		});
		
		$(document).keyup(function(e) {
			if (e.keyCode == 27)
				removeSelectablesWithForms();
		});
	});
	
	function addLastClassToSelectables() {
		var fn = function(el, row_length) {
			$(el).children('.selectable').each(function(i, item) {
				if (((i+1) % row_length) == 0)
					$(item).addClass('last');
				else
					$(item).removeClass('last');
			});
		};
		$('#sites, #envs').each(function() {
			fn(this, 3);
		});
		$('#categories').each(function() {
			fn(this, 6);
		});
	}
	
	function createSelectable(name) {
		return $('<div/>').addClass('selectable').html(name);
	}
	
	function hideNextAll(filter) {
		filter.nextAll().addClass('hide');
	}
	
	function removeSelectablesWithForms() {
		$('.selectable.new').remove();
	}
	
	function byId(records, id) {
		return byProperty(records, 'id', id);
	}
	
	function byName(records, name) {
		return byProperty(records, 'name', name);
	}
	
	function byProperty(records, property, value) {
		return $.grep(records, function(item) {
			return (item[property] == value);
		})[0];
	}
	
	function withoutName(records, name) {
		return $.grep(records, function(item) {
			return (item.name != name);
		});
	}
	
	$.extend(this, {
		sites: function() { return sites; }
	});
};