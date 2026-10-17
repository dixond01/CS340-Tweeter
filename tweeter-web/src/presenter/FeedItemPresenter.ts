import { AuthToken, Status } from "tweeter-shared";
import { StatusItemPresenter } from "./StatusItemPresenter";
import { PAGE_SIZE, PagedItemView } from "./PagedItemPresenter";

export class FeedItemPresenter extends StatusItemPresenter {
  
  protected itemDescription(): string {
    return "load feed items";
  }
  protected async getMoreItems(
    authToken: AuthToken,
    userAlias: string,
  ): Promise<[Status[], boolean]> {
    return await this.service.loadMoreFeedItems(
      authToken,
      userAlias,
      PAGE_SIZE,
      this.lastItem,
    );
  }
}
