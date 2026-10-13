import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="max-w-2xl mx-auto px-4 py-20 text-center">
    <p className="text-8xl font-bold text-primary mb-4">404</p>
    <h1 className="text-2xl font-bold mb-3">Page Not Found</h1>
    <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn-primary inline-block">Go Home</Link>
  </div>
);

export default NotFound;