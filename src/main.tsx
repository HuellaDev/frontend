import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Huella from './Huella.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Huella/>
  </StrictMode>,
)
