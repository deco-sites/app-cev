import ProductPreview from "../../islands/product-preview.tsx";

const sectionStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const divStyles = {
  margin: "0 auto",
};

const titleStyles = {
  fontSize: "60px",
  fontWeight: "bold",
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Section />
      </header>
    </div>
  );
}

function Section() {
  return (
    <section style={sectionStyles} className="Section">
      <div style={{ textAlign: "center", ...divStyles }}>
        <p style={titleStyles}>MODELO 3D</p>
        <ProductPreview />
      </div>
    </section>
  );
}

export default App;
