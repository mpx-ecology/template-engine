import * as prettier from "prettier";

export function format(code) {
  return prettier.format(code, {
    parser: "html",
    htmlWhitespaceSensitivity: "ignore"
  });
}
