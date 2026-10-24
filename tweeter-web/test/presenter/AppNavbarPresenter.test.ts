import {
  anything,
  instance,
  mock,
  spy,
  verify,
  when,
} from "@typestrong/ts-mockito";
import {
  AppNavbarPresenter,
  AppNavbarView,
} from "../../src/presenter/AppNavbarPresenter";
import { AuthToken } from "tweeter-shared";
import { UserService } from "../../src/model.service/UserService";
import { AuthService } from "../../src/model.service/AuthService";

describe("AppNavbarPresenter", () => {
  let mockAppNavbarPresenterView: AppNavbarView;
  let appNavbarPresenter: AppNavbarPresenter;
  let mockService: AuthService;

  const authToken = new AuthToken("test", Date.now());
  beforeEach(() => {
    mockAppNavbarPresenterView = mock<AppNavbarView>();
    const mockAppNavbarPresenterViewInstance = instance(
      mockAppNavbarPresenterView,
    );
    when(mockAppNavbarPresenterView.displayInfoMessage(anything(), 0)).thenReturn("message123");

    const appNavbarPresenterSpy = spy(
      new AppNavbarPresenter(mockAppNavbarPresenterViewInstance),
    );
    appNavbarPresenter = instance(appNavbarPresenterSpy);

    mockService = mock<AuthService>();

    when(appNavbarPresenterSpy.service).thenReturn(instance(mockService));
  });

  it("tells the view to display a logging out message", async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockAppNavbarPresenterView.displayInfoMessage(anything(), 0)).once();
  });

  it("calls logout on the user service with the correct auth token", async () => {
    await appNavbarPresenter.logOut(authToken);
    verify(mockService.logout(authToken)).once();
  });

  it("tells the view to clear the info message that was displayed previously, clears the user info, and navigates to the login page when successful", async () => {
    await appNavbarPresenter.logOut(authToken);

    verify(mockAppNavbarPresenterView.deleteMessage("message123")).once();
    verify(mockAppNavbarPresenterView.clearUserInfo()).once();
    verify(mockAppNavbarPresenterView.navigate("/login")).once();

    verify(mockAppNavbarPresenterView.displayErrorMessage(anything())).never()
  });

  it("tells the view to display an error message and does not tell it to clear the info message, clear the user info, or navigate to the login page when unsuccessful", async () => {
    let error = new Error("An error occurred");
    when(mockService.logout(anything())).thenThrow(error);
    await appNavbarPresenter.logOut(authToken);
    verify(mockAppNavbarPresenterView.displayErrorMessage("Failed to log user out because of exception: Error: An error occurred")).once();
    verify(mockAppNavbarPresenterView.deleteMessage(anything())).never();
    verify(mockAppNavbarPresenterView.clearUserInfo()).never();
    verify(mockAppNavbarPresenterView.navigate("/login")).never();
  })
});
