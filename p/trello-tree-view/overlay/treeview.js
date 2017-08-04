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
		this.type = '';
		this.isClosed = '';

		this.withIsClosed = function(v){
			this.isClosed = v;
			return this;
		};

		this.withType = function(v){
			this.type = v;
			return this;
		};

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

			var subnodes = '',
				nodeTypeClass = 'node-type-'+this.type,
				expando = '',
				closedAttr = ''
				;

			if(this.nodes.length>0){
				subnodes += '<ul class="subnodelist">';
				for(var i = 0 ; i < this.nodes.length; i++){
					subnodes += this.nodes[i].toHtml();
				}
				subnodes += '</ul>';
				expando = '<span class="expando expanded"></span>';
			}

			if(this.isClosed.length > 0){
				closedAttr = 'data-trello-isClosed="'+this.closed;
			}

			var html = '<li class="nodecontainer ">'
					+ expando
                    +'<a class="nodelink '+nodeTypeClass+'" href="'+this.url+'" data-trello-id="'+this.id+'" data-trello-url="'+this.url+'" '+closedAttr+' "><span class="node_name">'+this.name+'</span></a>'
					+subnodes
					+'</li>'
					;

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
					.withType('board')
					;

				return T.lists('all');
			}).then(function(lists){
				for(var list of lists){
					var listNode = new Node(list.name)
						.withId(list.id)
						.withType('list')
						;

					for(var card of list.cards){
						var cardNode = new Node(card.name)
							.withId(card.id)
							.withUrl(card.url)
							.withType('card')
							;

						listNode.add(cardNode);
					}

					root.add(listNode);
				}

				$('body').find('#treeviewmain').html(root.toHtml());
			})
			;

	};

	var setExpandoHandler = function(){
		$('body').on('click','.expando',function(){
			var _this = $(this),
				_subNodesList = _this.closest('.nodecontainer').find('.subnodelist:first')
				;

			if(_this.hasClass('expanded')){
				_subNodesList.slideUp();
				_this.toggleClass('expanded',false);
				_this.toggleClass('collapsed',true);
			}else{
				_subNodesList.slideDown();
				_this.toggleClass('expanded',true);
                _this.toggleClass('collapsed',false);
			}

		});
	};

	/*
		Because Lists don't have links lol
	*/
	var disableListOpenHandler = function(){
		$('body').on('click','a.nodelink.node-type-list',function(e){
			e.preventDefault();
		});
	};

	var setCardOpenHandler = function(){
		$('body').on('click','a.nodelink.node-type-card',function(e){
            e.preventDefault();
            var _this = $(this);

			if(_this.attr('data-trello-isClosed')){
				T.navigate({
					url : card.url
				});
			}else{
				T.showCard(card.id);
			}

        });
	};

	me.init = function(){
		createTreeView();
		setExpandoHandler();
		disableListOpenHandler();
		setCardOpenHandler();
		me.status.init = true;
	};

	return me;

})(jQuery, TreeView);