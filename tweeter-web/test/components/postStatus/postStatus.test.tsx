import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library, text } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks";
import { AuthToken, User } from "tweeter-shared";
import { PostStatusPresenter } from "../../../src/presenter/PostStatusPresenter";
import PostStatus from "../../../src/components/postStatus/PostStatus";

library.add(fab);

jest.mock("../../..//src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("PostStatus Component", () => {
    let mockUserInstance: User;
    let mockAuthTokenInstance: AuthToken;
  beforeAll(() => {
    const mockUser = mock<User>();
    mockUserInstance = instance(mockUser);
    const mockAuthToken = mock<AuthToken>();
    mockAuthTokenInstance = instance(mockAuthToken);

    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: mockUserInstance,
      authToken: mockAuthTokenInstance,
    });
  });
  it("starts with the Post Status and Clear buttons both disabled", () => {
    const { postStatusButton, clearButton } = renderPostStatusAndGetElement();
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });
  it("enables the Post Status and Clear buttons when the text field has text", async () => {
    const { user, postStatusButton, clearButton, textField } =
      renderPostStatusAndGetElement();
    await user.type(textField, "hi");
    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();
  });
  it("disables both buttons when the text field is cleared", async () => {
    const { user, postStatusButton, clearButton, textField } =
      renderPostStatusAndGetElement();
    await user.type(textField, "hi");
    expect(postStatusButton).toBeEnabled();
    expect(clearButton).toBeEnabled();

    await user.clear(textField);
    expect(postStatusButton).toBeDisabled();
    expect(clearButton).toBeDisabled();
  });
  it("calls the presenter's postStatus method with correct parameters when the Post Status button is pressed", async () => {
    const mockPresenter = mock<PostStatusPresenter>();
    const mockPresenterInstance = instance(mockPresenter);

    const { user, postStatusButton, textField } =
      renderPostStatusAndGetElement(mockPresenterInstance);

    await user.type(textField, "hi");
    await user.click(postStatusButton);

    verify(mockPresenter.submitPost("hi", mockUserInstance, mockAuthTokenInstance)).once();
  });
});

function renderPostStatus(presenter?: PostStatusPresenter) {
  return render(
    <MemoryRouter>
      {!!presenter ? <PostStatus presenter={presenter} /> : <PostStatus />}
    </MemoryRouter>,
  );
}

function renderPostStatusAndGetElement(presenter?: PostStatusPresenter) {
  const user = userEvent.setup();

  renderPostStatus(presenter);

  const postStatusButton = screen.getByRole("button", { name: /post status/i });
  const clearButton = screen.getByRole("button", { name: /clear post/i });
  const textField = screen.getByLabelText("post status text area");

  return { user, postStatusButton, clearButton, textField };
}
