import { useState, useEffect, useRef } from 'react'
import { Camera, Play, Pause } from 'lucide-react'
import './App.css'

function App() {
  const [isScanning, setIsScanning] = useState(false)
  const [complexity, setComplexity] = useState<'simple' | 'wabisabi' | 'complex'>('simple')
  const [transcript, setTranscript] = useState<string>('')
  const [isPlaying, setIsPlaying] = useState(false)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '1') {
        if (!isScanning) {
          scanPage()
        }
      } else if (e.key === '2') {
        if (transcript && !isPlaying) {
          playTranscript()
        }
      } else if (e.key === '3') {
        if (isPlaying) {
          pauseTranscript()
        }
      } else if (e.key === '4') {
        setComplexity('simple')
      } else if (e.key === '5') {
        setComplexity('wabisabi')
      } else if (e.key === '6') {
        setComplexity('complex')
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isScanning, transcript, isPlaying])

  const scanPage = () => {
    setIsScanning(true)
    setTimeout(() => {
      setTranscript('Image 1: A sunset over mountains with orange and purple hues.\n\nImage 2: A person typing on a laptop at a wooden desk.\n\nImage 3: A cup of coffee with latte art on a white saucer.')
      setIsScanning(false)
    }, 2000)
  }

  const playTranscript = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(transcript)
      utterance.rate = 1.0
      utterance.pitch = 1.0
      utterance.volume = 1.0
      
      utterance.onstart = () => {
        setIsPlaying(true)
      }
      
      utterance.onend = () => {
        setIsPlaying(false)
        speechRef.current = null
      }
      
      utterance.onerror = () => {
        setIsPlaying(false)
        speechRef.current = null
      }
      
      speechRef.current = utterance
      window.speechSynthesis.speak(utterance)
    } else {
      alert('Text-to-speech not supported in your browser')
    }
  }

  const pauseTranscript = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      speechRef.current = null
    }
  }

  const togglePlay = () => {
    if (isPlaying) {
      pauseTranscript()
    } else {
      playTranscript()
    }
  }

  return (
    <div style={{ 
      width: '380px', 
      padding: '25px', 
      fontFamily: "'Segoe UI', Arial, sans-serif",
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      color: '#ffffff',
      minHeight: '500px'
    }}>
      <h2 style={{ 
        margin: '0 0 25px 0',
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '28px',
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: '3px'
      }}>
        FONK
      </h2>
      
      {/* Keyboard shortcuts hint */}
      <div style={{
        fontSize: '11px',
        color: '#888',
        textAlign: 'center',
        marginBottom: '25px',
        fontStyle: 'italic'
      }}>
        1: scan • 2: play • 3: pause • 4-6: complexity
      </div>
      
      {/* Complexity Selector */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{ 
          marginBottom: '10px', 
          fontWeight: 'bold',
          color: '#FFD700',
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Description Style
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setComplexity('simple')}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: complexity === 'simple' ? '#FFD700' : '#3a3a3a',
              color: complexity === 'simple' ? '#000' : '#aaa',
              border: complexity === 'simple' ? '2px solid #FFD700' : '2px solid #4a4a4a',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: complexity === 'simple' ? 'bold' : 'normal',
              transition: 'all 0.3s',
              position: 'relative'
            }}
          >
            Simple
            <div style={{ fontSize: '9px', color: complexity === 'simple' ? '#000' : '#666' }}>
              (4)
            </div>
          </button>
          <button
            onClick={() => setComplexity('wabisabi')}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: complexity === 'wabisabi' ? '#FFD700' : '#3a3a3a',
              color: complexity === 'wabisabi' ? '#000' : '#aaa',
              border: complexity === 'wabisabi' ? '2px solid #FFD700' : '2px solid #4a4a4a',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: complexity === 'wabisabi' ? 'bold' : 'normal',
              transition: 'all 0.3s'
            }}
          >
            Wabi-Sabi
            <div style={{ fontSize: '9px', color: complexity === 'wabisabi' ? '#000' : '#666' }}>
              (5)
            </div>
          </button>
          <button
            onClick={() => setComplexity('complex')}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: complexity === 'complex' ? '#FFD700' : '#3a3a3a',
              color: complexity === 'complex' ? '#000' : '#aaa',
              border: complexity === 'complex' ? '2px solid #FFD700' : '2px solid #4a4a4a',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: complexity === 'complex' ? 'bold' : 'normal',
              transition: 'all 0.3s'
            }}
          >
            Complex
            <div style={{ fontSize: '9px', color: complexity === 'complex' ? '#000' : '#666' }}>
              (6)
            </div>
          </button>
        </div>
      </div>
      
      {/* Big Circle Camera Button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <button 
          onClick={scanPage} 
          disabled={isScanning}
          style={{
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            background: isScanning 
              ? 'linear-gradient(135deg, #4a4a4a 0%, #3a3a3a 100%)' 
              : 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
            color: '#000',
            border: '3px solid #FFD700',
            cursor: isScanning ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s',
            boxShadow: isScanning 
              ? '0 4px 20px rgba(0,0,0,0.3)' 
              : '0 8px 25px rgba(255, 215, 0, 0.4)'
          }}
          onMouseEnter={(e) => {
            if (!isScanning) {
              e.currentTarget.style.transform = 'scale(1.08)'
              e.currentTarget.style.boxShadow = '0 12px 35px rgba(255, 215, 0, 0.6)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 215, 0, 0.4)'
          }}
        >
          <Camera size={52} strokeWidth={2.5} />
        </button>
      </div>
      
      <div style={{ 
        textAlign: 'center', 
        color: '#FFD700', 
        fontSize: '14px', 
        marginBottom: '25px',
        fontWeight: '500'
      }}>
        {isScanning ? '✨ Scanning page...' : '📸 Click to scan for images'}
      </div>

      {/* Transcript Section */}
      {transcript && (
        <div style={{ marginTop: '25px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '12px' 
          }}>
            <h3 style={{ 
              margin: 0,
              color: '#FFD700',
              fontSize: '18px',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}>
              Transcript
            </h3>
            <button
              onClick={togglePlay}
              style={{
                padding: '10px 18px',
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 'bold',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(255, 215, 0, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 215, 0, 0.5)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(255, 215, 0, 0.3)'
              }}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>
          
          <div style={{
            background: '#2a2a2a',
            border: '1px solid #FFD700',
            borderRadius: '12px',
            padding: '18px',
            maxHeight: '250px',
            overflowY: 'auto',
            fontSize: '14px',
            lineHeight: '1.8',
            whiteSpace: 'pre-wrap',
            color: '#e0e0e0',
            boxShadow: '0 4px 15px rgba(255, 215, 0, 0.1)'
          }}>
            {transcript}
          </div>
        </div>
      )}
    </div>
  )
}

export default App