import axios from "axios";

function App() {

  const checkBackend = async () => {
    try {
      const res = await axios.get("http://localhost:5000/");
      alert(res.data);
    } catch (error) {
      console.log(error);
      alert("Backend not connected");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Cab Booking App</h1>
      <button onClick={checkBackend}>
        Check Backend Connection
      </button>
    </div>
  );
}

export default App;