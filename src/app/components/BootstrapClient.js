"use client"

import { useEffect } from 'react';

function BootstrapClient() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
      .then(() => {
        console.log('Bootstrap JS loaded successfully');
      })
      .catch(err => console.error('Error loading Bootstrap JS:', err));
  }, []);

  return null;
}

export default BootstrapClient;
