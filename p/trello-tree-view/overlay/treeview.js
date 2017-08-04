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
			var html = '<li class="nodecontainer">';
				html += '<a href="'+this.url+'"><span class="node_name">'+this.name+'</span></a>';
			if(this.nodes.length>0){
				html += '<ul class="subnodelist">';
				for(var i = 0 ; i < this.nodes.length; i++){
					html += this.nodes[i].toHtml();
				}
				html += '</ul>';
			}

			html += '</li>';

			return html;
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
				for(var list of lists){
					var listNode = new Node(list.name)
						.withId(list.id)
						;

					for(var card of list.cards){
						var cardNode = new Node(card.name)
							.withId(card.id)
							.withUrl(card.url)
							;

						listNode.add(cardNode);
					}

					root.add(listNode);
				}

				$('body').find('#treeviewmain').html(root.toHtml());
			})
			;

	};

	me.init = function(){
		createTreeView();

		me.status.init = true;
	};

	return me;

})(jQuery, TreeView);