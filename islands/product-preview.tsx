import { useSignal } from "@preact/signals";
import { invoke } from "../runtime.ts";
import { Product } from "apps/commerce/types.ts";
import { useRef } from "preact/hooks";

const styles = {
  container: {
    margin: "10px 0",
    width: "220px",
    position: "relative",
    display: "inline-block",
  },
  input: {
    position: "relative",
    display: "inline-block",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    color: "black",
  },
  dropdown: {
    position: "absolute",
    top: "40px",
    left: "0",
    right: "0",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    zIndex: 1000,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  item: {
    padding: "10px",
    cursor: "pointer",
    color: "black",
  },
  itemHover: {
    backgroundColor: "#f1f1f1",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#342e3b",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },
};

const ProductPreview = () => {
  const products = useSignal<Product[]>([]);
  const dropdownVisible = useSignal<boolean>(false);
  const query = useSignal("");
  const ref = useRef<HTMLInputElement>(null);
  const iconsVisible = useSignal<boolean>(false);
  const responseStatus = useSignal<boolean>(false);

  const getProducts = async (query: string) => {
    const has = await invoke["vtex"].loaders.intelligentSearch.productList({
      props: {
        query: query,
        count: 10,
      },
    });
    // console.log(has);
    products.value = has || [];
  };

  const handleInputChange = (e: Event) => {
    const value = e!.currentTarget!.value;
    query.value = value;
    dropdownVisible.value = true;
    getProducts(value);
  };

  const handleItemClick = (name: string) => {
    query.value = name;
    dropdownVisible.value = false;
  };

  const sendFileToGateway = () => {
    const formData = new FormData();
    formData.append("file", ref.current!.files[0]);
    formData.append("field", query.value);

    invoke["site"].loaders["productModels"]({
      form: formData,
    })
      .then((_) => {
        iconsVisible.value = true;
        responseStatus.value = true;
        query.value = "";
        ref.current.value = "";
      })
      .catch(() => {
        responseStatus.value = false;
      });
  };

  return (
    <form>
      <label>
        <b>Procurar:</b>
      </label>
      <input type="file" style={{ width: "80%", ...styles.input }} ref={ref} />
      <br></br>
      <label>
        <b>
          Busque o <i>produto</i>:{" "}
        </b>
      </label>
      <div style={styles.container}>
        <input
          type="text"
          style={{ width: "100%", ...styles.input }}
          value={query.value}
          onInput={handleInputChange}
          onBlur={() => setTimeout(() => (dropdownVisible.value = false), 100)}
        />
        {dropdownVisible.value && (
          <div style={styles.dropdown}>
            {products.value.length > 0
              ? (
                products.value.map((product, index) => (
                  <div
                    key={index}
                    style={styles.item}
                    onMouseDown={() => handleItemClick(product.gtin)}
                    onMouseOver={(
                      e,
                    ) => (e.currentTarget.style.backgroundColor = "#f1f1f1")}
                    onMouseOut={(
                      e,
                    ) => (e.currentTarget.style.backgroundColor = "white")}
                  >
                    {product.name}
                  </div>
                ))
              )
              : <div style={styles.item}>Sem produtos</div>}
          </div>
        )}
      </div>
      <br></br>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <input
          type="click"
          value="Salvar"
          style={{ width: "100%", ...styles.button }}
          onClick={sendFileToGateway}
        />
        {iconsVisible.value != true
          ? (
            null
          )
          : responseStatus.value == true
          ? (
            <img
              src="./check-icon.png"
              style={{ margin: "0 10px", width: "10%" }}
              alt="Sucess"
            >
            </img>
          )
          : (
            <img
              src="./problem-icon.png"
              style={{ margin: "0 10px", width: "10%" }}
              alt="Failure"
            >
            </img>
          )}
      </div>
    </form>
  );
};

export default ProductPreview;
