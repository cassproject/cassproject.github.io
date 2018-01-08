package competencies.us.screen;

import com.eduworks.ec.framework.browser.url.URLParams;
import com.eduworks.ec.framework.view.manager.ScreenManager;
import competencies.us.AppController;
import competencies.us.other.MessageContainer;
import org.cass.competency.EcFramework;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;

import static org.stjs.javascript.jquery.GlobalJQuery.$;

/**
 * Created by fray on 1/8/18.
 */
public class CassEditorScreen extends CassManagerScreen {

	static String displayName = "cassEditor";
	private MessageContainer mc;

	static
	{
		ScreenManager.addStartupScreenCallback(new Callback0()
		{
			@Override
			public void $invoke()
			{
				if (Global.window.document.location.hash.startsWith("#" + displayName))
				{
					final Map<String, Object> urlParameters = JSObjectAdapter.$properties(URLParams.getParams());

					String id = (String) urlParameters.$get("id");
					if (id != null)
					{
						EcFramework.get(id, new Callback1<EcFramework>()
						{
							@Override
							public void $invoke(EcFramework data)
							{
								ScreenManager.replaceScreen(new FrameworkViewScreen(data), reloadShowLoginCallback, urlParameters);

								showLoginModalIfReload();
							}
						}, new Callback1<String>()
						{
							@Override
							public void $invoke(String p1)
							{
								ScreenManager.replaceScreen(new FrameworkSearchScreen(null, null, null), reloadShowLoginCallback, urlParameters);

								showLoginModalIfReload();
							}
						});

						ScreenManager.startupScreen = ScreenManager.LOADING_STARTUP_PAGE;
						return;
					}
					ScreenManager.startupScreen = new FrameworkSearchScreen(null, null, null);

					showLoginModalIfReload();
				}
			}
		});
	}

	public EcFramework getData()
	{
		return (EcFramework) data;
	}

	public CassEditorScreen(Object data)
	{
		this.data = data;
	}

	@Override
	public String getDisplayName()
	{
		return displayName;
	}

	@Override
	public String getHtmlLocation()
	{
		return "partial/screen/frameworkView.html";
	}

	@Override
	public void display(String containerId)
	{
		String server = "?server=AppController.serverController.selectedServerUrl";
		String origin = "&origin=https://competencies.us";
		String viewer = AppController.loginController.getLoggedIn() ? "" : "&view=true";
		$("cassEditor").attr("src","https://cassproject.github.us/cass-editor/index.html"+server+origin+viewer);
	}


}