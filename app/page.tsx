"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, ArrowUp, ArrowDown, RefreshCw, ExternalLink } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Mock data based on the provided information
const initialBankData = [
  { rank: 37, name: "UMB BK NA/UMB FC", deposits: 69.014, type: "bank" },
  { rank: 38, name: "Aave", deposits: 67.921, type: "defi" },
  { rank: 39, name: "SouthState BK NA/SouthState CORP", deposits: 65.109, type: "bank" },
  { rank: 40, name: "Valley NB/Valley NAT BC", deposits: 61.818, type: "bank" },
  { rank: 41, name: "CIBC BK USA/CIBC BC USA", deposits: 61.303, type: "bank" },
  { rank: 42, name: "Synovus BK/Synovus FC", deposits: 60.208, type: "bank" },
  { rank: 43, name: "Pinnacle BK/Pinnacle FNCL PTNR", deposits: 54.473, type: "bank" },
]

type SortField = "rank" | "deposits"
type SortDirection = "asc" | "desc"

export default function AaveBanksDashboard() {
  const [bankData, setBankData] = useState(initialBankData)
  const [sortField, setSortField] = useState<SortField>("rank")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [filterMode, setFilterMode] = useState<"all" | "near-aave">("all")
  const [newDeposits, setNewDeposits] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Sort and filter data
  const processedData = useMemo(() => {
    let filtered = bankData

    if (filterMode === "near-aave") {
      filtered = bankData.filter((bank) => bank.rank >= 35 && bank.rank <= 45)
    }

    return filtered.sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
  }, [bankData, sortField, sortDirection, filterMode])

  // Chart data for top 5 banks
  const chartData = useMemo(() => {
    return processedData.slice(0, 5).map((bank) => ({
      name: bank.name.length > 15 ? bank.name.substring(0, 15) + "..." : bank.name,
      deposits: bank.deposits,
      isAave: bank.type === "defi",
    }))
  }, [processedData])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const updateAaveDeposits = () => {
    const newValue = Number.parseFloat(newDeposits)
    if (!isNaN(newValue) && newValue > 0) {
      setBankData((prev) => prev.map((bank) => (bank.name === "Aave" ? { ...bank, deposits: newValue } : bank)))
      setNewDeposits("")
    }
  }

  const refreshData = async () => {
    setIsRefreshing(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />
    return sortDirection === "asc" ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent">
            Aave vs Banks
          </h1>
          <p className="text-xl text-purple-100 mb-6">Aave breaks into the top 40 U.S. banks by size</p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <a
              href="https://www.federalreserve.gov/releases/lbr/current/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-purple-200 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Source: Federal Reserve Data
            </a>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          <Select value={filterMode} onValueChange={(value: "all" | "near-aave") => setFilterMode(value)}>
            <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Show All Banks</SelectItem>
              <SelectItem value="near-aave">Near Aave (Ranks 35-45)</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Input
              placeholder="Update Aave deposits (B)"
              value={newDeposits}
              onChange={(e) => setNewDeposits(e.target.value)}
              className="w-48 bg-white/10 border-white/20 text-white placeholder:text-white/60"
            />
            <Button onClick={updateAaveDeposits} variant="secondary">
              Update
            </Button>
          </div>

          <Button
            onClick={refreshData}
            disabled={isRefreshing}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
          >
            {isRefreshing ? (
              <RefreshCw className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh Data
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Table */}
          <div className="lg:col-span-2">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Bank Rankings by Deposits</CardTitle>
                <CardDescription className="text-purple-100">
                  Showing {processedData.length} institutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="text-left py-3 px-2">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("rank")}
                            className="text-white hover:bg-white/10 p-1 h-auto font-semibold"
                          >
                            Rank {getSortIcon("rank")}
                          </Button>
                        </th>
                        <th className="text-left py-3 px-2">
                          <span className="text-white font-semibold">Name</span>
                        </th>
                        <th className="text-right py-3 px-2">
                          <Button
                            variant="ghost"
                            onClick={() => handleSort("deposits")}
                            className="text-white hover:bg-white/10 p-1 h-auto font-semibold"
                          >
                            Deposits {getSortIcon("deposits")}
                          </Button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {processedData.map((bank, index) => (
                        <tr
                          key={bank.rank}
                          className={`border-b border-white/10 hover:bg-white/5 transition-colors group ${
                            bank.type === "defi" ? "bg-purple-500/20" : ""
                          }`}
                          title={bank.type === "defi" ? "DeFi Protocol" : "Traditional Bank"}
                        >
                          <td className="py-4 px-2">
                            <span className="text-white font-mono text-lg">#{bank.rank}</span>
                          </td>
                          <td className="py-4 px-2">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{bank.name}</span>
                              {bank.type === "defi" && (
                                <Badge variant="secondary" className="bg-purple-500 text-white">
                                  DeFi
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-2 text-right">
                            <span className="text-white font-mono text-lg">${bank.deposits.toFixed(3)}B</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <div className="lg:col-span-1">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Top 5 Comparison</CardTitle>
                <CardDescription className="text-purple-100">Deposit amounts in billions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis
                        dataKey="name"
                        stroke="rgba(255,255,255,0.7)"
                        fontSize={12}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          border: "1px solid rgba(255,255,255,0.2)",
                          borderRadius: "8px",
                          color: "white",
                        }}
                        formatter={(value: number) => [`$${value.toFixed(3)}B`, "Deposits"]}
                      />
                      <Bar
                        dataKey="deposits"
                        fill={(entry) => (entry.isAave ? "#a855f7" : "#6366f1")}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-white mb-2">
                ${bankData.find((b) => b.name === "Aave")?.deposits.toFixed(3)}B
              </div>
              <div className="text-purple-200">Aave Total Deposits</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-white mb-2">#{bankData.find((b) => b.name === "Aave")?.rank}</div>
              <div className="text-purple-200">Current Rank</div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-white mb-2">
                {bankData.filter((b) => b.type === "bank").length}
              </div>
              <div className="text-purple-200">Traditional Banks</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
