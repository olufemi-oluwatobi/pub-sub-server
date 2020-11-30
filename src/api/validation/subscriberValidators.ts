import { checkSchema } from "express-validator/check";

class SubscriberRequestValidator {
  static validateTopic(): any {
    return {
      topic: {
        in: ["params"],
        errorMessage: "topic attribute is missing",
        exists: {
          errorMessage: "topic attribute is missing",
        },
        isLength: {
          errorMessage: "topic cannot be empty",
          options: {
            min: 1,
          },
        },
      },
    };
  }

  static validateUrl(): any {
    return {
      url: {
        in: ["body"],
        errorMessage: "url attribute is missing",
        exists: {
          errorMessage: "url attribute is missing",
        },
        isLength: {
          errorMessage: "url cannot be empty",
          options: {
            min: 1,
          },
        },
      },
    };
  }

  static subscribe() {
    return checkSchema(
      Object.assign(
        {},
        SubscriberRequestValidator.validateUrl(),
        SubscriberRequestValidator.validateTopic()
      )
    );
  }
}

export default {
  subscriberValidator: SubscriberRequestValidator.subscribe(),
};
