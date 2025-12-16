import { render, screen } from "@testing-library/react";
import { HeartScore } from "@/components/HeartScore";

describe("HeartScore Component", () => {
  it("renders without crashing", () => {
    const { container } = render(<HeartScore score={55} />);
    // Component renders a div with heart visualization
    expect(container.firstChild).toBeInTheDocument();
    expect(container.querySelector(".relative")).toBeInTheDocument();
  });

  it("renders heart visual element", () => {
    const { container } = render(<HeartScore score={75} />);
    // Should have the heart container with relative positioning
    const heartContainer = container.querySelector(".relative.w-12.h-12");
    expect(heartContainer).toBeInTheDocument();
  });

  it("applies correct clip-path for score percentage", () => {
    const { container } = render(<HeartScore score={75} />);
    // The fill is controlled via clip-path: inset(25% 0 0 0) for 75% fill
    const fillElement = container.querySelector('[style*="clip-path"]');
    expect(fillElement).toBeInTheDocument();
    expect(fillElement).toHaveStyle({ clipPath: "inset(25% 0 0 0)" });
  });

  it("shows 100% fill for max score", () => {
    const { container } = render(<HeartScore score={100} />);
    const fillElement = container.querySelector('[style*="clip-path"]');
    expect(fillElement).toHaveStyle({ clipPath: "inset(0% 0 0 0)" });
  });

  it("shows 0% fill for zero score", () => {
    const { container } = render(<HeartScore score={0} />);
    const fillElement = container.querySelector('[style*="clip-path"]');
    expect(fillElement).toHaveStyle({ clipPath: "inset(100% 0 0 0)" });
  });

  it("applies custom className when provided", () => {
    const { container } = render(<HeartScore score={55} className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("applies animation class when isAnimating is true", () => {
    const { container } = render(<HeartScore score={55} isAnimating={true} />);
    const heartContainer = container.querySelector(".animate-heart-pulse");
    expect(heartContainer).toBeInTheDocument();
  });

  it("does not apply animation class when isAnimating is false", () => {
    const { container } = render(<HeartScore score={55} isAnimating={false} />);
    const heartContainer = container.querySelector(".animate-heart-pulse");
    expect(heartContainer).not.toBeInTheDocument();
  });

  it("shows message when showMessage is true", () => {
    render(<HeartScore score={55} showMessage={true} />);
    // Should show some health message
    const message = screen.getByText(/Keep it up|Great|progress/i);
    expect(message).toBeInTheDocument();
  });

  it("shows Perfect message at 100% score with showMessage", () => {
    render(<HeartScore score={100} showMessage={true} />);
    expect(screen.getByText(/Perfect/i)).toBeInTheDocument();
  });

  it("does not show message when showMessage is false (default)", () => {
    const { container } = render(<HeartScore score={55} />);
    // No span with message text should be rendered
    const spans = container.querySelectorAll("span");
    expect(spans.length).toBe(0);
  });

  it("clamps scores above 100 to 100", () => {
    const { container } = render(<HeartScore score={150} />);
    const fillElement = container.querySelector('[style*="clip-path"]');
    // Should be clamped to 100%, which means inset(0% 0 0 0)
    expect(fillElement).toHaveStyle({ clipPath: "inset(0% 0 0 0)" });
  });

  it("clamps negative scores to 0", () => {
    const { container } = render(<HeartScore score={-10} />);
    const fillElement = container.querySelector('[style*="clip-path"]');
    // Should be clamped to 0%, which means inset(100% 0 0 0)
    expect(fillElement).toHaveStyle({ clipPath: "inset(100% 0 0 0)" });
  });

  it("applies glow effect at 100% score", () => {
    const { container } = render(<HeartScore score={100} />);
    const heartContainer = container.querySelector(".heart-glow-100");
    expect(heartContainer).toBeInTheDocument();
  });

  it("uses 1A brand gradient class", () => {
    const { container } = render(<HeartScore score={55} />);
    const gradientElement = container.querySelector(".heart-gradient-1a");
    expect(gradientElement).toBeInTheDocument();
  });
});
