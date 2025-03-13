import { useEffect, useState, useMemo } from 'react'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

export default function ParticleBg () {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      setInit(true)
    })
  }, [])

  const particlesLoaded = () => {
  }

  const options = useMemo(
    () => ({
      fullscreen: { enable: false, zIndex: 0 },
      fpsLimit: 120,
      interactivity: {
        modes: {
          push: {
            quantity: 4
          },
          repulse: {
            distance: 200,
            duration: 0.4
          }
        }
      },
      particles: {
        color: {
          value: '#eef2ff'
        },
        links: {
          color: '#eef2ff',
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1
        },
        move: {
          direction: 'none',
          enable: true,
          outModes: {
            default: 'bounce'
          },
          random: false,
          speed: 0.5,
          straight: false
        },
        number: {
          density: {
            enable: true
          },
          value: 100
        },
        opacity: {
          value: 0.5
        },
        shape: {
          type: 'circle'
        },
        size: {
          value: { min: 1, max: 5 }
        }
      },
      detectRetina: true
    }),
    []
  )

  if (init) {
    return (
      <Particles
        id='tsparticles'
        particlesLoaded={particlesLoaded}
        options={options}
      />
    )
  }

  return <></>
};