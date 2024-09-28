'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Redirect to the admin dashboard or homepage after successful login
        router.push('/admin');
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Invalid credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="container-fluid form-container py-5">
    <div className="container h-100">
      <div className="row justify-content-center align-items-center h-100 d-flex">
        <div className="col-12 col-sm-10 col-md-6 col-lg-4 p-4">
            <div className="shadow-lg bg-body rounded p-5">
            <Image src="/images/pf.png" alt="Logo"      
          width={150}  
        height={156} 
        layout="responsive" className='w-auto mx-auto d-flex py-4' />
          {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="form-control"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className="form-control"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Sign In</button>
          </form>
            </div>
        </div>
      </div>
      </div>
    </div>
  );
}
