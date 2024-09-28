// app/layout.js
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app/styles/main.scss';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
