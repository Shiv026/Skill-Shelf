import { useState, useContext } from 'react'
import api from '../utils/api.js'
import SignInForm from '../components/SignInForm';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext.jsx';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const { login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const validate = () => {
    const newErrors = {};
    if (!formData.email.includes("@")) newErrors.email = "Valid Email is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be atleast 6 characters";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    try {
      const res = await api.post('/auth/sign-in', formData);
      console.log(res);
      login(res.data);
      navigate('/');
    } catch (error) {
      console.log(error);
      setErrors({ api: error.response?.data?.message || 'Sign In Failed. Please Try Again' })
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="pt-16 max-w-full">
      <SignInForm formData={formData}
        errors={errors}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        loading={isLoading} />
    </div>
  )
}

export default SignIn;