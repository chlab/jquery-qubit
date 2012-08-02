(function($){
	$.fn.qubit = function( options ) {
		return this.each(function() {
			var qubit = new Qubit(this, options);
		});
	};
	var Qubit = function( el, options ) {
		var self = this;
		this.container = el = $(el);
		$('input[type=checkbox]', el).on('change', function(e) {
			self.process(e.target);
		});
		$('input[type=checkbox]:checked').each(function() {
			self.process(this)
		});
	};
	Qubit.prototype = {
		itemSelector: 'li',
		process: function( checkbox ) {
			var checkbox = $(checkbox),
				parentItems = checkbox.parents(this.itemSelector),
				self = this;
			// all children get this state
			$('input[type=checkbox]', parentItems.eq(0)).each(function() {
				self.setChecked(this, checkbox.prop('checked'));
			});
			this.processParents(checkbox);
		},
		processParents: function( checkbox ) {
			var checkbox = $(checkbox),
				parentItems = checkbox.parents(this.itemSelector),
				parent = parentItems.eq(1).children('input[type=checkbox]');
			if( parent.length > 0 ) {
				var siblings = this.getSiblings(checkbox, parentItems.eq(1)),
					checked = siblings.filter(':checked'),
					oldValue = this.getValue(parent), parentChecked = null;
				// check parent is within our scope
				if( !jQuery.contains(this.container, parent) ) {
					parent = null;
				}
				// if all siblings are checked
				if( siblings.length == checked.length )
					parentChecked = true;
				// else if some are checked
				else if( checked.length > 0
						|| siblings.filter(this.isIndeterminate).length > 0 )
					this.setIndeterminate(parent, true);
				// else none are checked
				else
					parentChecked = false;
				// udpate the parent
				if( parentChecked !== null )
					this.setChecked(parent, parentChecked);
				// and go up the tree if it changed
				if( oldValue !== this.getValue(parent) )
					this.processParents(parent);
			}
		},
		setChecked: function( checkbox, value ) {
			$(checkbox).prop({
				'checked': value,
				'indeterminate': false
			});
		},
		setIndeterminate: function( checkbox, value ) {
			$(checkbox).prop({
				'indeterminate': value,
				'checked': null
			});
		},
		getSiblings: function( checkbox, listItem ) {
			listItem = listItem || checkbox.parents(this.itemSelector).eq(1);
			return $('> ol > li > input[type=checkbox]', listItem);
		},
		isIndeterminate: function() {
			return $(this).prop('indeterminate');
		},
		getValue: function( checkbox ) {
			return checkbox.prop('indeterminate') ? null : checkbox.prop('checked');
		}
	};
}(jQuery));