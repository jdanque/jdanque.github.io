
var TreeView = {};
var T = TrelloPowerUp.iframe();
var Promise = TrelloPowerUp.Promise;

T.render(function(){

  if(!TreeView.status.init){
    TreeView.init();
  }

  setTheme();

});

// close overlay if user clicks outside our content
document.addEventListener('click', function(e) {
  if(e.target.tagName == 'BODY') {
    T.closeOverlay().done();
  }
});

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
			var _this = $(this);
			Utils.toggleChildrenByExpando(_this, !_this.hasClass('expanded'), true);
        });
	};

	var nodelinkClickHandler = function(){
		$('body').on('click','a.nodelink',function(e){
			var _this = $(this);
			e.preventDefault();

            openLinkInNode(_this);

            if(!_this.hasClass('node-type-card')){
                var _expando = _this.closest('.nodecontainer').children('.expando');

				Utils.toggleChildrenByExpando(_expando, !_expando.hasClass('expanded'), true);

            }

//			if(!_this.hasClass('currentNode')){
//				setCurrentNode(_this);
//			}else {
//                openLinkInNode(_this);
//            }

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
            Utils.removeHoverMenu();

            if($('.grabbing').length == 0){
				var _this = $(this);
	            var html = '<span style="height:'+_this.outerHeight()+'px" id="hovermenu"></span>';

	            _this.before(html);
            }

        });

        $('body').on('mouseout','.nodelink',function(){
            Utils.removeHoverMenu();
        });
	};

	var setKeyboardShortcuts = function(){
			var h = '.nodeLink.currentNode',
	            n = '.nodecontainer',
	            l = 'a.nodelink',
	            i = ''
            ;


        document.addEventListener('keydown', function(ev) {
            switch(ev.keyCode) {
				case Key.UP :
					ev.preventDefault();
					break;

				case Key.DOWN :
					ev.preventDefault();
					break;
                default:break;
            }

        });

		document.addEventListener('keyup', function(ev) {
          switch(ev.keyCode) {
           case Key.ESC :
                if($('.grabbing').length == 0){
                    T.closeOverlay().done();
                }else{
                    $('.subnodelist.node-type-list').sortable("cancel");
                }
                break;

           case Key.UP :
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

                    while(Utils.isCurrentNodeInView() == false){
                        var elem = $('.currentNode'),
                        treeviewmain = $('#treeviewmain');
                        treeviewmain.scrollTop(treeviewmain.scrollTop() - elem.outerHeight() - 5);
                    }
                }

                break;

            case Key.RIGHT :
                ev.preventDefault();
                ev.stopPropagation();
                if($(h).closest(n).children('.expando.collapsed').length>0){
                    $(h).closest(n).children('.expando').click();
                }
                 break;

            case Key.DOWN :
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

                        while(Utils.isCurrentNodeInView() == false){
                            var elem = $('.currentNode'),
                                treeviewmain = $('#treeviewmain');
                                treeviewmain.scrollTop(treeviewmain.scrollTop() + elem.outerHeight() + 5);
                        }
                    }
                }


                break;

            case Key.LEFT :
                ev.preventDefault();
                ev.stopPropagation();
                   if($(h).closest(n).children('.expando.expanded').length>0){
                       $(h).closest(n).children('.expando').click();
                   }
                break;

            //enter
            case Key.ENTER :
            case Key.NUMPAD_ENTER :
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

	var enableDragAndDropCards = function(){
		$('.subnodelist.node-type-list').sortable({
            placeholder: "list-card placeholder nodecontainer",
            connectWith: ".subnodelist.node-type-list",
            cursor: "move",
            tolerance: "intersect",
            start: function( event, ui ) {
                Utils.removeHoverMenu();
                ui.placeholder.height(ui.item.height());
	            var p  = ui.item.parents('.nodecontainer.node-type-list').eq(0);
	            ui.item.toggleClass('grabbing',true)
	                .data("prevPos",p.find('.nodecontainer.node-type-card').index(ui.item))
	                .data("prevListID",Utils.getListDataTrelloId(p));
            },
	        stop: function( event, ui ) {
	            ui.item.toggleClass('grabbing',false);
	            updateCardPosition(ui.item);
	        }
        });

	};

	var enableDragAndDropLists = function(){

		$('.subnodelist.node-type-board').sortable({
            placeholder: "list-card placeholder nodecontainer",
	        connectWith: ".subnodelist.node-type-board",
	        cursor: "move",
	        tolerance: "intersect",
            start: function( event, ui ) {
                Utils.removeHoverMenu();
                ui.placeholder.height(ui.item.height());
                var p  = ui.item.parents('.nodecontainer.node-type-board').eq(0);
                ui.item.toggleClass('grabbing',true)
                    .data("prevPos",p.find('.nodecontainer.node-type-list').index(ui.item))
                    ;
            },
            stop: function( event, ui ) {
                ui.item.toggleClass('grabbing',false);
                updateListPosition(ui.item);
            }
        });
	};

	var calcPos = function(newPos,leftPos,rightPos){
		var
			r = rightPos != -1 ? rightPos : 0,
			l = leftPos != -1 ? leftPos : 0 ,
			a = 65536
			;

		return (newPos==0) ? r/2 : (newPos == -1 || r == 0) ? l+a : (l+r)/2 ;
	};

	var updateCardPosition = function(card){

		var
			container = card.parents('.nodecontainer.node-type-list').eq(0),
			cardsInList = container.find('.nodecontainer.node-type-card'),
			newPos = cardsInList.index(card),
			newList = Utils.getListDataTrelloId(container)
			;

		if(card.data("prevPos") == newPos && card.data("prevListID") == newList)
			return;

		Utils.elemIsLoading(card.find('.nodelink.node-type-card').eq(0), true);

		var
			leftCardID = newPos > 0 ? Utils.getCardDataTrelloId(cardsInList.eq(newPos-1)) : -1,
			rightCardID = cardsInList.length === (newPos+1) ? -1 : Utils.getCardDataTrelloId(cardsInList.eq(newPos+1)),
			cardID = Utils.getCardDataTrelloId(card),
			leftCardPos = -1,
			rightCardPos = -1
			;


		Utils.getCardPos(leftCardID)
		.then(function(pos){

			leftCardPos = pos != -1 ? pos._value : -1;

			return Utils.getCardPos(rightCardID);
		}).then(function(pos){
			rightCardPos = pos != -1 ? pos._value : -1;
			cardID = Utils.getCardDataTrelloId(card)
			newPos = calcPos(newPos,leftCardPos, rightCardPos);

			return new Promise((resolve, reject) => {
				resolve({
					'cardID' : cardID,
					'newList' : newList,
					'newPos' : newPos
				});
			});
		}).then(function(d){
			var el = card.find('.nodelink.node-type-card').eq(0);
			window.Trello.put("cards/" + d.cardID+ "/?idList="+d.newList+"&pos="+d.newPos+"&token=" + authToken,
			  //success
			  function(data){
			      Utils.elemIsLoading(el, false);
			      return data;
			  },
			  //error
			  function(reason){
			      Utils.elemIsLoading(el, false);
			      return reason;
			  }
			);
		});
	};

	var updateListPosition = function(list){
		var
            container = list.parents('.nodecontainer.node-type-board').eq(0),
            listInBoard = container.find('.nodecontainer.node-type-list'),
            newPos = listInBoard.index(list)
            ;

        if(list.data("prevPos") == newPos){
            return;
        }

        Utils.elemIsLoading(list.find('.nodelink.node-type-list').eq(0), true);

        var
            leftListID = newPos > 0 ? Utils.getListDataTrelloId(listInBoard.eq(newPos-1)) : -1,
            rightListID = listInBoard.length === (newPos+1) ? -1 : Utils.getListDataTrelloId(listInBoard.eq(newPos+1)),
            listID = Utils.getListDataTrelloId(list),
            leftListPos = -1,
            rightListPos = -1
            ;

		Utils.getListPos(leftListID)
		.then(function(pos){

			leftListPos = pos != -1 ? pos._value : -1;

			return Utils.getListPos(rightListID);
		}).then(function(pos){
			rightListPos = pos != -1 ? pos._value : -1;
			listID = Utils.getListDataTrelloId(list)
			newPos = calcPos(newPos,leftListPos, rightListPos);

			return new Promise((resolve, reject) => {
				resolve({
					'listID' : listID,
					'newPos' : newPos
				});
			});
		}).then(function(d){
			var el = list.find('.nodelink.node-type-list').eq(0);

			window.Trello.put("lists/" + d.listID+ "/?pos="+d.newPos+"&token=" + authToken,
			  //success
			  function(data){
			      Utils.elemIsLoading(el, false);
			      return data;
			  },
			  //error
			  function(reason){
			      Utils.elemIsLoading(el, false);
			      return reason;
			  }
			);
		});

	};

	var Utils = {
		 elemIsLoading : function(elem,isTrue){
	        elem.toggleClass('loading',isTrue);
		 },
		 isCurrentNodeInView : function(){
		    var elem = $('.currentNode');

		    var treeviewmain = $('#treeviewmain');

	        var docViewTop = treeviewmain.offset().top;
            var docViewBottom = docViewTop + $('#mainheader').height() + treeviewmain.outerHeight();

			var elemTop = $(elem).offset().top;
			var elemBottom = elemTop + $(elem).outerHeight();

			return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
        },
        removeHoverMenu : function(){
            Utils.removeElemById('hovermenu');
        },
		removeElemById : function(id){
			var x = document.getElementById(id);
			if(x)
				x.parentNode.removeChild(x);
		},
		getCardDataTrelloId : function(el){
			return el.find('.nodelink.node-type-card').eq(0).attr('data-trello-id');
		},
		getListDataTrelloId : function(el){
			return el.find('.nodelink.node-type-list').eq(0).attr('data-trello-id');
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
		},
		getListPos : function(id){
			return new Promise((resolve, reject) => {
				if(id != -1){
	                window.Trello.get("lists/" + id+ "/pos"+ "?"+ "&token=" + authToken,
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
		},
		toggleChildrenByExpando : function(_expando, isShow, withAnimation){
			var _this = _expando,
			    _nodeContainer = _this.closest('.nodecontainer'),
			    _subNodesList = _nodeContainer.find('.subnodelist').eq(0),
			    _nodeLink = _nodeContainer.find('a.nodelink').eq(0)
			    ;

			if(isShow){
				if(withAnimation){
			        _subNodesList.slideDown(me.options.expando.expandDuration);
				}else{
					_subNodesList.show();
				}
		        _subNodesList.find('.nodecontainer').toggleClass('hidden-node',false);
			    _this.toggleClass('expanded',true)
			        .toggleClass('collapsed',false);
			    _nodeContainer.toggleClass('collapsed',false);
			   _nodeLink.children('.subnodes-count').remove();
			}else{
			    if(withAnimation){
		            _subNodesList.slideUp(me.options.expando.collapseDuration);
			    }else{
			        _subNodesList.hide();
			    }
		        _subNodesList.find('.nodecontainer').toggleClass('hidden-node',true);
			    _this.toggleClass('expanded',false)
			        .toggleClass('collapsed',true);
			    _nodeContainer.toggleClass('collapsed',true);
			    _nodeLink.prepend('<span class="subnodes-count">'+_subNodesList.children('.nodecontainer').length+'</span>');
			}
		}
	};

	var hideLists = function(){
		$('.nodecontainer.node-type-list > .expando.expanded').each(function(){
			Utils.toggleChildrenByExpando($(this), false, false);
		});

	};

	var setTheme = function(){
		return new Promise(function(){
			T.render(function(){
				T.get('board', 'private', 'theme')
				.then(function(theme){
					$('#maincontent').toggleClass(theme,true);
				});
			});
		});
	};

	me.init = function(){
		window.focus();

        if (document.activeElement) {
            document.activeElement.blur();
        }

		T.get('member', 'private', 'token').then(function(token){

			authToken = token;

			createTreeView()
			.then(setTheme)
			.then(function(){
				setExpandoHandler();
				hideLists();
	            nodelinkClickHandler();
//	            setRootAsCurrentNode();
//	            setHoverHandler();
//	            setKeyboardShortcuts();
	            setCloseOverlay();

				if(authToken != null && authToken.length != 0){
					enableDragAndDropCards();
					enableDragAndDropLists();
				}
			});
		});

		me.status.init = true;
	};

	return me;

})(jQuery, TreeView);

