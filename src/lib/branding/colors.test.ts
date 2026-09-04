import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  DEFAULT_BRAND_COLOR,
  getHostThemeStyle,
  isValidBrandColor,
  mixHex,
  normalizeBrandColor,
} from "./colors";

describe("branding colors", () => {
  it("validates hex colors", () => {
    assert.equal(isValidBrandColor("#12385F"), true);
    assert.equal(isValidBrandColor("12385F"), false);
    assert.equal(isValidBrandColor("#GGGGGG"), false);
  });

  it("normalizes invalid colors to default", () => {
    assert.equal(normalizeBrandColor(undefined), DEFAULT_BRAND_COLOR);
    assert.equal(normalizeBrandColor("#abc123"), "#ABC123");
  });

  it("builds host theme CSS variables", () => {
    const style = getHostThemeStyle("#12385F");
    assert.equal(style["--host-brand"], "#12385F");
    assert.match(style["--host-brand-light"] as string, /^#/);
  });

  it("mixes hex colors", () => {
    assert.equal(mixHex("#000000", "#FFFFFF", 0.5), "#808080");
  });
});
