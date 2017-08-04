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
		this.isClosed = null;
		this.desc = '';

		this.withDesc = function(v){
			this.desc = v;
			return this;
		};

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
				closedAttr = '',
				nodeDesc = ''
				;

			if(this.nodes.length>0){
				subnodes += '<ul class="subnodelist">';
				for(var i = 0 ; i < this.nodes.length; i++){
					subnodes += this.nodes[i].toHtml();
				}
				subnodes += '</ul>';
				expando = '<span class="expando expanded"></span>';
			}

			if(this.isClosed !== null){
				closedAttr = 'data-trello-isClosed='+this.closed;
			}

			if(this.desc.length>0){
				nodeDesc = '<span class="node_desc">'+this.desc+'</span>';
			}

			var html = '<li class="nodecontainer ">'
					+ expando
                    +'<a class="nodelink '+nodeTypeClass+'" href="'+this.url+'" data-trello-id="'+this.id+'" data-trello-url="'+this.url+'" '+closedAttr+' ">'
                    +'<span class="node_name">'+this.name+'</span>'
                    + nodeDesc
                    +'</a>'
					+ subnodes
					+'</li>'
					;

			return html;
		};
	};

	var createTreeView = function(){
			var root = null;

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
							.withIsClosed(card.closed)
							.withDesc(card.desc)
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
		disable board link open handler instead expando
		Because you're on this current board
		but todo for future, if planning to include other boards
	*/
	var disableBoardOpenHandler = function(){
		$('body').on('click','a.nodelink.node-type-board',function(e){
			e.preventDefault();
			$(this).siblings('.expando').click();
		});
	};

	/*
		disable list link open handler instead expando
		Because Lists don't have links lol
	*/
	var disableListOpenHandler = function(){
		$('body').on('click','a.nodelink.node-type-list',function(e){
			e.preventDefault();
			$(this).siblings('.expando').click();
		});
	};

	var setCardOpenHandler = function(){
		$('body').on('click','a.nodelink.node-type-card',function(e){
            e.preventDefault();
            var _this = $(this);

			if(_this.attr('data-trello-isClosed')){
				T.navigate({ url : _this.attr('data-trello-url') })
					.then(function(){
						T.closeOverlay();
					});
			}else{
				T.showCard(_this.attr('data-trello-id'))
					.then(function(){
                        T.closeOverlay();
                    });
			}

        });
	};

	var setHoverHandler = function(){
		/*set initial hover to board root*/
		$('.hovermenu').remove();
        var html = '<span style="height:'+$('.nodelink.node-type-board').height()+'px" class="hovermenu"></span>';
        $('.nodelink.node-type-board').before(html);


		$('body').on('hover','.nodelink',function(){
			var _this = $(this);

			$('.hovermenu').remove();
			var html = '<span style="height:'+_this.height()+'px" class="hovermenu"></span>';
			_this.before(html);
		});
	};

	var setKeyboardShortcuts = function(){
		$('body').on('keyup',function(ev){
			console.log(ev);
		});
	};

	me.init = function(){
		createTreeView();
		setExpandoHandler();
		disableBoardOpenHandler();
		disableListOpenHandler();
		setCardOpenHandler();
		setHoverHandler();
		setKeyboardShortcuts();
		me.status.init = true;
	};

	return me;

})(jQuery, TreeView);