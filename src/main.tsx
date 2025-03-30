
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add a class to the document body for the Ghibli theme
document.body.classList.add('ghibli-theme');

createRoot(document.getElementById("root")!).render(<App />);
