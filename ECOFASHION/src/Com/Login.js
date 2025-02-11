import React, { useState } from 'react';
import { auth } from './Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './login-registro.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.email === 'admin@gmail.com') {  
        navigate('/admin');  
      } else {
        navigate(from, { replace: true });  
      }
    } catch (error) {
      let errorMessage = 'Ocurrió un error al iniciar sesión';
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'El correo electrónico no es válido';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No existe una cuenta con este correo electrónico';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Contraseña incorrecta';
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-form-container">
        <div className="auth-form-wrapper">
        <h2 className="navbar-brand fs-3 fw-bold mb-0 text-BLACK">INICIO DE SESION</h2>
     
          <form className="auth-form" onSubmit={handleLogin}>
            <input
              type="email"
              className="auth-input"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <input
              type="password"
              className="auth-input"
              placeholder="Acceso"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <div className="auth-error">{error}</div>}

            <button
              type="submit"
              className="auth-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="auth-loading-spinner"></span>
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>

            <Link to="/register" className="auth-toggle-link">
              o regístrate
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
