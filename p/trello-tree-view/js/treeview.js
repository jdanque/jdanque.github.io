
var TreeView = {};
var T = TrelloPowerUp.iframe();
var Promise = TrelloPowerUp.Promise;

T.render(function(){

  if(!TreeView.status.init){
    TreeView.init();
  }

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

	var themes = [
		'theme-trello-light-gray',
		'theme-trello-blue',
		'theme-trello-green',
		'theme-trello-orange',
		'theme-trello-red',
		'theme-trello-yellow',
		'theme-trello-purple',
		'theme-trello-pink',
		'theme-trello-sky',
		'theme-trello-lime'
	];

	me.status = {
		init: false
	};

	me.options = {
		expando : {
			expandDuration : 100,
			collapseDuration : 100,
		}
	};

	me._data = '';


	var Node = function(name){
		this.id = '';
		this.name = name || '';
		this.nodes = [];
		this.url = '';
		this.type = '';
		this.isClosed = null;
		this.desc = '';
		this.labels = [];
		this.badges = {};
		this.members = '';

		this.withMembers = function(v){
			this.members = v;
			return this;
		};
		this.withLabels = function(v){
			this.labels = v;
			return this;
		};
		this.withBadges = function(v){
			this.badges = v;
			return this;
		};
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

		createBoardNode = function(board){
			return new Node(board.name)
               .withId(board.id)
               .withUrl(board.url)
               .withType('board')
               ;
		};

		createCardNode = function(card){
			return new Node(card.name)
                .withId(card.id)
                .withUrl(card.url)
                .withType('card')
                .withIsClosed(card.closed)
                .withDesc(card.desc)
                .withLabels(card.labels)
                .withBadges(card.badges)
                .withMembers(card.members)
                ;
		};

		createListNode = function(list){
			return new Node(list.name)
                .withId(list.id)
                .withType('list')
                ;
		};

		this.labelsToHtml = function(){
			var html = '<div class="labels-wrapper details-wrapper-top clearfix hidden">';
            for(var label of this.labels){
                if(!Utils.isEmpty(label.color)){
                    html += '<span title="'+label.name+'" class="card-label card-label-'+label.color+'">'+label.name+'</span>';
                }
            }
            html += '</div>';
            return html;
		};

		this.badgesToHtml = function(){
            var html = '<div class="badges-wrapper details-wrapper-btm clearfix hidden">';

            if(!Utils.isEmpty(this.badges.due)){
                html+= getBadgeHtml(this.badges.due,'due');
            }

			if(this.badges.attachments > 0){
				html+= getBadgeHtml(this.badges.attachments,'attachments');
			}

			if(this.badges.checkItems > 0){
				html+= getBadgeHtml({checkItems : this.badges.checkItems, checkItemsChecked: this.badges.checkItemsChecked},'checklist');
			}

			if(this.badges.votes > 0){
				html+= getBadgeHtml(this.badges.votes,'votes');
            }

            if(!Utils.isEmpty(this.members) && this.members.length > 0){
                html+= getBadgeHtml(this.members,'member');
            }

            html += '</div>';
            return html;
        };

		this.toHtml = function(){

			var subnodes = '',
				nodeTypeClass = 'node-type-'+this.type,
				expando = '',
				closedAttr = '',
				nodeDesc = '',
				labels = this.type === 'card' ? this.labelsToHtml() : '',
				badges = this.type === 'card' ? this.badgesToHtml() : ''
				;

			if(this.nodes.length>0){
				subnodes += '<ul class="subnodelist '+nodeTypeClass+'" >';
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
					+ labels
                    +'<span class="node_name">'+this.name+'</span>'
                    + nodeDesc
                    + badges
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
                root = Node.createBoardNode(board);

                return T.lists('all');
            }).then(function(lists){

                me._data = lists;

				for(var list of lists){
					var listNode = Node.createListNode(list);

					for(var card of list.cards){
						var cardNode = Node.createCardNode(card);

						listNode.add(cardNode);
					}

					root.add(listNode);
				}

				document.getElementById('treeviewmain').innerHTML = root.toHtml();
			})
			;
	};

	var setExpandoHandler = function(){
		return new Promise(function(resolve) {
			$('body').on('click','.expando',function(){
				var _this = $(this);
				Utils.toggleChildrenByExpando(_this, !_this.hasClass('expanded'), true);
	        });
	        resolve();
		});
	};

	var nodelinkClickHandler = function(){
		return new Promise(function(resolve){
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
			resolve();
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
		return new Promise(function(resolve){
			$('#closetreeview').on('click',function(e){
				e.preventDefault();
				T.closeOverlay().done();
			});
			resolve();
		});
	};

	var enableDragAndDropCards = function(){
		if(Utils.isEmpty(authToken)){
			return new Promise(function(resolve){ resolve(); });
		}

		return new Promise(function(resolve){
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
            resolve();
		});
	};

	var enableDragAndDropLists = function(){
		if(Utils.isEmpty(authToken)){
			return new Promise(function(resolve){ resolve(); });
		}

		return new Promise(function(resolve){
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
	        resolve();
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

	var getBadgeHtml = function(item,type){
			var html = '',
				badgeTitle = '',
				badgeText = '',
				badgeClass = ''
				;

			if(type === 'due'){
				var dueDate = moment(item);
				var now = moment().local();
				badgeText = dueDate.format('MMM DD');
				var diff = now.diff(dueDate,"hours", true);
				badgeClass = diff < 0 && diff > -25 ? 'due-soon' : diff <= 36 && diff >= 0 ? 'due-now' : diff > 36 ? 'past-due' : '';
				badgeTitle = badgeClass.length > 0 ? badgeClass.replace("-"," ") : 'Due on: '+badgeText;
			}else if(type === 'attachments'){
				badgeTitle = 'Attachments';
				badgeText = item;
			}else if(type === 'checklist'){
				badgeTitle = 'Checklist';
				badgeText = ''+item.checkItemsChecked+'/'+item.checkItems+'';
				badgeClass = item.checkItems - item.checkItemsChecked == 0 ? 'checklist-complete' : '';
			}else if(type === 'votes'){
				badgeTitle = 'Votes';
				badgeText = item;
			}else if(type === 'member'){
				badgeTitle = 'Members assigned: &#10;';
				for(var member of item){
                   badgeTitle += member.fullName + '('+member.username+'), &#10;';
                }
                badgeTitle = badgeTitle.substring(0,badgeTitle.length-7);

				badgeText = item.length;
			}

			html+=' <div class="badge '+badgeClass+'" title="'+badgeTitle+'">'
                        +'<span class="badge-icon icon-'+type+'"></span>'
                        +'<span class="badge-text">'+badgeText+'</span>'
                        +'</div>';
            return html;
	};

	var Utils = {
		 isEmpty : function(x){
		    return (x === undefined || x === null || x.length == 0);
		 },
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
			_nodeLink.children('.subnodes-count').remove();

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
		},
		compare : function (obj1, obj2) {
        	//Loop through properties in object 1
        	for (var p in obj1) {
        		//Check property exists on both objects
        		if (obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) return false;

        		switch (typeof (obj1[p])) {
        			//Deep compare objects
        			case 'object':
        				if (!Object.compare(obj1[p], obj2[p])) return false;
        				break;
        			//Compare function code
        			case 'function':
        				if (typeof (obj2[p]) == 'undefined' || (p != 'compare' && obj1[p].toString() != obj2[p].toString())) return false;
        				break;
        			//Compare values
        			default:
        				if (obj1[p] != obj2[p]) return false;
        		}
        	}

        	//Check object 2 for any extra properties
        	for (var p in obj2) {
        		if (typeof (obj1[p]) == 'undefined') return false;
        	}
        	return true;
        }
	};

	var collapseNodeContainer = function(name){
		return new Promise(function(resolve){
            $('.nodecontainer.node-type-'+name+' > .expando.expanded').each(function(){
                Utils.toggleChildrenByExpando($(this), false, false);
            });
            resolve();
        });
	};

	var setExpanded = function(){
		return T.get('board', 'private', 'expandupto')
		.then(function(expandupto){
			if(Utils.isEmpty(expandupto)){
				collapseNodeContainer('list');
			}else if(expandupto === '0'){
				collapseNodeContainer('list');
				collapseNodeContainer('board');
			}else if(expandupto === '1'){
				collapseNodeContainer('list');
			}
		});

	};

	var setTheme = function(){
		return T.get('board', 'private', 'theme')
            .then(function(theme){
                if(Utils.isEmpty(theme)){
	                theme = themes[0];
                }
                $('#maincontent')
                .toggleClass(themes.join(' '),false)
                .toggleClass(theme,true);
            });
	};

	var toggleMainContent = function(show){
		$('#maincontent').toggle(show);
	};

	me.showLists = function(){
		T.lists('all')
		.then(function(lists){
			console.log(lists);
		});
	};

	var toggleLabels = function(){
		return T.get('board', 'private', 'showlabels')
        .then(function(isEnabled){
            isEnabled = Utils.isEmpty(isEnabled) ? true : isEnabled;
            $('.labels-wrapper.hidden').toggleClass('hidden',!isEnabled);
        });
	};

	var toggleBadges = function(){
		return T.get('board', 'private', 'showbadges')
        .then(function(isEnabled){
            isEnabled = Utils.isEmpty(isEnabled) ? true : isEnabled;
            $('.badges-wrapper.hidden').toggleClass('hidden',!isEnabled);
        });
	};

	var updateTreeView = {

		isStop : false,
		interval : 1e4, //10sec

		getUpdatedLists : function(){
			return T.lists('all');
		},

		updateDOM : function(uList){
			if(!Utils.compare(uList,me._data)){

				//deleted lists
				for(var dList of me._data){
					var listObj = updateTreeView.getListObjFromArrById(dList.id, uList);
					if(Utils.isEmpty(listObj)){
						$('.nodelink.node-type-list[data-trello-id="'+dList.id+'"]')
							.parents('.nodecontainer.node-type-list').eq(0)
							.remove();
					}
				}

				//update existing and add new lists
				for(var i = 0; i < uList.length; i++){
					var aList = uList[i];
                    var listObj = updateTreeView.getListObjFromArrById(aList.id, me._data);

                    if(!Utils.isEmpty(listObj)){
                        //update current existing lists and cards
						var linkNodeContainer = $('.subnodelist.node-type-board')
							.find('.nodelink[data-trello-id="'+aList.id+'"]')
							.closest('.nodecontainer');

						//check position
						if(linkNodeContainer.index() !== i){
							//list is in a different position than before
							if(i==0){
								$('.subnodelist.node-type-board')
	                                .find('.nodecontainer.node-type-list')
	                                .eq(i).before(linkNodeContainer);
							}else{
								$('.subnodelist.node-type-board')
									.find('.nodecontainer.node-type-list')
									.eq(i).after(linkNodeContainer);
							}
						}

						//update cards
						//check deleted cards
						//update existing cards
						//check cards positions
						//add new cards



                    }else{
                        //create new lists and cards not existing currently
                        var listNode = Node.createListNode(aList);

                        for(aCard of aList.cards){
							listNode.add(Node.createCardNode(aCard));
                        }

                        $('.subnodelist.node-type-board').append(listNode.toHtml());
						var _expando = $('.subnodelist.node-type-board')
							.find('.nodelink[data-trello-id="'+listNode.id+'"]')
							.closest('.nodecontainer').children('.expando');
						 Utils.toggleChildrenByExpando(_expando, false, false);
                    }
                }


			}
		},

		getListObjFromArrById : function)(id,listArr){
			for(var l of listArr){
				if(l.id === id){
					return l;
				}
			}

			return null;
		},

		start : function(){
			return new Promise.resolve().then(function resolver() {
                return updateTreeView.getUpdatedLists()
                .then(function(lists){

                    updateTreeView.updateDOM(uList);

                    if(!updateTreeView.isStop)
                        resolver();
                });
            }).catch((error) => {
                throw error;
            });
		}
	};

	me.init = function(){
		window.focus();

        if (document.activeElement) {
            document.activeElement.blur();
        }

		T.get('member', 'private', 'token').then(function(token){

			authToken = token;

//	            setRootAsCurrentNode();
//	            setHoverHandler();
//	            setKeyboardShortcuts();

			createTreeView()
			.then(setTheme)
			.then(setExpandoHandler)
			.then(setExpanded)
			.then(nodelinkClickHandler)
			.then(setCloseOverlay)
			.then(enableDragAndDropCards)
			.then(enableDragAndDropLists)
			.then(toggleLabels)
			.then(toggleBadges)
//			.then(updateTreeView.start)
			.then(function(){
                toggleMainContent(true);
			})
			;
		});

		me.status.init = true;
	};

	return me;

})(jQuery, TreeView);

