import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import Create from './pages/Create'
import Projects from './pages/Projects'
import Quote from './pages/Quote'
const Design = lazy(()=>import('./pages/Design'))
export default function App(){
  return <BrowserRouter>
    <Layout>
      <Suspense fallback={<div className="p-10 text-center">Đang tải 3D...</div>}>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/create" element={<Create/>}/>
          <Route path="/design" element={<Design/>}/>
          <Route path="/projects" element={<Projects/>}/>
          <Route path="/quote" element={<Quote/>}/>
        </Routes>
      </Suspense>
    </Layout>
  </BrowserRouter>
}
