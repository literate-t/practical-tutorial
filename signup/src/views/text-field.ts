import { nextTick } from "../utils";
import { ValidateRule } from "../types";
import template from "./text-field.template";
import { IsRequired } from "../constant";

type Props = {
  id: string;
  label: string;
  type: "text" | "email" | "number";
  placeholder?: string;
  text?: string;
  require: boolean;
};

const DefaultProps: Props = {
  id: "",
  text: "",
  label: "label",
  type: "text",
  placeholder: "",
  require: false,
};

export default class TextField {
  //  <div id="field-{{id}}"></div>
  private template = template;
  private container: string;
  private data: Props;
  private updated: boolean = false;
  private validateRules: ValidateRule[] = [];

  constructor(container: string, data: Props) {
    // this.container -> #required-fields
    this.container = container;
    this.data = { ...DefaultProps, ...data };

    if (this.data.require) {
      this.addValidateRule(IsRequired);
    }

    nextTick(this.attachEventHandler);
  }

  private validate = (): ValidateRule | null => {
    const target = this.data.text ? this.data.text.trim() : "";

    const invalidateRules = this.validateRules.filter(
      (validateRule) => validateRule.rule.test(target) === validateRule.match
    );

    // 검증 정책 위반이 여러 개 걸렸다고 해도 하나만 보여주기
    return invalidateRules.length > 0 ? invalidateRules[0] : null;
  };

  private buildData = () => {
    const isInvalid: ValidateRule | null = this.validate();

    if (this.updated) {
      return {
        ...this.data,
        updated: this.updated,
        valid: !isInvalid, // 객체를 not 연산하면 false가 나오고, null은 true가 된다
        validateMessage: !!isInvalid ? isInvalid.message : "",
      };
    } else {
      return {
        ...this.data,
        updated: this.updated,
        valid: true,
        validateMessage: "",
      };
    }
  };

  private onChange = (e: Event) => {
    const { value, id } = e.target as HTMLInputElement;

    if (id === this.data.id) {
      this.updated = true;
      this.data.text = value;
      this.update();
    }
  };

  private attachEventHandler = () => {
    document
      .querySelector(this.container)
      ?.addEventListener("change", this.onChange);
  };

  private update = () => {
    const container = document.querySelector(
      `#field-${this.data.id}`
    ) as HTMLElement;
    const docFrag = document.createElement("div");
    docFrag.innerHTML = this.template(this.buildData());

    // attachEventHandler에서 추가한 핸들러를 안 날리기 위해서라고 하는데 잘 이해가 안 됨
    // 기존에 템플릿을 재활용하다 보니까 이렇게 안 하면 최상위 태그가 중복됨
    container.innerHTML = docFrag.children[0].innerHTML;
    //container.innerHTML = this.template(this.buildData());
  };

  public get name(): string {
    return this.data.id;
  }

  public get value(): string {
    return this.data.text || "";
  }

  public get isValid(): boolean {
    return !this.validate();
  }

  public addValidateRule = (rule: ValidateRule) => {
    this.validateRules.push(rule);
  };

  public render = (append: boolean = false) => {
    const container = document.querySelector(this.container) as HTMLElement;

    if (append) {
      const divFragment = document.createElement("div");
      divFragment.innerHTML = this.template(this.buildData());

      container.appendChild(divFragment.children[0]);
    } else {
      container.innerHTML = this.template(this.buildData());
    }
  };
}
