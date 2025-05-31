import "./AuthButtons.css"

const AuthButtons = () => {
  return (
    <div className="auth-buttons">
      <a href="/login" className="auth-btn login-btn">
        Login
      </a>
      <a href="/register" className="auth-btn register-btn">
        Register
      </a>
    </div>
  )
}

export default AuthButtons
