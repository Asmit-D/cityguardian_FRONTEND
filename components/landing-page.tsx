"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, Zap, Users, Target, BarChart3, Shield, Activity, Award } from "lucide-react"

export default function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentMode, setCurrentMode] = useState<'CITIZEN' | 'EMPLOYEE' | 'MANAGER'>('CITIZEN')

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      color: string
      pulse: number
    }> = []

    // Create gaming-style particles (fewer for mobile)
    const isMobile = window.innerWidth < 768
    const particleCount = isMobile ? 30 : 80
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 3 + 1,
        color: Math.random() > 0.7 ? "rgba(0, 255, 153, 0.8)" : Math.random() > 0.3 ? "rgba(0, 184, 255, 0.6)" : "rgba(255, 69, 58, 0.7)",
        pulse: Math.random() * Math.PI * 2,
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Background grid effect (simpler for mobile)
      if (!isMobile) {
        ctx.strokeStyle = "rgba(0, 255, 153, 0.05)"
        ctx.lineWidth = 1
        for (let x = 0; x < canvas.width; x += 50) {
          ctx.beginPath()
          ctx.moveTo(x, 0)
          ctx.lineTo(x, canvas.height)
          ctx.stroke()
        }
        for (let y = 0; y < canvas.height; y += 50) {
          ctx.beginPath()
          ctx.moveTo(0, y)
          ctx.lineTo(canvas.width, y)
          ctx.stroke()
        }
      }

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.pulse += 0.05

        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        const pulseSize = p.radius * (1 + Math.sin(p.pulse) * 0.3)
        
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, pulseSize, 0, Math.PI * 2)
        ctx.fill()

        // Connection lines for nearby particles (disabled on mobile for performance)
        if (!isMobile) {
          particles.forEach((p2) => {
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y)
            if (dist < 120) {
              ctx.strokeStyle = `rgba(0, 255, 153, ${0.15 * (1 - dist / 120)})`
              ctx.beginPath()
              ctx.moveTo(p.x, p.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.stroke()
            }
          })
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const modes = [
    { id: 'CITIZEN' as const, label: 'CITIZEN_MODE', color: 'from-green-400 to-cyan-400' },
    { id: 'EMPLOYEE' as const, label: 'EMPLOYEE_MODE', color: 'from-blue-400 to-purple-400' },
    { id: 'MANAGER' as const, label: 'MANAGER_MODE', color: 'from-orange-400 to-red-400' }
  ]

  return (
    <div className="w-full min-h-screen bg-black overflow-hidden relative pb-8 md:pb-0">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" />
      
      {/* Gaming-style scanlines overlay (desktop only) */}
      <div className="fixed inset-0 pointer-events-none opacity-5 hidden md:block">
        <div className="w-full h-full" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,153,0.1) 2px, rgba(0,255,153,0.1) 4px)',
        }} />
      </div>

      {/* Header with Gaming Theme */}
      <header className="relative z-20 border-b border-green-500/30 bg-black/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative">
              <div className="w-8 h-8 md:w-12 md:h-12 rounded bg-gradient-to-br from-green-400 to-cyan-400 flex items-center justify-center font-black text-black text-sm md:text-lg">
                ⚡
              </div>
              <div className="absolute inset-0 bg-green-400 rounded animate-ping opacity-20"></div>
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-black text-green-400 tracking-wider">CITYGUARDIAN</h1>
              <p className="text-xs text-green-300/70 font-mono hidden md:block">OPERATIVE MODE</p>
            </div>
          </div>
          
          {/* Mode Selector */}
          <div className="hidden md:flex items-center gap-2 mr-4">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setCurrentMode(mode.id)}
                className={`px-3 py-1 text-xs font-mono border rounded transition-all ${
                  currentMode === mode.id 
                    ? 'border-green-400 bg-green-400/20 text-green-400' 
                    : 'border-gray-600 text-gray-400 hover:border-gray-500'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <Button
            onClick={onGetStarted}
            size="sm"
            className="bg-gradient-to-r from-green-400 to-cyan-400 text-black font-black hover:from-green-300 hover:to-cyan-300 border-0 shadow-lg shadow-green-400/25 md:size-default"
          >
            <Zap className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            <span className="hidden md:inline">INITIALIZE</span>
            <span className="md:hidden">START</span>
          </Button>
        </div>
      </header>

      {/* Hero Section - Gaming Style */}
      <section className="relative z-10 min-h-screen flex flex-col justify-center items-center px-3 md:px-4 text-center">
        <div className="max-w-6xl fade-in-scale">
          {/* Mission Status */}
          <div className="inline-flex items-center gap-1 md:gap-2 mb-6 md:mb-8 px-3 md:px-6 py-2 md:py-3 rounded-full border border-green-400/50 bg-green-400/10 text-green-400 font-mono">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs md:text-sm font-bold">
              <span className="hidden md:inline">ENVIRONMENTAL DEFENSE SYSTEM ONLINE</span>
              <span className="md:hidden">SYSTEM ONLINE</span>
            </span>
          </div>

          {/* Main Title */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black mb-6 md:mb-8 text-white leading-tight tracking-tight">
            <span className="text-green-400 neon-glow block mb-1 md:mb-2">ENVIRONMENTAL</span>
            <span className="text-cyan-400 block mb-1 md:mb-2">GUARDIANS</span>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-white/80 font-bold tracking-wider">
              MISSION CONTROL
            </div>
          </h2>

          {/* Subtitle */}
          <p className="text-sm md:text-xl lg:text-2xl text-gray-300 mb-8 md:mb-12 leading-relaxed font-mono max-w-4xl px-2">
            <span className="hidden md:block">Real-time environmental monitoring network status & data.<br/></span>
            <span className="text-green-400">Protect your city. Earn rewards. Level up.</span>
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-4 md:gap-6 justify-center mb-12 md:mb-16 px-4">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-gradient-to-r from-green-400 to-cyan-400 text-black font-black text-lg md:text-xl h-12 md:h-16 px-6 md:px-8 hover:from-green-300 hover:to-cyan-300 shadow-lg shadow-green-400/25 w-full md:w-auto"
            >
              <Shield className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
              ENTER MISSION
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => window.location.href = '/environmental'}
              className="border-green-400/50 text-green-400 hover:bg-green-400/10 font-black text-lg md:text-xl h-12 md:h-16 px-6 md:px-8 bg-transparent border-2 w-full md:w-auto"
            >
              <Activity className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3" />
              SENSOR NETWORK
            </Button>
          </div>

          {/* Live Stats Display */}
          <div className="grid grid-cols-3 gap-3 md:gap-6 max-w-2xl mx-auto mb-8 md:mb-12 px-2">
            {[
              { label: "ACTIVE SENSORS", shortLabel: "SENSORS", value: "247", color: "text-green-400" },
              { label: "ALERTS TODAY", shortLabel: "ALERTS", value: "12", color: "text-red-400" },
              { label: "OPERATIVES", shortLabel: "USERS", value: "1.2K", color: "text-cyan-400" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className={`text-2xl md:text-3xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-xs text-gray-400 font-mono">
                  <span className="md:hidden">{stat.shortLabel}</span>
                  <span className="hidden md:inline">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="animate-bounce hidden md:block">
            <ChevronDown className="w-8 h-8 mx-auto text-green-400" />
          </div>
        </div>
      </section>

      {/* Mission Briefing Section */}
      <section className="relative z-10 py-12 md:py-20 px-3 md:px-4 max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-16">
          <h3 className="text-3xl md:text-5xl font-black mb-2 md:mb-4 text-white">
            <span className="text-green-400">THREE</span> OPERATION MODES
          </h3>
          <p className="text-sm md:text-base text-gray-400 font-mono">Choose your role in the environmental defense network</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {[
            {
              icon: Users,
              title: "CITIZEN OPERATIVE",
              shortTitle: "CITIZEN",
              subtitle: "Report • Upload • Track",
              description: "Deploy field reports, capture evidence, monitor mission progress. Earn XP for every contribution to the network.",
              shortDescription: "Report problems and earn rewards for city contributions.",
              color: "from-green-400 to-cyan-400",
              stats: ["Field Reports: 15K+", "Evidence Uploaded: 8K+", "Rewards Earned: 12M XP"]
            },
            {
              icon: Target,
              title: "FIELD AGENT", 
              shortTitle: "EMPLOYEE",
              subtitle: "Execute • Compete • Achieve",
              description: "Complete assignments, climb leaderboards, unlock achievements. Real-time performance tracking and rewards.",
              shortDescription: "Complete tasks and compete on leaderboards.",
              color: "from-blue-400 to-purple-400",
              stats: ["Missions Complete: 3.2K", "Leaderboard Rank: Top 100", "Achievements: 45/60"]
            },
            {
              icon: BarChart3,
              title: "COMMAND CENTER",
              shortTitle: "MANAGER",
              subtitle: "Monitor • Coordinate • Lead",
              description: "Set environmental targets, track team performance, analyze sensor data. Command your operational zone.",
              shortDescription: "Monitor teams and analyze performance data.",
              color: "from-orange-400 to-red-400",
              stats: ["Zones Managed: 12", "Team Performance: 94%", "Targets Met: 89%"]
            },
          ].map((mission, i) => {
            const Icon = mission.icon
            return (
              <div
                key={i}
                className="group relative p-4 md:p-8 rounded-lg border border-gray-700 bg-gray-900/50 hover:border-green-400/60 transition-all duration-300 hover:shadow-lg hover:shadow-green-400/20 slide-in-bottom backdrop-blur-sm"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                {/* Animated border effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/0 via-green-400/5 to-green-400/0 opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300"></div>
                
                <div className={`inline-flex p-3 md:p-4 rounded-lg bg-gradient-to-br ${mission.color} mb-4 md:mb-6`}>
                  <Icon className="w-6 h-6 md:w-8 md:h-8 text-black" />
                </div>
                
                <h4 className="text-lg md:text-2xl font-black text-white mb-1 md:mb-2">
                  <span className="md:hidden">{mission.shortTitle}</span>
                  <span className="hidden md:inline">{mission.title}</span>
                </h4>
                <p className="text-green-400 font-mono text-xs md:text-sm mb-3 md:mb-4">{mission.subtitle}</p>
                <p className="text-gray-300 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                  <span className="md:hidden">{mission.shortDescription}</span>
                  <span className="hidden md:inline">{mission.description}</span>
                </p>
                
                <div className="space-y-1 md:space-y-2">
                  {mission.stats.slice(0, 2).map((stat, idx) => (
                    <div key={idx} className="text-xs font-mono text-gray-400 flex items-center">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 opacity-60"></div>
                      <span className="md:hidden">{stat.split(':')[0]}: {stat.split(':')[1]}</span>
                      <span className="hidden md:inline">{stat}</span>
                    </div>
                  ))}
                  <div className="hidden md:block text-xs font-mono text-gray-400 flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2 opacity-60"></div>
                    {mission.stats[2]}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Network Status */}
      <section className="relative z-10 py-12 md:py-20 px-3 md:px-4 max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h3 className="text-2xl md:text-4xl font-black text-white mb-2 md:mb-4">NETWORK STATUS</h3>
          <p className="text-sm md:text-base text-gray-400 font-mono">Real-time environmental defense metrics</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {[
            { label: "ACTIVE OPERATIVES", shortLabel: "OPERATIVES", value: "50K+", status: "ONLINE", color: "text-green-400" },
            { label: "MISSIONS COMPLETED", shortLabel: "MISSIONS", value: "15K+", status: "SUCCESS", color: "text-cyan-400" },
            { label: "CITIES PROTECTED", shortLabel: "CITIES", value: "25+", status: "SECURE", color: "text-blue-400" },
            { label: "AIR QUALITY IMPROVED", shortLabel: "AIR QUALITY", value: "+32%", status: "RISING", color: "text-purple-400" },
          ].map((metric, i) => (
            <div
              key={i}
              className="text-center p-3 md:p-6 rounded-lg border border-gray-700 bg-gray-900/30 hover:bg-gray-800/50 transition-colors backdrop-blur-sm group"
            >
              <div className={`text-2xl md:text-4xl font-black ${metric.color} mb-1 md:mb-2 group-hover:animate-pulse`}>{metric.value}</div>
              <div className="text-white font-bold mb-1 text-xs md:text-base">
                <span className="md:hidden">{metric.shortLabel}</span>
                <span className="hidden md:inline">{metric.label}</span>
              </div>
              <div className="text-xs font-mono text-gray-400 flex items-center justify-center gap-1 md:gap-2">
                <div className={`w-1.5 h-1.5 md:w-2 md:h-2 ${metric.color.replace('text-', 'bg-')} rounded-full animate-pulse`}></div>
                {metric.status}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
