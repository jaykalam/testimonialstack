import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

interface TrackRequest {
  event: 'click' | 'impression'
  testimonialId?: string
}

interface TrackResponse {
  success: boolean
  error?: string
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ widgetId: string }> }
) {
  try {
    const { widgetId } = await params

    if (!widgetId) {
      return NextResponse.json(
        { success: false, error: 'Widget ID is required' } as TrackResponse,
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      )
    }

    let body: TrackRequest
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON' } as TrackResponse,
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      )
    }

    const { event } = body

    if (!event || !['click', 'impression'].includes(event)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Event must be click or impression',
        } as TrackResponse,
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      )
    }

    // Use admin client to bypass RLS for public tracking
    const supabase = createAdminClient()

    // Verify widget exists and get current count
    const { data: widget, error: widgetError } = await supabase
      .from('widgets')
      .select('id, clicks, impressions')
      .eq('id', widgetId)
      .single()

    if (widgetError || !widget) {
      return NextResponse.json(
        { success: false, error: 'Widget not found' } as TrackResponse,
        {
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        }
      )
    }

    // Update the appropriate counter
    const updateData = event === 'click'
      ? { clicks: (widget.clicks || 0) + 1 }
      : { impressions: (widget.impressions || 0) + 1 }

    const { error: updateError } = await supabase
      .from('widgets')
      .update(updateData)
      .eq('id', widgetId)

    if (updateError) {
      console.error('Error updating widget metrics:', updateError)
      // Don't fail the request, just log the error
    }

    return NextResponse.json(
      { success: true } as TrackResponse,
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    )
  } catch (error) {
    console.error('Error tracking event:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' } as TrackResponse,
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
