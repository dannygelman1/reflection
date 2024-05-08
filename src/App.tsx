import "./App.css";
import ReflectionInteractive from "./ReflectionInteractive";

function App() {
  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span style={{ maxWidth: "800px", paddingBottom: "10px" }}>
        Move the person up/down and see how their view in the mirror changes.
        Press on the points on the parallel mirrors to reflect the light ray
        into their field of view. Can you see the relationship between the light
        ray and the position of the triangle in the reflection, or between their
        position and what they see in the reflection?
      </span>
      <ReflectionInteractive />
    </div>
  );
}

export default App;
