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
		$('.dialog .remove').live('click', dialogRemove);
		$('.domains').live('keyup', domainKeyUp);
		$('.header > .edit').live('click', edit);
		$('.header > .remove').live('click', remove);
		$('.selectable:not(.new)').live('click', selectableClick);
		$('select.conditions').live('change', testConditionsChange);
		$('#tests .edit a').live('click', testEdit);
		$('#tests .remove a').live('click', testRemove);
		$('.variants').live('keyup', variantKeyUp);
		
		selectFromCookies();
	});
	
	// Events
	
	function add() {
		var filter = $(this).parents('.filter');
		var id = filter.attr('id');
		
		removeSelectablesWithForms();
		
		if (id == 'tests')
			addTest();
		else if (id == 'envs')
			addEnv();
		else
			addOther(filter, id);
		
		return false;
	}
	
	function dialogRemove() {
		var input_container = $(this).parent();
		var text_container = input_container.prev();
		var input = $(this).prev();
		var form = $(this).parents('form');
		var variant_template = $('#tests_form_variant_template');
		var control = ($.trim(text_container.text()) == 'Control');
		
		if (input.attr('name').indexOf('old_variants') > -1)
			form.append(
				$('<input type="hidden" value="" />').attr({
					name: input.attr('name')
				})
			);
		
		if (control) {
			var variant = variant_template.tmpl({
				control: true
			});
			text_container.replaceWith(variant);
			$('input', variant).focus();
		} else
			text_container.remove();
		
		input_container.remove();
		$('.domains, .variants', form).keyup();
		
		if (!control)
			$('.domains, .variants[value=]:last').focus();
	}
	
	function domainKeyUp() {
	  if ($(this).val() != '')
			$(this).next().removeClass('hide');
		if ($('.domains[value=]').length < 1) {
			$('.dialog .submit').before(
				$('#envs_form_domain_template').tmpl()
			);
			$('.dialog').trigger('resize');
		}
	}
	
	function edit() {
		var filter = $(this).parents('.filter');
		var id = filter.attr('id');
		
		removeSelectablesWithForms();
		
		if (id == 'envs')
			editEnv(filter);
		else
			editOther(filter, id);
		
		return false;
	}
	
	function remove() {
		if (!confirm('Are you sure?'))
			return false;
		
		var filter = $(this).parents('.filter');
		var id = filter.attr('id');
		
		var data = currentState();
		var selected = $('.selectable.selected', filter);
		var name = selected.text();
		
		$(this).prev().addClass('hide');
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
		var selected = $(this).hasClass('selected');
		
		$(this).toggleClass('selected');
		hideNextAll(filter);
		
		if (!selected) {
			var target = filter.next();
			var target_id = target.attr('id');
			
			filter.children('.selected').not(this).click();
			$('.edit, .remove', filter).removeClass('hide');
			target.removeClass('hide');
			
			var data = currentState();
			var site = data.site;
			var env = data.env;
			var category = data.category;
			
			if (target_id != 'tests') {
				target.children('.selectable').remove();
				
				if (target_id && site[target_id]) {
					$.each(site[target_id], function(i, item) {
						target.append(createSelectable(item.name).div);
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
			}
		} else
			$('.edit, .remove', filter).addClass('hide');
		
		selectToCookies(id, selected, $(this).text());
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
		
		lightbox(dialog);
		
		$('form', dialog).submit(function() {
			var data = currentState();
			var category = data.category;
			var site = data.site;
			var form = $(this);
			var name = $('#test_name').val();
			var submits = $('.submit input', form);
			var valid = true;
			
			if (category.tests)
				$.each(category.tests, function(i, item) {
					if (item.name == name && item.id != id)
						valid = false;
				});
			if (!valid) {
				alert('Name already taken.');
				return false;
			}
			
			$(submits[0]).attr({
				'disabled': true,
				'value': 'One moment...'
			});
			$(submits[1]).remove();
			
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
						dialog.trigger('close');
					},
					'json'
				);
			});
			
			return false;
		});
		
		return false;
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
		if ($(this).val() != '')
			$(this).next().removeClass('hide');
		if ($('.variants[value=]').length < 1) {
			$('.dialog .submit').before(
				$('#tests_form_variant_template').tmpl()
			);
			$('.dialog').trigger('resize');
		}
	}
	
	// Helpers
	
	function addEnv() {
		var data = currentState();
		var site = data.site;
		var dialog = $('#envs_form_template').tmpl({ site: site });
		
		$('.submit', dialog).before(
			$('#envs_form_domain_template').tmpl()
		);
		
		lightbox(dialog);
		
		$('form', dialog).submit(function() {
			var name = $('#env_name').val();
			var form = $(this);
			var submits = $('.submit input', form);
			var valid = true;
			
			if (site.envs)
				$.each(site.envs, function(i, item) {
					if (item.name == name)
						valid = false;
				});
			if (!valid) {
				alert('Name already taken.');
				return false;
			}
			
			$(submits[0]).attr({
				'disabled': true,
				'value': 'One moment...'
			});
			$(submits[1]).remove();
			
			queue.queue(function() {
				$.post(
					'/envs.json',
					form.serialize(),
					function(response) {
						site.envs = site.envs || [];
						site.envs.push(response);
						
						var selectable = createSelectable(name);
						$('#envs').append(selectable.div);
						addLastClassToSelectables();
						selectable.div.click();
						
						dialog.trigger('close');
						queue.dequeue();
					},
					'json'
				);
			});
			
			return false;
		});
	}
	
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
	
	function addOther(filter, id) {
		var selectable = createSelectable('', true);
		
		filter.append(selectable.div);
		selectable.div.click();
		addLastClassToSelectables();
		
		selectable.input.select();

		selectable.form.submit(function() {
			var container = $(this).parents('.selectable');
			var data = currentState();
			var site = data.site;
			var name = selectable.input.val();
			var valid = true;
			var post;
			
			// validate
			container.siblings().each(function(i, item) {
				if ($(item).text() == name)
					valid = false;
			});
			if (!valid) {
				alert("Name already exists.");
				return false;
			}
			
			// post data
			if (id == 'envs' || id == 'categories') {
				post = { name: name, site_id: site.id };
				site[id] = site[id] || [];
				site[id].push(post);
			} else {
				post = { name: name };
				sites.push(post);
				post = $.extend({ include: [ 'envs', 'categories' ] }, post);
			}
			
			// create selectable
			selectable = createSelectable(name);
			container.replaceWith(selectable.div);
			addLastClassToSelectables();
			selectable.div.click();

			queue.queue(function() {
				$.post(
					'/' + id + '.json',
					post,
					function(response) {
						var modified = $.map(id != 'sites' ? site[id] : sites, function(item) {
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
	}
	
	function addTest() {
		var dialog = $('#tests_form_template').tmpl();
		
		$('.submit', dialog).before(
			$('#tests_form_variant_template').tmpl({ control: true })
		);
		
		lightbox(dialog);
				
		$('form', dialog).submit(function() {
			var data = currentState();
			var category = data.category;
			var site = data.site;
			var form = $(this);
			var name = $('#test_name').val();
			var submits = $('.submit input', form);
			var valid = true;
			
			if (category.tests)
				$.each(category.tests, function(i, item) {
					if (item.name == name)
						valid = false;
				});
			if (!valid) {
				alert('Name already taken.');
				return false;
			}
			
			$(submits[0]).attr({
				'disabled': true,
				'value': 'One moment...'
			});
			$(submits[1]).remove();
			
			queue.queue(function() {
				$.post(
					'/tests.json',
					form.serialize() + '&category=' + category.name,
					function(response) {
						category.tests = category.tests || [];
						category.tests.unshift(response);
						queue.dequeue();
						$('#categories .selected').click().click();
						dialog.trigger('close');
					},
					'json'
				);
			});
			
			return false;
		});
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
	
	function createSelectable(name, input) {
		var div = $('<div/>').addClass('selectable');
		var form;
		
		if (input) {
			input = $('<input/>').attr({
				name: 'name',
				type: 'text',
				value: name
			});
			form = $('<form/>').append(input);
			
			div.addClass('new').append(form);
		} else
			div.html(name);
		
		return {
			div: div,
			input: input,
			form: form
		};
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
	
	function editEnv(filter) {
		var data = currentState();
		var env = data.env;
		var site = data.site;
		var dialog = $('#envs_form_template').tmpl({
			env: env,
			site: site
		});
		
		if (env.domains)
			$.each(env.domains.split(','), function(i, item) {
				$('.submit', dialog).before(
					$('#envs_form_domain_template').tmpl({ domain: item })
				);
			});
		
		$('.submit', dialog).before(
			$('#envs_form_domain_template').tmpl()
		);
		
		lightbox(dialog);
		
		$('form', dialog).submit(function() {
			var name = $('#env_name').val();
			var form = $(this);
			var submits = $('.submit input', form);
			var valid = true;
			
			if (site.envs)
				$.each(site.envs, function(i, item) {
					if (item.name == name && item.id != env.id)
						valid = false;
				});
			if (!valid) {
				alert('Name already taken.');
				return false;
			}
			
			$(submits[0]).attr({
				'disabled': true,
				'value': 'One moment...'
			});
			$(submits[1]).remove();
			
			queue.queue(function() {
				$.post(
					'/envs.json',
					form.serialize() + '&_method=put',
					function(response) {
						site.envs = site.envs || [];
						site.envs = $.map(site.envs, function(item) {
							return (item.id == env.id) ? response : item;
						});
						
						var selectable = createSelectable(name);
						selectable.div.addClass('selected');
						$('.selected', filter).replaceWith(selectable.div);
						addLastClassToSelectables();
						
						dialog.trigger('close');
						queue.dequeue();
					},
					'json'
				);
			});
			
			return false;
		});
	}
	
	function editOther(filter, id) {
		var data = currentState();
		var selected = $('.selected', filter);
		var selectable = createSelectable(selected.text(), true);
		
		selected.replaceWith(selectable.div);
		selectable.div.addClass('selected');
		selectable.div.data({ original_name: selected.text() });
		selectable.input.select();
		
		addLastClassToSelectables();
		
		selectable.form.submit(function() {
			var name = selectable.input.val();
			var post = { name: name, _method: 'put' };
			var valid = true;
			
			// validate
			selectable.div.siblings().each(function(i, item) {
				if ($(item).text() == name)
					valid = false;
			});
			if (!valid) {
				alert("Name already exists.");
				return false;
			}
			
			// post data
			if (id == 'sites') {
				data.site.name = name;
				post.id = data.site.id;
			} else if (id == 'categories') {
				data.category.name = name;
				post.id = data.category.id;
			}

			selectable = createSelectable(name);
			$(this).parents('.selectable').replaceWith(selectable.div);
			selectable.div.addClass('selected');
			addLastClassToSelectables();

			queue.queue(function() {
				$.post(
					'/' + id + '.json',
					post,
					function(response) {
						queue.dequeue();
					},
					'json'
				);
			});

			return false;
		});
	}
	
	function hideNextAll(filter) {
		var next_all = filter.nextAll();
		next_all.addClass('hide');
		$('.remove, .edit', next_all).addClass('hide');
	}
	
	function lightbox(el) {
		el.lightbox_me({
			destroyOnClose: true,
			centered: true,
			onLoad: function() {
				$('input:first[type=text]', el)[0].select();
				$('.cancel', el).click(function() {
					el.trigger('close');
					return false;
				});
			},
			overlayCSS: { background: 'white', opacity: 0.75 }
		});
	}
	
	function removeSelectablesWithForms() {
		$('.selectable.new:not(.selected)').remove();
		$('.selectable.new.selected').each(function(i, item) {
			$(item)
				.html($(item).data('original_name'))
				.removeClass('new');
		});
	}
	
	function selectFromCookies() {
		$.each([ 'sites', 'envs', 'categories' ], function(i, id) {
			var c = cookie(id);
			if (c)
				$('#' + id + ' .selectable').each(function(i, item) {
					item = $(item);
					if (item.text() == c)
						item.click();
				});
		});
	}
	
	function selectToCookies(id, selected, text) {
		if (!selected)
			cookie(id, text);
		else {
			var found = false;
			$.each([ 'sites', 'envs', 'categories' ], function(i, item) {
				if (id == item)
					found = true;
				if (found)
					cookie(item, null);
			});
		}
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