package competencies.us.controller;

import com.eduworks.ec.array.EcAsyncHelper;
import com.eduworks.ec.array.EcObject;
import org.cassproject.ebac.identity.EcIdentityManager;
import org.cassproject.ebac.repository.EcRepository;
import org.stjs.javascript.*;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;

/**
 * Manages the server that the search controller (through EcRepository) and
 * the identity controller (through EcIdentityManager) communicate with.
 * Allows the user to change the server that the UI is talking with via the change server modal.
 *
 * @author devlin.junker@eduworks.com
 * @module cass.manager
 * @class ServerController
 * @constructor
 */
public class ServerController {

	public Map<String, String> serverList;

	StorageController storageSystem;

	/*
	 * Variables to store where the components are currently pointing (used when creating new 
	 * objects to generate the ID for where they will be saved)
	 */
	public String selectedServerUrl;
	public String selectedServerName;

	EcRepository repoInterface;

	public Array<Callback0> onServerChange;
	public Array<Callback0> onLoad;

	/**
	 * On Startup:
	 * 1) See if repo on this server, if so add the server given and the found server to the list
	 * 2) Determine storage system to load/save list of other servers
	 * 3) Switch to a previously selected server if the UI has been used before on this browser
	 * 4) Set interfaces to point at endpoint
	 *
	 * @param {String} defaultServer
	 *                 Base URL of the service end points on the server
	 * @param {String} defaultServerName
	 *                 Name of the Default Server (displayed to the user when selecting servers)
	 * @constructor
	 */
	public ServerController(final StorageController storageSystem, final String defaultServer, final String defaultServerName) {
		this.onServerChange = new Array<>();
		this.onLoad = new Array<>();
		this.storageSystem = storageSystem;
		if (storageSystem == null)
			this.storageSystem = new StorageController();

		serverList = JSCollections.$map();
		repoInterface = new EcRepository();

		final ServerController me = this;

		if (Global.window.location.protocol == "http") {
			final EcRepository r = new EcRepository();

			r.autoDetectRepositoryAsync(new Callback0() {
				@Override
				public void $invoke() {
					me.addServer("This Server (" + r.selectedServer + ")", r.selectedServer, null, null);
				}
			}, new Callback1() {
				@Override
				public void $invoke(Object o) {
				}
			});
		}

		Object cachedList = storageSystem.getStoredValue("cass.server.list");
		if (cachedList != null)
			cachedList = Global.JSON.parse((String) cachedList);
		if (cachedList == null)
			cachedList = new Object();

		final Map<String, EcRepository> repos = JSCollections.$map();
		final Object finalCachedList = cachedList;
		EcAsyncHelper<String> eah = new EcAsyncHelper<>();
		eah.each(EcObject.keys(cachedList), new Callback2<String, Callback0>() {
			@Override
			public void $invoke(String serverName, Callback0 callback0) {
				me.testAddEndpoint(serverName, (String) JSObjectAdapter.$properties(finalCachedList).$get(serverName), callback0);
			}
		}, new Callback1<Array<String>>() {
			@Override
			public void $invoke(Array<String> strings) {
				me.serversLoaded(defaultServer, defaultServerName);
			}
		});
	}

	public void serversLoaded(String defaultServer, String defaultServerName) {
		addServer(defaultServerName, defaultServer, null, null);

		String cachedSelected = (String) storageSystem.getStoredValue("cass.server.selected");
		if (cachedSelected != null && serverList.$get(cachedSelected) != null) {
			selectedServerName = cachedSelected;
			selectedServerUrl = serverList.$get(selectedServerName);
		} else if (defaultServer != null) {
			selectedServerUrl = defaultServer;
			if (defaultServerName != null) {
				selectedServerName = defaultServerName;
			} else {
				selectedServerName = "Default";
			}
		} else {
			selectedServerUrl = "http://localhost:8080/api/custom/";
			selectedServerName = "Default (Localhost)";

			Global.console.warn("Default Server Not Given, Set to LocalHost");
		}

		storageSystem.setStoredValue("cass.server.selected", selectedServerName);

		if (serverList.$get(selectedServerName) == null)
			addServer(selectedServerName, selectedServerUrl, null, null);

		EcRepository.caching = true;

		repoInterface.selectedServer = selectedServerUrl;
		for (int i = 0;i < onServerChange.$length();i++)
			onServerChange.$get(i).$invoke();
		for (int i = 0;i < onLoad.$length();i++)
			onLoad.$get(i).$invoke();
	}

	public void testAddEndpoint(final String serverName, final String serverUrl, final Callback0 after) {
		final ServerController that = this;
		EcRepository repo = new EcRepository();
		repo.selectedServer = serverUrl;

		repo.autoDetectRepositoryAsync(new Callback0() {
			@Override
			public void $invoke() {
				that.addServer(serverName, serverUrl, null, null);
				after.$invoke();
			}
		}, new Callback1<String>() {
			@Override
			public void $invoke(String error) {
				after.$invoke();
			}
		});
	}

	public Map<String, String> getServerList() {
		return serverList;
	}

	/**
	 * Adds a server to this list of servers that can be selected from the change server modal
	 *
	 * @param {String}            name
	 *                            Name of the server to be displayed in the list
	 * @param {String}            url
	 *                            URL of the server that corresponds to the name
	 * @param {Callback0}         success
	 *                            Callback when the server is successfully added to the list
	 * @param {Callback1<String>} failure
	 *                            Callback for any errors during adding to the list
	 * @method addServer
	 */
	public void addServer(String name, String url, Callback0 success, Callback1<String> failure) {
		if (name == null) {
			if (failure != null)
				failure.$invoke("Cannot Add Server without a name");
			return;
		}

		if (url == null) {
			if (failure != null)
				failure.$invoke("Cannot Add Server with blank url");
			return;
		}

		serverList.$put(name, url);

		storageSystem.setStoredValue("cass.server.list", Global.JSON.stringify(serverList));

		for (int i = 0;i < onServerChange.$length();i++)
			onServerChange.$get(i).$invoke();
		if (success != null)
			success.$invoke();
	}

	/**
	 * Sets the server that the UI will communicate with, changes where the EcRepository and
	 * EcRemoteIdentity Manager are pointing to and communicating with
	 *
	 * @param {String}            identifier
	 *                            Name of the server that was selected from the list, used to find URL to point at
	 * @param {Callback0}         success
	 *                            Callback when successfully change where the components are pointing and set the
	 *                            selected server values
	 * @param {Callback1<String>} failure
	 *                            Callback if any errors occur during changing where the components are pointing
	 * @method selectServer
	 */
	public void selectServer(String identifier, final Callback0 success, final Callback1<String> failure) {
		final ServerController that = this;

		final String oldServer = selectedServerUrl;
		final String oldServerName = selectedServerName;
		for (String serverName : serverList) {
			if (identifier.equals(serverName) || identifier.equals(serverList.$get(serverName))) {
				selectedServerName = serverName;
				selectedServerUrl = serverList.$get(serverName);

				if (repoInterface != null)
					repoInterface.selectedServer = selectedServerUrl;
				repoInterface.autoDetectRepositoryAsync(new Callback0() {
					@Override
					public void $invoke() {
						that.storageSystem.setStoredValue("cass.server.selected", that.selectedServerName);

						that.checkForAdmin(success);
					}
				}, new Callback1<String>() {
					@Override
					public void $invoke(String error) {
						if (that.repoInterface != null)
							that.repoInterface.selectedServer = oldServer;

						that.selectedServerUrl = oldServer;
						that.selectedServerName = oldServerName;

						if (failure != null)
							failure.$invoke(error);
					}
				});
			}
		}
	}

	public boolean admin = false;

	/**
	 * Setter for boolean flag of whether or not the current user is admin
	 *
	 * @param val true = admin, false = not admin
	 * @method setAdmin
	 */
	public void setAdmin(boolean val) {
		admin = val;
	}

	/**
	 * Getter for boolean flag of whether or not current user is admin
	 *
	 * @return {boolean}
	 * true = admin, false = not admin
	 * @method getAdmin
	 */
	public boolean getAdmin() {
		return admin;
	}

	public void checkForAdmin(final Callback0 success) {

		final ServerController me = this;
		me.repoInterface.fetchServerAdminKeys(new Callback1<Array<String>>() {
			@Override
			public void $invoke(Array<String> keys) {
				me.setAdmin(false);
				for (int i = 0; i < EcIdentityManager.ids.$length(); i++) {
					if (keys.indexOf(EcIdentityManager.ids.$get(i).ppk.toPk().toPem()) != -1) {
						me.setAdmin(true);
						break;
					}
				}
				if (success != null)
					success.$invoke();
			}
		}, new Callback1<String>() {
			@Override
			public void $invoke(String p1) {
				me.setAdmin(false);
				if (success != null)
					success.$invoke();
			}
		});
	}


	/**
	 * Used to retrieve the interface to the repository we are currently pointed at
	 *
	 * @return {EcRepository}
	 * Repository Interface to call search/get/delete methods on
	 * @method getRepoInterface
	 */
	public EcRepository getRepoInterface() {
		return repoInterface;
	}

	/**
	 * Used during setup to set which EcRepository the server controller manages
	 *
	 * @param {EcRepository} repoInterface
	 *                       The interface to the repository to be used by the search controller
	 * @method setRepoInterface
	 */
	public void setRepoInterface(EcRepository repoInterface) {
		this.repoInterface = repoInterface;

		repoInterface.selectedServer = selectedServerUrl;
	}

}
