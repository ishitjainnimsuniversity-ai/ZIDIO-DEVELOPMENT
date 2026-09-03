import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user?.workspaceId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const workspaceId = session.user.workspaceId

    // 1. Total Feedback
    const totalFeedback = await prisma.feedback.count({
      where: { workspaceId }
    })

    // 2. Sentiment Breakdown
    const sentimentGroups = await prisma.feedback.groupBy({
      by: ['sentiment'],
      where: { workspaceId },
      _count: {
        sentiment: true,
        _all: true
      }
    })

    const sentimentCounts = { positive: 0, negative: 0, neutral: 0 }
    let unanalyzed = 0

    sentimentGroups.forEach(group => {
      if (group.sentiment === 'positive') sentimentCounts.positive = group._count._all
      else if (group.sentiment === 'negative') sentimentCounts.negative = group._count._all
      else if (group.sentiment === 'neutral') sentimentCounts.neutral = group._count._all
      else if (group.sentiment === null) unanalyzed = group._count._all
    })

    // 3. Volume over the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const recentFeedback = await prisma.feedback.findMany({
      where: {
        workspaceId,
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      select: {
        createdAt: true
      }
    })

    // Aggregate by day
    const volumeMap = new Map<string, number>()
    
    // Initialize last 7 days with 0
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateString = d.toLocaleDateString("en-US", { month: 'short', day: 'numeric' })
      volumeMap.set(dateString, 0)
    }

    // Populate with actual data
    recentFeedback.forEach(f => {
      const dateString = f.createdAt.toLocaleDateString("en-US", { month: 'short', day: 'numeric' })
      if (volumeMap.has(dateString)) {
        volumeMap.set(dateString, volumeMap.get(dateString)! + 1)
      }
    })

    const volumeData = Array.from(volumeMap.entries()).map(([date, count]) => ({
      date,
      count
    }))

    return NextResponse.json({
      totalFeedback,
      sentimentCounts,
      unanalyzed,
      volumeData
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 })
  }
}
