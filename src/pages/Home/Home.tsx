import Nav from '../../components/layout/Nav/Nav'
import Hero from '../../components/sections/Hero/Hero'
import About from '../../components/sections/About/About'
import Skills from '../../components/sections/Skills/Skills'
import Timeline from '../../components/sections/Timeline/Timeline'
import AILab from '../../components/sections/AILab/AILab'
import Contact from '../../components/sections/Contact/Contact'
import Footer from '../../components/layout/Footer/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Timeline />
        <AILab />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
