"use client";

export {};

declare global {
  interface Array<T extends string> {
    joinWithLimit(): T;
  }
}

if (typeof Array.prototype.joinWithLimit === "undefined") {
  Array.prototype.joinWithLimit = function (
    limit = 3,
    joiner = ", ",
    trail = "and {{extra}} more"
  ) {
    if (this.length <= limit) {
      return this.join(joiner);
    }
    return `${this.slice(0, limit).join(joiner)} ${trail.replace(
      "{{extra}}",
      String(this.length - limit)
    )}`;
  };
}
