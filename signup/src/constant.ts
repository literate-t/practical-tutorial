import { ValidateRule } from "./types";

export const IsRequired: ValidateRule = {
  rule: /.+/,
  match: false,
  message: "필수 입력 항목입니다.",
};

export const DoesContainWhiteSpace: ValidateRule = {
  rule: /\s/,
  match: true,
  message: "공백을 포함할 수 없습니다.",
};

export const DoesStartWithNumber: ValidateRule = {
  rule: /^\d/,
  match: true,
  message: "숫자로 시작하는 아이디는 사용할 수 없습니다.",
};

export const MinimumLengthLimit = (limit: number): ValidateRule => ({
  rule: new RegExp(`(.){${limit}}`),
  match: false,
  message: `최소한 ${limit}글자 이상 이어야 합니다.`,
});
