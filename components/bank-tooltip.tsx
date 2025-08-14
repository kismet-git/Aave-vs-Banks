"use client"

import { Card, CardContent } from "@/components/ui/card"

interface BankTooltipProps {
  bank: {
    rank: number
    name: string
    deposits: number
    type: "bank" | "defi"
  }
  isVisible: boolean
  position: { x: number; y: number }
}

export function BankTooltip({ bank, isVisible, position }: BankTooltipProps) {
  if (!isVisible) return null

  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: position.x + 10,
        top: position.y - 10,
        transform: "translateY(-100%)",
      }}
    >
      <Card className="bg-black/90 border-white/20 backdrop-blur-sm">
        <CardContent className="p-3">
          <div className="text-white text-sm space-y-1">
            <div className="font-semibold">{bank.name}</div>
            <div className="text-purple-200">Rank #{bank.rank}</div>
            <div className="text-green-300">${bank.deposits.toFixed(3)}B deposits</div>
            <div className="text-gray-300">{bank.type === "defi" ? "DeFi Protocol" : "Traditional Bank"}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
