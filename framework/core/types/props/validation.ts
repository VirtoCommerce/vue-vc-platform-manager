import { IValidationRules } from "..";

export interface IHasValidationRules {
  rules?: IValidationRules;
}

export interface IHasErrors {
  errors?: string[];
  errorMessage?: string | undefined;
}
