// app/layout.js

import 'bootstrap/dist/css/bootstrap.min.css';
import '../app/styles/main.scss';

export const metadata = {
  title: 'SmartClass',
  description: 'Classroom Management Tool',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Add the Google Font link here */}
        <link href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Vesper+Libre:wght@400;500;700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,600;1,700&display=swap" rel="stylesheet"></link>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
