import { Buffer } from "buffer";
import { AuthService } from "../model.service/AuthService";
import { User, AuthToken } from "tweeter-shared";
import { View, Presenter } from "./Presenter";
import {
  AuthenticationPresenter,
  AuthenticationView,
} from "./AuthenticationPresenter";

export interface RegisterView extends AuthenticationView {
  setImageUrl: (url: string) => void;
  setImageBytes: (bytes: Uint8Array) => void;
}

export class RegisterPresenter extends AuthenticationPresenter<RegisterView> {
  public constructor(view: RegisterView) {
    super(view);
  }

  private _imageFileExtension = "";

  public get imageFileExtension(): string {
    return this._imageFileExtension;
  }
  protected set imageFileExtension(value: string) {
    this._imageFileExtension = value;
  }

  handleImageFile = (file: File | undefined) => {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64",
        );

        this.view.setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.imageFileExtension = fileExtension;
      }
    } else {
      this.view.setImageUrl("");
      this.view.setImageBytes(new Uint8Array());
    }
  };

  private getFileExtension = (file: File): string | undefined => {
    return file.name.split(".").pop();
  };

  public checkSubmitButtonStatus(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageUrl: string,
  ): boolean {
    return (
      !firstName
      || !lastName
      || !alias
      || !password
      || !imageUrl
      || !this.imageFileExtension
    );
  }

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageBytes: Uint8Array,
    rememberMe: boolean,
  ) {
    const sendRegister = async (): Promise<[User, AuthToken]> => {
      return await this.service.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        this.imageFileExtension,
      );
    };

    await this.doAuthOperation(sendRegister, rememberMe, "registerUser");
  }
}
