import { anything, capture, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";
import { StatusService } from "../../src/model.service/StatusService";
import { PostStatusPresenter, PostStatusView } from "../../src/presenter/PostStatusPresenter";
import { AuthToken, Status, User } from "tweeter-shared";

describe("PostStatusPresenter", () => {
    let mockPostStatusView: PostStatusView;
    let postStatusPresenter: PostStatusPresenter;
    let mockService: StatusService;
    
    const message = "Hello, world";
    const user = new User("Jane", "Doe", "janedoe", "prettycoolimage");
    const authToken = new AuthToken("testToken", Date.now());
    beforeEach(() => {
        mockPostStatusView = mock<PostStatusView>();
        const mockPostStatusViewInstance = instance(mockPostStatusView);
        when(mockPostStatusView.displayInfoMessage(anything(), 0)).thenReturn("message123");

        const postStatusPresenterSpy = spy(new PostStatusPresenter(mockPostStatusViewInstance));
        postStatusPresenter = instance(postStatusPresenterSpy);

        mockService = mock<StatusService>();

        when(postStatusPresenterSpy.service).thenReturn(instance(mockService));

        
    })
    it("tells the view to display a posting status message", async () => {
        await postStatusPresenter.submitPost(message, user, authToken);
        verify(mockPostStatusView.displayInfoMessage(anything(), 0)).once()
    });
    it("calls postStatus on the post status service with the correct status string and auth token", async () => {
        await postStatusPresenter.submitPost(message, user, authToken);

        const [capturedToken, capturedStatus] = capture(mockService.postStatus).last();
        expect(capturedToken).toEqual(authToken);
        expect(capturedStatus.post).toEqual(message);
        expect(capturedStatus.user).toEqual(user);
    });
    it("tells the view to clear the info message that was displayed previously, clear the post, and display a status posted message", async () => {
        await postStatusPresenter.submitPost(message, user, authToken);

        verify(mockPostStatusView.deleteMessage("message123")).once();
        verify(mockPostStatusView.setPost("")).once();
        verify(mockPostStatusView.displayInfoMessage("Status posted!", 2000));

        verify(mockPostStatusView.displayErrorMessage(anything())).never();
    });
    it("when not successful, tells the view to clear the info message and display an error message but does not tell it to clear the post or display a status posted message", async () => {
        let error = new Error("An error occurred");
        when(mockService.postStatus(anything(), anything())).thenThrow(error);
        
        await postStatusPresenter.submitPost(message, user, authToken);
        
        verify(mockPostStatusView.deleteMessage("message123")).once();
        verify(mockPostStatusView.displayErrorMessage("Failed to post the status because of exception: Error: An error occurred"));
        verify(mockPostStatusView.setPost(anything())).never();
        verify(mockPostStatusView.displayInfoMessage("Status Posted!", anything())).never();


    })

})