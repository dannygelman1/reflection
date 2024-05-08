import "./App.css";
import MirrorDemo from "./MirrorDemo";

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
        Press and on the points on the parallel mirrors and try to get the light
        ray to hit their field of view. Can you see the relationship between the
        light ray and the position of the triangle in the reflection or between
        your position and your field of view?
      </span>
      <MirrorDemo />
    </div>
  );
}

export default App;
