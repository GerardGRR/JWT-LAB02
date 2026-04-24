import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
    const res = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    console.log("STATUS", res.status);
    const text = await res.text();
    console.log("Respuesta RAW", text);

    if(!res.ok) {
      throw new Error("Error de login: ");
    }

    const data = JSON.parse(text);
    console.log("DATA", data);
    
    localStorage.setItem("token", data.token);
    //redireccion
    navigate("/dashboard");

  }catch (error) {
    console.error("error:", error);
  }
  };

  return (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f7f6',
    fontFamily: 'sans-serif'
  }}>
    <div style={{
      backgroundColor: 'white',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      width: '320px',
      textAlign: 'center'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Bienvenido</h2>
      
      <input 
        type="text"
        placeholder="Usuario" 
        onChange={e => setUsername(e.target.value)} 
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '15px',
          border: '1px solid #ddd',
          borderRadius: '6px',
          boxSizing: 'border-box'
        }}
      />
      
      <input 
        type="password" 
        placeholder="Contraseña" 
        onChange={e => setPassword(e.target.value)} 
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '20px',
          border: '1px solid #ddd',
          borderRadius: '6px',
          boxSizing: 'border-box'
        }}
      />
      
      <button 
        onClick={handleLogin}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600'
        }}
      >
        Entrar
      </button>
      
      <p style={{ marginTop: '20px', fontSize: '13px', color: '#888', cursor: 'pointer' }}>
        ¿Olvidaste tu contraseña?
      </p>
    </div>
  </div>
);
}

export default Login;