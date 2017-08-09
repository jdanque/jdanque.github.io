var TreeView = {};
var T = TrelloPowerUp.iframe();

(function($, me){
	me.API_KEY = 'e3e4df7f95e0b1942c0b82a9a2c301f6';
	var authToken = '';

	me.status = {
		init: false
	};

	me.options = {
		expando : {
			expandDuration : 100,
			collapseDuration : 100,
		}
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
				subnodes += '<ul class="subnodelist '+nodeTypeClass+'">';
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

			var html = '<li class="nodecontainer '+nodeTypeClass+'">'
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

				document.getElementById('treeviewmain').innerHTML = root.toHtml();
			})
			;

	};

	var setExpandoHandler = function(){
		$('body').on('click','.expando',function(){
            var _this = $(this),
                _subNodesList = _this.closest('.nodecontainer').find('.subnodelist:first'),
                _nodeLink = _this.closest('.nodecontainer').find('a.nodelink:first')
                ;

            if(_this.hasClass('expanded')){
                _subNodesList.slideUp(me.options.expando.collapseDuration);
                _subNodesList.find('.nodecontainer').toggleClass('hidden-node',true);
                _this.toggleClass('expanded',false);
                _this.toggleClass('collapsed',true);
				_nodeLink.prepend('<span class="subnodes-count">'+_subNodesList.children('.nodecontainer').length+'</span>');
            }else{
                _subNodesList.slideDown(me.options.expando.expandDuration);
                _subNodesList.find('.nodecontainer').toggleClass('hidden-node',false);
                _this.toggleClass('expanded',true);
                _this.toggleClass('collapsed',false);
                _nodeLink.children('.subnodes-count').remove();
            }

        });
	};

	var nodelinkClickHandler = function(){
		$('body').on('click','a.nodelink',function(e){
			var _this = $(this);
			e.preventDefault();

			if(!_this.hasClass('currentNode')){
				setCurrentNode(_this);
			}else {
                openLinkInNode(_this);
            }

		});
	};

	var openLinkInNode = function(nodelink){
		 if(nodelink.hasClass('node-type-card')){
			 if(nodelink.attr('data-trello-isClosed')){
		         T.navigate({ url : nodelink.attr('data-trello-url') })
		             .then(function(){
		                 T.closeOverlay();
		             });
		     }else{
		         T.showCard(nodelink.attr('data-trello-id'))
		             .then(function(){
		                 T.closeOverlay();
		             });
		     }
         }
	};

	var setCurrentNode = function(nodeLink){
	     $('.nodeLink.currentNode').removeClass('currentNode');
	     nodeLink.toggleClass('currentNode',true);
	};

	var setRootAsCurrentNode = function(){
		setCurrentNode($('.nodelink.node-type-board'));
	};

	var setHoverHandler = function(){
        $('body').on('mouseover','.nodelink',function(){
            Utils.removeElemById(hovermenu);

            if($('.grabbing').length < 1){
				var _this = $(this);
				var hovermenu = 'hovermenu';
	            var html = '<span style="height:'+_this.outerHeight()+'px" id="'+hovermenu+'"></span>';

	            _this.before(html);
            }

        });

        $('body').on('mouseout','.nodelink',function(){
            Utils.removeElemById('hovermenu');
        });
	};

	var setKeyboardShortcuts = function(){
			var h = '.nodeLink.currentNode',
	            n = '.nodecontainer',
	            l = 'a.nodelink',
	            i = ''
            ;

		document.addEventListener('keyup', function(ev) {
          switch(ev.keyCode) {
           case 27 :
                T.closeOverlay().done();
                break;
           //up
           case 38 :
                ev.preventDefault();
                ev.stopPropagation();

                i = $(h).closest(n).index(n);

                if(i-1>=0){
                    if($(n).eq(i-1).hasClass('hidden-node')){
                        do{
							i--;
                        }while(i-1>=0 && $(n).eq(i-1).hasClass('hidden-node'));

                        setCurrentNode($(n).eq(i-1).children(l));
                    }else{
                        setCurrentNode($(n).eq(i-1).children(l));
                    }
                }

                break;

            //right
            case 39 :
                ev.preventDefault();
                ev.stopPropagation();
                if($(h).closest(n).children('.expando.collapsed').length>0){
                    $(h).closest(n).children('.expando').click();
                }
                 break;

            //down
            case 40 :
                ev.preventDefault();
                ev.stopPropagation();

                i = $(h).closest(n).index(n);

                if(i+1<=$(n).length){
					if($(n).eq(i+1).hasClass('hidden-node')){
                        do{
                            i++;
                        }while(i+1<=$(n).length && $(n).eq(i+1).hasClass('hidden-node'));
                    }

                    if($(n).eq(i+1).length > 0){
                        setCurrentNode($(n).eq(i+1).children(l));
                    }
                }


                break;

            //left
            case 37 :
                ev.preventDefault();
                ev.stopPropagation();
                   if($(h).closest(n).children('.expando.expanded').length>0){
                       $(h).closest(n).children('.expando').click();
                   }
                break;

            //enter
            case 13 :
                ev.preventDefault();
                ev.stopPropagation();
                openLinkInNode($(h));
                break;

            default:break;
          }
        });

	};

	var setCloseOverlay = function(){

		$('#closetreeview').on('click',function(e){
			e.preventDefault();
			T.closeOverlay().done();
		});

	};

	var setDragAndDropCards = function(){
		$('.subnodelist.node-type-list').sortable({
            placeholder: "list-card placeholder nodecontainer",
            connectWith: ".subnodelist.node-type-list",
            cursor: "move",
            tolerance: "pointer",
            start: function( event, ui ) {
                ui.placeholder.height(ui.item.height());
	            ui.item.toggleClass('grabbing',true);
	            ui.item.data("prevPos",ui.item.parents('.nodecontainer.node-type-list:first').find('.nodecontainer.node-type-card').index(ui.item));
	            ui.item.data("prevListID",ui.item.parents('.nodecontainer.node-type-list:first').find('.nodelink.node-type-list:first').attr('data-trello-id'));
            },
	        stop: function( event, ui ) {
	            ui.item.toggleClass('grabbing',false);
	            updateCardPosition(ui.item);
	        }
        });
	};

	var setDragAndDropLists = function(){

		$('.subnodelist.node-type-board').sortable({
            placeholder: "list-card placeholder nodecontainer",
	        connectWith: ".subnodelist.node-type-board",
	        cursor: "move",
            start: function( event, ui ) {
                ui.placeholder.height(ui.item.height());
                ui.item.toggleClass('grabbing',true);
            },
            stop: function( event, ui ) {
                ui.item.toggleClass('grabbing',false);
            }
        });
	};

	var calcPos = function(newPos,leftPos,rightPos){
		var
			r = rightPos != -1 ? rightPos : 0,
			l = leftPos != -1 ? leftPos : 0 ,
			a = 65536
			;

		return (newPos==0) ? r/2 : (newPos == -1) ? l+a : (l+r)/2 ;
	};

	var updateCardPosition = function(card){
		var
			container = card.parents('.nodecontainer.node-type-list:first'),
			newList = container.find('.nodelink.node-type-list:first').attr('data-trello-id'),
			cardsInList = container.find('.nodecontainer.node-type-card'),
			newPos = cardsInList.index(card),
			leftCardID = newPos > 0 ? cardsInList.eq(newPos-1).find('.nodelink.node-type-card:first').attr('data-trello-id') : -1,
			rightCardID = cardsInList.length === (newPos+1) ? -1 : cardsInList.eq(newPos+1).find('.nodelink.node-type-card:first').attr('data-trello-id'),
			cardID = card.find('.nodelink.node-type-card:first').attr('data-trello-id')
			;

		if(card.data("prevPos") == newPos &&
			card.data("prevListID") == newList)
			return;

		Utils.getCardPos(leftCardID).then(function(leftCardPos){
			leftCardPos = leftCardPos != -1 ? leftCardPos._value : -1;

			Utils.getCardPos(rightCardID).then(function(rightCardPos){
					rightCardPos = rightCardPos != -1 ? rightCardPos._value : -1;
					cardID = card.find('.nodelink.node-type-card:first').attr('data-trello-id')
					newPos = calcPos(newPos,leftCardPos, rightCardPos);

					return new Promise((resolve, reject) => {
						resolve({
							'cardID' : cardID,
							'newList' : newList,
							'newPos' : newPos
						});
					});

            }).then(function(d){
                window.Trello.put("cards/" + d.cardID+ "/?idList="+d.newList+"&pos="+d.newPos+"&token=" + authToken,
                    //success
                    function(data){
                        return data;
                    },
                    //error
                    function(reason){
                        return reason;
                    }
                );
            });
        });



	};


	var Utils = {
		removeElemById : function(id){
			var x = document.getElementById(id);
			if(x)
				x.parentNode.removeChild(x);
		},
		getCardPos : function(id){
			return new Promise((resolve, reject) => {
				if(id != -1){
	                window.Trello.get("cards/" + id+ "/pos"+ "?"+ "&token=" + authToken,
		                //success
		                function(data){
		                    resolve(data);
		                },
		                //error
		                function(reason){
		                    reject(reason);
		                }
		            );
				}else{
					resolve(id);
				}
			});


		}
	};


	me.init = function(){
		T.get('member', 'private', 'token').then(function(token){

			authToken = token;

			createTreeView()
			.then(function(){
				setExpandoHandler();
	            nodelinkClickHandler();
	            setRootAsCurrentNode();
	            setHoverHandler();
	            setKeyboardShortcuts();
	            setCloseOverlay();

				if(authToken != null && authToken.length != 0){
					setDragAndDropCards();
		//			setDragAndDropLists();
				}
			});
		});

		me.status.init = true;
	};

	return me;

})(jQuery, TreeView);