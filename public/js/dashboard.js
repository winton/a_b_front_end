window.Dashboard = function(sites) {
	var queue = $({});
	
	$.extend(this, {
		sites: function() { return sites; },
		uniqArray: uniqArray
	});
	
	$(function() {
		addLastClassToSelectables();
		
		$(document).keyup(function(e) {
			if (e.keyCode == 27) // esc
				removeSelectablesWithForms();
		});
		
		$('.add').click(add);
		$('#tests .variants').live('keyup', variantKeyUp);
		$('#tests .edit a').live('click', testEdit);
		$('#tests .remove a').live('click', testRemove);
		$('.selectable:not(.new)').live('click', selectableClick);
		$('.header > .remove').live('click', remove);
		$('select.conditions').live('change', testConditionsChange);
	});
	
	// Events
	
	function add() {
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
				var data = currentState();
				var site = data.site;
				var name = $('input', this).val();
				var post;

				if (id == 'envs' || id == 'categories') {
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
			$('#tests .header').after($('#tests_form_template').tmpl());
			
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
				
				var data = currentState();
				var category = data.category;
				var site = data.site;
				
				queue.queue(function() {
					$.post(
						'/tests.json',
						form.serialize() + '&category=' + category.name,
						function(response) {
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
	}
	
	function remove() {
		if (!confirm('Are you sure?'))
			return false;
		
		var filter = $(this).parents('.filter');
		var id = filter.attr('id');
		
		var data = currentState();
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
		
		return false;
	}
	
	function selectableClick() {
		var filter = $(this).parents('.filter');
		var id = filter.attr('id');
		
		$(this).toggleClass('selected');
		hideNextAll(filter);
		
		if ($(this).hasClass('selected')) {
			var target = filter.next();
			var target_id = target.attr('id');
			
			var data = currentState();
			var site = data.site;
			var env = data.env;
			var category = data.category;
			
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
				target.children(':not(.header)').remove();
				
				if (category.tests)
					$.each(category.tests, function(i, test) {
						$('#tests').append(
							$('#test_template').tmpl({ test: test, env: env.name })
						);
					});
				else
					$('#tests .add').click();
			}
		} else
			$('.remove', filter).addClass('hide');
	}
	
	function testConditionsChange() {
		var data = currentState();
		var table = $(this).parents('table');
		var id = table.attr('id').match(/\d+/)[0];
		var condition = $("option:selected", this).html();
		var test = byId(data.category.tests, id);
		
		table.replaceWith(
			$('#test_template').tmpl({
				condition: (condition == 'All data' ? undefined : condition),
				test: test,
				env: data.env.name
			})
		);
	}
	
	function testEdit() {
		var table = $(this).closest('table');
		var id = table.attr('id').match(/\d+/)[0];
		var test = byId(currentState().category.tests, id);
		var dialog = $('#tests_form_template').tmpl({ test: test });
		var submit = $('.submit', dialog);
		var variant_template = $('#tests_form_variant_template');
		
		table.replaceWith(dialog);
		$('input:first', dialog)[0].select();
		
		$.each(test.variants, function(i, item) {
			submit.before(
				variant_template.tmpl({
					control: (i == 0),
					id: item.id,
					name: item.name
				})
			);
		});
		
		submit.before(
			variant_template.tmpl({
				control: (test.variants.length == 0)
			})
		);
		
		$('.cancel', dialog).click(function() {
			dialog.remove();
			$('#categories .selected').click().click();
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
			
			var data = currentState();
			var category = data.category;
			var site = data.site;
			
			queue.queue(function() {
				$.post(
					'/tests.json',
					form.serialize() + '&_method=PUT',
					function(response) {
						category.tests = category.tests || [];
						category.tests = $.map(category.tests, function(item) {
							return (item.id == id) ? response : item;
						});
						queue.dequeue();
						$('#categories .selected').click().click();
					},
					'json'
				);
			});
			
			return false;
		});
	}
	
	function testRemove() {
		if (!confirm('Are you sure?'))
			return false;
		
		var test = $(this).closest('table');
		var id = test.attr('id').match(/\d+/)[0];
		var category = currentState().category;
		
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
		
		return false;
	}
	
	function variantKeyUp() {
		if ($('#tests .variants[value=]').length < 1)
			$('#tests .dialog .submit').before(
				$('#tests_form_variant_template').tmpl()
			);
	}
	
	// Helpers
	
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
	
	function currentState() {
		var site, env, category;
		
		$('.selected').each(function(i, item) {
			item = $(item);
			var id = item.parent().attr('id');
			
			if (id == 'sites')
				site = item;
			else if (id == 'envs')
				env = item;
			else if (id == 'categories')
				category = item;
		});
		
		if (site) {
			site = byName(sites, site.text());
			if (env)
				env = byName(site.envs, env.text());
			if (category)
				category = byName(site.categories, category.text());
		}
		
		return {
			site: site,
			env: env,
			category: category
		};
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
	
	function uniqArray(array) {
		 var u = {}, a = [];
		 for(var i = 0, l = array.length; i < l; i++) {
				if (u[array[i]]) continue;
				a.push(array[i]);
				u[array[i]] = 1;
		 }
		 return a;
	}
	
	function withoutName(records, name) {
		return $.grep(records, function(item) {
			return (item.name != name);
		});
	}
};