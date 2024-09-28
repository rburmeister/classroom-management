'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Make sure to import useRouter from 'next/navigation' in the App Router

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const router = useRouter(); // Use useRouter from 'next/navigation'

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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Redirect to login or another page after successful registration
        router.push('/login');
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Error creating account.');
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="container-fluid form-container py-5">
    <div className="container">
    <div className="row justify-content-center align-items-center h-100 d-flex">
      <div className="col-12 col-sm-10 col-md-6 col-lg-5 p-4">
          <div className="shadow-lg bg-body rounded p-5">
      <h1 className="mb-4">Create an Account</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100 py-2">Register</button>
      </form>
    </div>
    </div>
    </div>
    </div>
    </div>
  );
}
