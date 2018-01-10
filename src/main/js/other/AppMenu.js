/**
 * View that controls the menu at the top of the CASS Manager
 * app. Controls the loggedIn/loggedOut status of the menu and
 * handles what happens when clicking on menu items.
 * 
 * @class AppMenu
 * @author devlin.junker@eduworks.com
 */
var AppMenu = (function (AppMenu) {

    /**
     * Handles selecting the current identity that the user wants
     * to act as. This connects to the IdentityController and selects
     * the identity then changes the menu to show the selected identity.
     *
     * @memberOf AppMenu
     * @method selectKey
     * @private
     * @param {String} ppk
     * 			PEM representation of PPK
     */
    function selectKey(ppk) {
        $("#appMenuIdentityList").find(".fake-a").removeClass("selected");
        $("#appMenuIdentityList").find("[title='" + ppk + "']").addClass("selected");

        AppController.identityController.select(ppk);

        ScreenManager.replaceScreen(ScreenManager.getCurrentScreen());

        $("#appMenuUserIdentity").children().first().text(AppController.identityController.selectedIdentity.displayName + " @ " + AppController.serverController.selectedServerName);
    }

    var PUBLIC_NAME = "Public";
    var PUBLIC_TITLE = "No Personal Identity, all objects created will be owned by the public";

    /**
     * Deselects the users identity, so the user is acting as public and not
     * under a specific key identity. Changes the menu to match.
     *
     * @memberOf AppMenu
     * @method deselectKey
     * @private
     */
    function deselectKey() {
        $("#appMenuIdentityList").find(".fake-a").removeClass("selected");
        $("#appMenuIdentityList").find("[title='" + PUBLIC_TITLE + "']").addClass("selected");

        AppController.identityController.unselect();

        ScreenManager.replaceScreen(ScreenManager.getCurrentScreen());

        $("#appMenuUserIdentity").children().first().text(PUBLIC_NAME + " @ " + AppController.serverController.selectedServerName);
    }

    /**
     * Builds the list of possible key-based identities of the
     * currently logged in user in the menu for selecting/deselecting
     *
     * @memberOf AppMenu
     * @method buildIdentityList
     * @private
     */
    function buildIdentityList() {
        var identities = EcIdentityManager.ids;

        $("#sessionIdentitySelect").find("option[data-id]").remove();

        var identitySelected = false;
        for (var index in identities) {
            var ppk = identities[index].ppk.toPem().replaceAll("\r?\n", "");
            var name = identities[index].displayName;

            var option = $("<option data-id='true' value='"+ppk+"'></option>");
            option.text(name);


            if (AppController.identityController.selectedIdentity != undefined &&
                name == AppController.identityController.selectedIdentity.displayName) {
                option.prop("selected", true);
                identitySelected = true;
            }
            $("#sessionIdentitySelect").prepend(option);


           // element.click(ppk, function (event) {
           //     selectKey(event.data);
           // });
        }

        var container = $("<option data-id='true' value='public'>PUBLIC_NAME</option>");


        container.prepend(container);
        $("#appMenuIdentityList").prepend(container);
    }

    /**
	 * Function to pass to the callback parameter of the login modal,
	 * to be called when the user has successfully logged in.
	 * 
	 * @memberOf AppMenu
	 * @method loginModalCallback
	 * @private
	 */
	function loginModalCallback(){
		var screenName;
		
		if(ScreenManager.getCurrentScreen().getDisplayName != null){
			screenName = ScreenManager.getCurrentScreen().getDisplayName();
		}else{
			screenName = ScreenManager.getCurrentScreen().displayName;
		}
		
		if(screenName == WelcomeScreen.displayName){
			ModalManager.hideModal();
			ScreenManager.changeScreen(new UserIdentityScreen())
		}else{
			ModalManager.hideModal();
			ScreenManager.replaceScreen(ScreenManager.getCurrentScreen());
		}
	}
	
	/**
	 * Function to build the a list item of a recently viewed competency
	 * 
	 * @memberOf AppMenu
	 * @method buildCompetencyItem
	 * @private
	 * @param {String} compId
	 * 			ID of a competency to build an item for
	 */
	function buildCompetencyItem(compId){
		compId = EcRemoteLinkedData.trimVersionFromUrl(compId);
		if($("#appMenuRecentList li[data-id='"+compId+"']").length == 0){
			EcCompetency.get(compId, function(comp){
				var recentListItem = $("<li data-recent='competency'><a></a></li>")
				recentListItem.attr("data-id", compId);
				recentListItem.find("a").text(comp.getName());
				recentListItem.find("a").attr("title", compId);
				recentListItem.find("a").attr("href", "#"+CompetencyViewScreen.prototype.getDisplayName()+"?id="+compId)
				recentListItem.find("a").click(function(ev){
					ev.preventDefault();
					ScreenManager.changeScreen(new CompetencyViewScreen(comp));
					return false;
				})
				$("#appMenuCompetencyListStart").after(recentListItem);
				$("#appMenuCompetencyListStart").removeClass("hide");
			}, function(){
				AppController.storageController.removeRecent(EcCompetency.myType, compId);
			});
		}
	}
	
	/**
	 * Function to build the list of recently viewed competencies
	 * 
	 * @memberOf AppMenu
	 * @method buildCompetencyList
	 * @private
	 * @param {Array<String>} compList
	 * 			List of competency IDs
	 */
	function buildCompetencyList(compList){
		if(compList != null && compList.length > 0){
			$("#appMenuNoRecent").addClass("hide");
			$("#appMenuCompetencyListStart").nextAll("[data-recent='competency']").remove();
			for(var idx in compList){
				buildCompetencyItem(compList[idx]);
			}
		}else{
			$("#appMenuCompetencyListStart").nextAll("[data-id]").remove();
			$("#appMenuCompetencyListStart").addClass("hide");
		}
	}
	
	/**
	 * Function to build a list item for a recently viewed framework 
	 * 
	 * @memberOf AppMenu
	 * @method buildFrameworkItem
	 * @private
	 * @param {String} compId
	 * 			ID of a competency to build an item for
	 */
	function buildFrameworkItem(frameworkId){
		frameworkId = EcRemoteLinkedData.trimVersionFromUrl(frameworkId);
		if($("#appMenuRecentList li[data-id='"+frameworkId+"']").length == 0){
			EcFramework.get(frameworkId, function(framework){
				var recentListItem = $("<li data-recent='framework'><a></a></li>")
				recentListItem.attr("data-id", frameworkId);
				recentListItem.find("a").text(framework.getName());
				recentListItem.find("a").attr("title", frameworkId);
				recentListItem.find("a").attr("href", "#"+FrameworkViewScreen.prototype.getDisplayName()+"?id="+frameworkId)
				recentListItem.find("a").click(function(ev){
					ev.preventDefault();
					ScreenManager.changeScreen(new FrameworkViewScreen(framework));
					return false;
				})
				$("#appMenuFrameworkListStart").after(recentListItem);
				$("#appMenuFrameworkListStart").removeClass("hide");
			}, function(){
				AppController.storageController.removeRecent(EcFramework.myType, frameworkId);
			});
		}
	}
	
	/**
	 * Function to build the list of recently viewed framework
	 * 
	 * @memberOf AppMenu
	 * @method buildFrameworkList
	 * @private
	 */
	function buildFrameworkList(frameworkList){
		if(frameworkList != null && frameworkList.length > 0){
			$("#appMenuNoRecent").addClass("hide");
			var inList = $("#appMenuFrameworkListStart").nextAll("[data-recent='framework']");
			inList.each(function(idx, el){
				if(frameworkList.indexOf($(el).attr("data-id")) == -1){
					$(el).remove();
				}
			})
			for(var idx in frameworkList){
				buildFrameworkItem(frameworkList[idx]);
			}
		}else{
			$("#appMenuFrameworkListStart").nextAll("[data-id]").remove();
			$("#appMenuFrameworkListStart").addClass("hide");
		}
	}

    function buildServerList() {
	    var serverList = AppController.serverController.getServerList();

	    var select = $("#sessionServerSelect");
	    var loginSelect = $("#sessionLoginSelect");
	    select.find("option[value]").remove();
	    loginSelect.find("option[value]").not("[value='google']").remove();
        if(serverList != null && Object.keys(serverList).length > 0){
            select.removeClass("noServers");
            select.find("#noServers").addClass("hide");
            select.find("#noServers").removeAttr("selected");
            select.removeAttr("disabled");

            var i = 0;
            for(var name in serverList){
                if (i < 2 && !AppController.loginController.getLoggedIn()){
                    loginSelect.append($("<option value='"+serverList[name]+"'>to "+name+"</option>"))

                }else if(i == 2){
                    loginSelect.append($("<option value='new'>to Other...</option>"));
                }
                i++;
                if(name === AppController.serverController.selectedServerName)
                    select.append($("<option selected='selected' value='"+serverList[name]+"'>"+name+"</option>"))
                else
                    select.append($("<option value='"+serverList[name]+"'>"+name+"</option>"))
            }

            if(!AppController.loginController.getLoggedIn()){
                loginSelect.append($("<option value='create'>Create Account</option>"));
            }
        }else{
            select.addClass("noServers");
            select.find("#noServers").removeClass("hide");
            select.find("#noServers").attr("selected", "selected");
            select.attr("disabled", true);
        }

    }

    function attemptLogin(event){
    	event.preventDefault();
        var userId = $("#appMenuLoginUser").val();
        var password = $("#appMenuLoginPass").val();
        var server = $("#sessionLoginSelect").val();


        if((userId == undefined || userId == "" ) && (password == undefined || password == "")){
            $("#appMenuLoginUser").addClass("error");
            $("#appMenuLoginPass").addClass("error");
            return;
        }else if(userId == undefined || userId == ""){
            $("#appMenuLoginUser").addClass("error");
            $("#appMenuLoginPass").removeClass("error");
            return;
        }else if(password == undefined || password == ""){
            $("#appMenuLoginPass").addClass("error");
            $("#appMenuLoginUser").removeClass("error");
            return;
        }
        $("#appMenuLoginUser").removeClass("error");
        $("#appMenuLoginPass").removeClass("error");

        $("#appMenuLoginSpinner").next().addClass("hide");
        $("#appMenuLoginSpinner").removeClass("hide");
        $("#appMenuLoginUser").prop("disabled", true);
        $("#appMenuLoginPass").prop("disabled", true);
        AppController.loginController.login(userId, password, server, afterLogin, errorLogin);

    }

    function afterLogin(){
		AppController.serverController.checkForAdmin(function() {
			ViewManager.getView("#menuContainer").setLoggedIn();
			$("#appMenuLoginPanel").animate({right:"-100%"}, 800);
			$("#appMenuLoginSpinner").next().removeClass("hide");
			$("#appMenuLoginSpinner").addClass("hide");
			$("#appMenuLoginUser").removeAttr("disabled").val("");
			$("#appMenuLoginPass").removeAttr("disabled").val("");
			$("#sessionLoginSelect").find("option").not("[value]").prop("selected", "true");

			ScreenManager.reloadCurrentScreen();
			});
    }

    function errorLogin(err){
		$("#appMenuLoginUser").addClass("error");
		$("#appMenuLoginPass").addClass("error");
		$("#appMenuLoginSpinner").next().removeClass("hide");
		$("#appMenuLoginSpinner").addClass("hide");
		$("#appMenuLoginUser").removeAttr("disabled");
		$("#appMenuLoginPass").removeAttr("disabled");

		ScreenManager.reloadCurrentScreen();
    }

    function setupMenuButtons(){
        $("#appMenuHeader").attr("href", "#" + WelcomeScreen.prototype.getDisplayName())
        $("#appMenuHeader").click(function (ev) {
            ev.preventDefault();
            ScreenManager.changeScreen(new WelcomeScreen());
            return false;
        });



        $("#appMenuRepoSearch").attr("href", "#" + RepoSearchScreen.prototype.getDisplayName());
        $("#appMenuRepoSearch").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new RepoSearchScreen());
        });
        $("#appMenuRepository").attr("href", "#" + RepoSearchScreen.prototype.getDisplayName());
        $("#appMenuRepository").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new RepoSearchScreen());
        })


        $("#appMenuRepoCreate").attr("href", "#" + RepoCreateScreen.prototype.getDisplayName());
        $("#appMenuRepoCreate").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new RepoCreateScreen());
        });

        $("#appMenuGeneralImport").click(function(event){
            event.preventDefault();
            ModalManager.showModal(new RepoImportModal());
        });

        $("#appMenuFileManager").attr("href", "#" + FileManagerScreen.prototype.getDisplayName());
        $("#appMenuFileManager").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new FileManagerScreen());
        });

        $("#appMenuFrameworks").attr("href", "#" + FrameworkSearchScreen.prototype.getDisplayName());
        $("#appMenuFrameworks").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new FrameworkSearchScreen());
        });

        $("#appMenuFrameworkSearch").attr("href", "#" + CompetencySearchScreen.prototype.getDisplayName());
        $("#appMenuFrameworkSearch").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new FrameworkSearchScreen());
        });

        $("#appMenuFrameworkCreate").attr("href", "#" + CompetencyEditScreen.prototype.getDisplayName());
        $("#appMenuFrameworkCreate").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new FrameworkEditScreen());
        });

        $("#appMenuCompetencies").attr("href", "#" + CompetencySearchScreen.prototype.getDisplayName());
        $("#appMenuCompetencies").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new CompetencySearchScreen());
        });

        $("#appMenuCompetencySearch").attr("href", "#" + CompetencySearchScreen.prototype.getDisplayName());
        $("#appMenuCompetencySearch").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new CompetencySearchScreen());
        });

        $("#appMenuCompetencyCreate").attr("href", "#" + CompetencyEditScreen.prototype.getDisplayName());
        $("#appMenuCompetencyCreate").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new CompetencyEditScreen());
        });

        $("#appMenuCompetencyImport").click(function (event) {
            event.preventDefault();
            ModalManager.showModal(new ImportCompetenciesModal());
        })


        $("#appMenuRelationships").attr("href", "#" + RelationshipSearchScreen.prototype.getDisplayName());
        $("#appMenuRelationships").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new RelationshipSearchScreen());
        });

        $("#appMenuRelationshipSearch").attr("href", "#" + RelationshipSearchScreen.prototype.getDisplayName());
        $("#appMenuRelationshipSearch").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new RelationshipSearchScreen());
        });

        $("#appMenuRelationshipCreate").attr("href", "#" + RelationshipEditScreen.prototype.getDisplayName());
        $("#appMenuRelationshipCreate").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new RelationshipEditScreen());
        });

        $("#appMenuLevels").attr("href", "#" + RelationshipSearchScreen.prototype.getDisplayName());
        $("#appMenuLevels").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new LevelSearchScreen());
        });

        $("#appMenuLevelSearch").attr("href", "#" + RelationshipSearchScreen.prototype.getDisplayName());
        $("#appMenuLevelSearch").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new LevelSearchScreen());
        });

        $("#appMenuRollupRules").attr("href", "#" + RelationshipSearchScreen.prototype.getDisplayName());
        $("#appMenuRollupRules").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new RollupRuleSearchScreen());
        });

        $("#appMenuRollupRulesSearch").attr("href", "#" + RelationshipSearchScreen.prototype.getDisplayName());
        $("#appMenuRollupRulesSearch").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new RollupRuleSearchScreen());
        });

        $("#appMenuProfile").click(function (event) {
            event.preventDefault();
            ModalManager.showModal(new MessageModal("Not Implemented Yet!", "This feature has not been implemented yet!", "tiny"));
        });

        $("#appMenuAssertions").attr("href", "#" + AssertionSearchScreen.prototype.getDisplayName());
        $("#appMenuAssertions").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new AssertionSearchScreen());
        });


        $("#appMenuAssertionSearch").attr("href", "#" + AssertionSearchScreen.prototype.getDisplayName());
        $("#appMenuAssertionSearch").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new AssertionSearchScreen());
        });

        $("#appMenuAssertionCreate").attr("href", "#" + AssertionEditScreen.prototype.getDisplayName());
        $("#appMenuAssertionCreate").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new AssertionEditScreen());
        });

        $("#appMenuAlignmentEditor").attr("href", "#" + AlignmentEditorScreen.prototype.getDisplayName());
        $("#appMenuAlignmentEditor").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new AlignmentEditorScreen());
        });

        $("#appMenuAlignmentExplorer").attr("href", "#" + AlignmentExplorerScreen.prototype.getDisplayName());
        $("#appMenuAlignmentExplorer").click(function (event) {
            event.preventDefault();
            ScreenManager.changeScreen(new AlignmentExplorerScreen());
        });


        $("#appMenuViewPublic").click(function (event) {
            event.preventDefault();
            if(ScreenManager.getCurrentScreen().filterPublic != undefined){
                ScreenManager.getCurrentScreen().filterPublic();
            }
        });

        $("#appMenuViewAll").click(function (event) {
            event.preventDefault();
            if(ScreenManager.getCurrentScreen().filterAll != undefined){
                ScreenManager.getCurrentScreen().filterAll();
            }
        });

        $("#appMenuViewAdvanced").click(function (event) {
            event.preventDefault();
            ModalManager.showModal(new MessageModal("Advanced View Options Incomplete"));
        });

        $("#appMenuSortByTime").click(function (event) {
            event.preventDefault();
            if(ScreenManager.getCurrentScreen().sortByTimestamp != undefined){
                ScreenManager.getCurrentScreen().sortByTimestamp();
            }
        });

        $("#appMenuSortByOwner").click(function (event) {
            event.preventDefault();
            if(ScreenManager.getCurrentScreen().sortByOwner != undefined){
                ScreenManager.getCurrentScreen().sortByOwner();
            }
        });

        $("#appMenuSortBySource").click(function (event) {
            event.preventDefault();
            if(ScreenManager.getCurrentScreen().sortBySource != undefined){
                ScreenManager.getCurrentScreen().sortBySource();
            }
        });

        $("#appMenuSortByTarget").click(function (event) {
            event.preventDefault();
            if(ScreenManager.getCurrentScreen().sortByTarget != undefined){
                ScreenManager.getCurrentScreen().sortByTarget();
            }
        });

        $("#appMenuSortByCompetency").click(function (event) {
            event.preventDefault();
            if(ScreenManager.getCurrentScreen().sortByCompetency != undefined){
                ScreenManager.getCurrentScreen().sortByCompetency();
            }
        });

        $("#appMenuHowTo").click(function (event) {
            event.preventDefault();
            ModalManager.showModal(new MessageModal("How To Incomplete"));
        });

        $("#appMenuApi").click(function (event) {
            event.preventDefault();
            window.open("http://docs.cassproject.org", "_blank")
        });

        $("#appMenuReportIssue").click(function (event) {
            event.preventDefault();
            ModalManager.showModal(new MessageModal("Report Issue Incomplete"));
        });

        $("#appMenuGetInvolved").click(function (event) {
            event.preventDefault();
            window.open("http://www.cassproject.org", "_blank")
        });
    }

    /**
     * Overridden display function, called once html partial is loaded into DOM
     *
     * @memberOf AppMenu
     * @method display
     * @param {String} containerId
     * 			DOM ID for the element containing this menu
     */
    AppMenu.prototype.display = function (containerId) {
        var view = this;

        $("#appMenuToggle").click(function (ev) {
            ev.preventDefault();
            return false;
        });

        AppMenu.prototype.setCurrentServer();

        setupMenuButtons();

        var compList = AppController.storageController.getRecent(EcCompetency.myType);
        buildCompetencyList(compList);

        var frameworkList = AppController.storageController.getRecent(EcFramework.myType);
        buildFrameworkList(frameworkList)

        buildServerList();

        $("#appMenuAddServerBtn").click(function(){
        	var m = new AddServerModal();
        	m.closeEvent = function(){
                ScreenManager.reloadCurrentScreen();
            }
            ModalManager.showModal(m);
        });

        $("#sessionServerSelect").change(function(){
            var select = $("#sessionServerSelect");
            var server = select.val();

            AppController.serverController.selectServer(server, function(){
                var options = select.find("option");

                options.removeAttr("selected");
                var selected = options.filter("[value='"+server+"']");

                selected.prop("selected", "true");

                ScreenManager.reloadCurrentScreen();
            }, function(){

            });
        });

        AppController.serverController.onServerChange.push(function(){
        	buildServerList();
        });

        $("#sessionLoginSelect").change(function(){
            var loginSelect = $("#sessionLoginSelect");

            var loginServer = loginSelect.val();

            if(loginServer === "create") {
                ModalManager.showModal(new CreateUserModal());
                loginSelect.find("option").not("[value]").prop("selected", "true");
            }else if(loginServer === "google"){
                AppController.loginController.hello(loginServer, function(){
                    AppController.serverController.checkForAdmin(function() {
                        ViewManager.getView("#menuContainer").setLoggedIn();
                        loginSelect.find("option").not("[value]").prop("selected", "true");
                    });
                }, function(){
                    loginSelect.find("option").not("[value]").prop("selected", "true");
                });
            }else{
                $("#appMenuLoginPanel").animate({right:"0px"}, 800);
            }
        });

        $("#appMenuLoginPanel").submit(attemptLogin);

        $("#sessionIdentitySelect").change(function(){
            var val = $("#sessionIdentitySelect").val();

            if(val == "new"){
                ModalManager.showModal(new CreateIdentityModal(function(){
                    buildIdentityList();
                }));
            }else if(val == "signout"){
                AppController.loginController.logout();
                ViewManager.getView("#menuContainer").setLoggedOut();
                if(ScreenManager.getCurrentScreen().getDisplayName() == "Identity"){
                    ScreenManager.changeScreen(new WelcomeScreen());
                }else{
                    ScreenManager.reloadCurrentScreen();
                }

            }else{
                selectKey(val);
            }
        })

        $("#appMenuIdentityOptionsBtn").click(function(){
            ScreenManager.changeScreen(new UserIdentityScreen());
        })

        $("#closeLoginPanel").click(function(){
            $("#appMenuLoginPanel").animate({right:"-100%"}, 800);
            $("#sessionLoginSelect").find("option").not("[value]").prop("selected", "true");
        });

        if (Foundation.MediaQuery.atLeast("medium")) {
            $("#appMenuMain").removeClass("vertical");
            $("#appMenuPublic").removeClass("vertical");
            $("#appMenuUserInfo").removeClass("vertical");
            $("#appMenuUserInfo").addClass("align-right");
            $("#appMenuUserIdentitySubMenu").removeClass("hide");
            buildIdentityList();
        }


        $(window).on('changed.zf.mediaquery', function (event, name) {
            if (name == "small") {
                $("#appMenuMain").addClass("vertical");
                $("#appMenuPublic").addClass("vertical");
                $("#appMenuUserInfo").addClass("vertical");
                $("#appMenuUserInfo").removeClass("align-right");
                $("#appMenuUserIdentitySubMenu").addClass("hide");

            } else {
                $("#appMenuMain").removeClass("vertical");
                $("#appMenuPublic").removeClass("vertical");
                $("#appMenuUserInfo").removeClass("vertical");
                $("#appMenuUserInfo").addClass("align-right");
                $("#appMenuUserIdentitySubMenu").removeClass("hide");
                buildIdentityList();
            }
        });

        if (AppController.loginController.getLoggedIn())
        {
        	afterLogin();
        }
    }


    /**
	 * Public method to rebuild the list of user identities, this is useful if
	 * an identity has been added or renamed so the proper identity
	 * names will be displayed.
	 * 
	 * @memberOf AppMenu
	 * @method rebuildIdentityList
	 */
	AppMenu.prototype.rebuildIdentityList = function(){
		buildIdentityList();
	}
	
	/**
	 * Rebuilds the current server display based on the server controllers values
	 * 
	 * @memberOf AppMenu
	 * @method setCurrentServer
	 */
	AppMenu.prototype.setCurrentServer = function(){

	    if(AppController.loginController.loginServer != undefined && AppController.loginController.loginServer.server != undefined &&
            AppController.loginController.loginServer.server != ""){
            for(var name in AppController.serverController.getServerList())
            {
            	if (AppController.serverController.getServerList()[name] == AppController.loginController.loginServer.server)
            		$("#appMenuSessionLogout").text("Sign out of "+name);
            }
        }else{
            $("#appMenuSessionLogout").text("Sign out");
        }

        buildIdentityList();
        buildServerList();
	}

	/**
	 * Sets the menu to the logged in state, showing the identities of the user and the
	 * identity screen link
	 * 
	 * @memberOf AppMenu
	 * @method setLoggedIn
	 */
	AppMenu.prototype.setLoggedIn = function(){

	    $("#appMenuIdentityOptionsBtn").removeClass("invisible");
        $("#sessionIdentitySelect").removeClass("hide");
        $("#sessionLoginSelect").addClass("hide");

		this.setCurrentServer();
		buildIdentityList();
	}
	
	/**
	 * Sets the menu to the logged out state, shows that the user is public and can
	 * login or create an account
	 * 
	 * @memberOf AppMenu
	 * @method setLoggedOut
	 */
	AppMenu.prototype.setLoggedOut = function(){
        $("#appMenuIdentityOptionsBtn").addClass("invisible");
        $("#sessionIdentitySelect").addClass("hide");
        $("#sessionLoginSelect").removeClass("hide");
        buildServerList();
	}
	
	/**
	 * Checks the login controller to see if the user is admin, and if so sets the
	 * admin menu visible
	 * 
	 * @memberOf AppMenu
	 * @method checkAdmin
	 */
	AppMenu.prototype.checkAdmin = function(){
		if( AppController.serverController.getAdmin() )
		{
			$("#appMenuAdmin").removeClass("hide");
		}else{
			$("#appMenuAdmin").addClass("hide");
		}
	}
	
	AppMenu.prototype.showSortBasic = function(){
		$("#appMenuSortBar").removeClass("hide");
		$("#appMenuSortByTime").removeClass("hide");
		$("#appMenuSortByOwner").removeClass("hide");
	}
	
	AppMenu.prototype.showSortRelations = function(){
		$("#appMenuSortBar").removeClass("hide");
		$("#appMenuSortBySource").removeClass("hide");
		$("#appMenuSortByTarget").removeClass("hide");
	}
	
	AppMenu.prototype.showSortByCompetency = function(){
		$("#appMenuSortBar").removeClass("hide");
		$("#appMenuSortByCompetency").removeClass("hide");
	}
	
	AppMenu.prototype.hideSort = function(){
		$("#appMenuSortBar").addClass("hide");
		$("#appMenuSortByTime").addClass("hide");
		$("#appMenuSortByOwner").addClass("hide");
		$("#appMenuSortBySource").addClass("hide");
		$("#appMenuSortByTarget").addClass("hide");
		$("#appMenuSortByCompetency").addClass("hide");
		
	}
	
	AppMenu.prototype.showRepoMenu = function(show){
		if(show){
			$("#appMenuRepo").removeClass("hide");
		}else{
			$("#appMenuRepo").addClass("hide");
		}
	}
	
	AppMenu.prototype.showExamplesMenu = function(show){
		if(show){
			$("#appMenuExamples").removeClass("hide");
		}else{
			$("#appMenuExamples").addClass("hide");
		}
	}
	
	AppMenu.prototype.buildRecentCompetencyList = function(list){
		buildCompetencyList(list);
	}
	
	AppMenu.prototype.buildRecentFrameworkList = function(list){
		buildFrameworkList(list);
	}

    return AppMenu;
})(AppMenu);

