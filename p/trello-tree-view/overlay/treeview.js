var TreeView = {};
var T = TrelloPowerUp.iframe();

(function($, me){
	me.status = {
		init: false
	};


	var Node = function(name){
		this.id = '';
		this.name = name || '';
		this.nodes = [];
		this.url = '';

		this.withId = function(v){
			this.id = v;
			return this;
		};

		this.withName = function(v){
            this.name = v;
            return this;
        };

        this.withUrl = function(v){
            this.url = v;
            return this;
        };

		this.add = function(node){
			this.nodes.push(node);
		};

		this.toHtml = function(){
		};
	};

	var createTreeView = function(){
		var context = T.getContext(),
			root = null
			;

		return T.board('all')
			.then(function(board){
				root = new Node(board.name)
					.withId(board.id)
					.withUrl(board.url)
					;

				return T.lists('all');
			}).then(function(lists){
				for(var i=0; i<lists.length; i++){
					var list = lists[i];
					var listNode = new Node(list.name)
						.withId(list.id)
						;

					root.add(listNode);
				}
				console.log('done');
			})
			;

	};

	me.init = function(){
		createTreeView();

		me.status.init = true;
	};

	return me;

})(jQuery, TreeView);