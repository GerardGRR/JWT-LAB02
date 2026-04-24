import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [message, setMessage] = useState("");
    const [comment, setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [tokenStolen, setTokenStolen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        
        const checkDashboard = () => {
            fetch("http://localhost:4000/dashboard", {
                headers: { Authorization: "Bearer " + token }
            })
            .then(res => res.json())
            .then(data => {
                if (data.tokenCompromised) {
                    setTokenStolen(true);
                } else {
                    setMessage(data.message);
                }
            });
        };
        
        checkDashboard();
        const interval = setInterval(checkDashboard, 2000);
        
        return () => clearInterval(interval);
    }, [navigate]);

const addComment = () => {
    //  VULNERABLE A XSS
    setComments([...comments, comment]);
};

return (
  <div style={{ maxWidth: '400px', margin: '2rem auto', fontFamily: 'sans-serif', color: '#333' }}>
    {tokenStolen && (
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        left: '50%', 
        transform: 'translateX(-50%)', 
        background: '#ff4444', 
        color: 'white', 
        padding: '20px 30px', 
        borderRadius: '8px', 
        fontSize: '1.1rem',
        fontWeight: 'bold',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        zIndex: 9999
      }}>
         TU TOKEN FUE ROBADO
      </div>
    )}
    <h2 style={{ fontSize: '1.2rem', borderBottom: '2px solid #eee', pb: '10px' }}>{message}</h2>

    <div style={{ display: 'flex', gap: '8px', margin: '1rem 0' }}>
      <input
        placeholder="Escribe un comentario..."
        onChange={e => setComment(e.target.value)}
        style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      />
      <button onClick={addComment} style={{ cursor: 'pointer', padding: '8px 15px', borderRadius: '4px', border: 'none', background: '#000', color: '#fff' }}>
        Postear
      </button>
    </div>

    <div style={{ display: 'grid', gap: '10px' }}>
      {comments.map((c, i) => (
        <div key={i} style={{ padding: '10px', background: '#f9f9f9', borderRadius: '6px', fontSize: '0.9rem' }}>
          <span dangerouslySetInnerHTML={{ __html: c }} />
        </div>
      ))}
    </div>
  </div>
);
}

export default Dashboard;