import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

interface RenderResponse {
  widget: any
  testimonials: any[]
  error?: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ widgetId: string }> }
) {
  try {
    const { widgetId } = await params

    if (!widgetId) {
      return NextResponse.json(
        { error: 'Widget ID is required' } as RenderResponse,
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Cache-Control': 'public, max-age=300, s-maxage=300',
          },
        }
      )
    }

    const supabase = await createClient()

    // Fetch widget (no auth required for public rendering)
    const { data: widget, error: widgetError } = await supabase
      .from('widgets')
      .select('*')
      .eq('id', widgetId)
      .eq('is_active', true)
      .single()

    if (widgetError || !widget) {
      return NextResponse.json(
        { error: 'Widget not found or inactive' } as RenderResponse,
        {
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Cache-Control': 'public, max-age=300, s-maxage=300',
          },
        }
      )
    }

    // Fetch testimonials for this widget
    const testimonialIds = widget.testimonial_ids || []
    let testimonials = []

    if (testimonialIds.length > 0) {
      const { data: testimonialData, error: testimonialsError } = await supabase
        .from('testimonials')
        .select('*')
        .in('id', testimonialIds)
        .eq('status', 'approved')

      if (testimonialsError) {
        console.error('Error fetching testimonials:', testimonialsError)
        testimonials = []
      } else {
        testimonials = testimonialData || []
      }
    }

    // Increment impressions (fire and forget)
    supabase
      .from('widgets')
      .update({ impressions: (widget.impressions || 0) + 1 })
      .eq('id', widgetId)
      .then()
      .catch((err) => console.error('Error incrementing impressions:', err))

    const response: RenderResponse = {
      widget: {
        id: widget.id,
        name: widget.name,
        layout: widget.layout,
        settings: widget.settings,
      },
      testimonials: testimonials.map((t) => ({
        id: t.id,
        author_name: t.author_name,
        author_company: t.author_company,
        author_title: t.author_title,
        author_avatar_url: t.author_avatar_url,
        content: t.content,
        rating: t.rating,
        created_at: t.created_at,
      })),
    }

    return NextResponse.json(response, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    })
  } catch (error) {
    console.error('Error rendering widget:', error)
    return NextResponse.json(
      { error: 'Internal server error' } as RenderResponse,
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
