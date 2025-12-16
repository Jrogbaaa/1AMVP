import { cn } from "@/lib/utils";

describe("cn utility function", () => {
  it("should merge class names", () => {
    const result = cn("class1", "class2");
    expect(result).toContain("class1");
    expect(result).toContain("class2");
  });

  it("should handle conditional classes", () => {
    const isActive = true;
    const result = cn("base", isActive && "active");
    expect(result).toContain("base");
    expect(result).toContain("active");
  });

  it("should filter out falsy values", () => {
    const result = cn("base", false && "inactive", undefined, null, "end");
    expect(result).toContain("base");
    expect(result).toContain("end");
    expect(result).not.toContain("inactive");
    expect(result).not.toContain("undefined");
    expect(result).not.toContain("null");
  });

  it("should handle Tailwind conflicts correctly", () => {
    // tailwind-merge should resolve conflicts
    const result = cn("px-2", "px-4");
    // Later class should win
    expect(result).toContain("px-4");
    // Earlier class should be removed
    expect(result).not.toContain("px-2");
  });

  it("should handle empty input", () => {
    const result = cn();
    expect(result).toBe("");
  });

  it("should handle array of classes", () => {
    const result = cn(["class1", "class2"]);
    expect(result).toContain("class1");
    expect(result).toContain("class2");
  });

  it("should handle object syntax", () => {
    const result = cn({
      base: true,
      active: true,
      disabled: false,
    });
    expect(result).toContain("base");
    expect(result).toContain("active");
    expect(result).not.toContain("disabled");
  });

  it("should handle complex Tailwind classes", () => {
    const result = cn(
      "bg-white",
      "hover:bg-gray-100",
      "text-gray-900",
      "rounded-lg"
    );
    expect(result).toContain("bg-white");
    expect(result).toContain("hover:bg-gray-100");
    expect(result).toContain("text-gray-900");
    expect(result).toContain("rounded-lg");
  });

  it("should handle responsive classes", () => {
    const result = cn("text-sm", "md:text-base", "lg:text-lg");
    expect(result).toContain("text-sm");
    expect(result).toContain("md:text-base");
    expect(result).toContain("lg:text-lg");
  });
});

