import React from "react";
import ReactDOM from "react-dom";

export default function createProgressiveComponent(
  modFn,
  componentFn,
  moduleId
) {
  const queue = new Set();
  const mod = modFn();

  let InnerComponent = null;
  let modLoaded = false;

  if (typeof mod === "object" && typeof mod.then === "function") {
    InnerComponent = React.lazy(() => mod.then(x => {
      modLoaded = true;
      for (let cb of queue) {
        cb();
      }
      queue.clear();
      return ({ default: componentFn(x) });
    }));
  } else {
    InnerComponent = componentFn(mod);
    modLoaded = true;
  }

  let Component = React.forwardRef((props, ref) => (
    <React.Suspense fallback={null}>
      <InnerComponent ref={ref} {...props} />
    </React.Suspense>
  ));
  Component = React.memo(Component);
  Component.displayName = `Progressive(${moduleId})`;
  return Component;
}
