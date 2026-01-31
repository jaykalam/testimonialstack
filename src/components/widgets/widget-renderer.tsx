import { Testimonial, Widget, WidgetSettings } from "@/types/database";
import { Star } from "lucide-react";

interface WidgetRendererProps {
  widget: Widget;
  testimonials: Testimonial[];
  preview?: boolean;
}

export function WidgetRenderer({
  widget,
  testimonials,
  preview = false,
}: WidgetRendererProps) {
  const settings = widget.settings as unknown as WidgetSettings;

  const containerStyle = {
    backgroundColor: settings.backgroundColor,
    color: settings.textColor,
    fontFamily: settings.fontFamily,
  };

  const accentStyle = {
    borderColor: settings.accentColor,
    color: settings.accentColor,
  };

  if (widget.layout === "grid") {
    return (
      <div
        className="w-full"
        style={containerStyle}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {testimonials.slice(0, settings.maxTestimonials).map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-lg border"
              style={{
                borderColor: settings.accentColor,
                backgroundColor: settings.backgroundColor,
              }}
            >
              {settings.showAvatar && (
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                    style={{ backgroundColor: settings.accentColor }}
                  >
                    {t.author_name[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">{t.author_name}</p>
                    {settings.showCompany && t.author_company && (
                      <p className="text-xs opacity-70">{t.author_company}</p>
                    )}
                  </div>
                </div>
              )}

              {settings.showRating && t.rating && (
                <div className="flex gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-3 h-3"
                      style={{
                        fill: star <= t.rating! ? settings.accentColor : "#ccc",
                        color: star <= t.rating! ? settings.accentColor : "#ccc",
                      }}
                    />
                  ))}
                </div>
              )}

              <p className="text-sm line-clamp-4">{t.content}</p>

              {settings.showDate && (
                <p className="text-xs opacity-50 mt-2">
                  {new Date(t.created_at).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>

        {settings.showBranding && (
          <div className="text-center py-2 text-xs opacity-50 border-t">
            Powered by TestimonialStack
          </div>
        )}
      </div>
    );
  }

  if (widget.layout === "carousel") {
    return (
      <div className="w-full" style={containerStyle}>
        <div className="relative max-w-2xl mx-auto p-6">
          {testimonials.length > 0 && (
            <div
              className="p-6 rounded-lg border"
              style={{
                borderColor: settings.accentColor,
                backgroundColor: settings.backgroundColor,
              }}
            >
              {settings.showAvatar && (
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white text-lg"
                    style={{ backgroundColor: settings.accentColor }}
                  >
                    {testimonials[0].author_name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonials[0].author_name}</p>
                    {settings.showCompany && testimonials[0].author_company && (
                      <p className="text-sm opacity-70">{testimonials[0].author_company}</p>
                    )}
                  </div>
                </div>
              )}

              {settings.showRating && testimonials[0].rating && (
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-4 h-4"
                      style={{
                        fill:
                          star <= testimonials[0].rating!
                            ? settings.accentColor
                            : "#ccc",
                        color:
                          star <= testimonials[0].rating!
                            ? settings.accentColor
                            : "#ccc",
                      }}
                    />
                  ))}
                </div>
              )}

              <p className="text-base mb-4">{testimonials[0].content}</p>

              {testimonials.length > 1 && (
                <p className="text-sm opacity-70">
                  {testimonials.length} testimonials available
                </p>
              )}
            </div>
          )}
        </div>

        {settings.showBranding && (
          <div className="text-center py-2 text-xs opacity-50 border-t">
            Powered by TestimonialStack
          </div>
        )}
      </div>
    );
  }

  if (widget.layout === "wall") {
    return (
      <div className="w-full" style={containerStyle}>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-4">
          {testimonials.slice(0, settings.maxTestimonials).map((t) => (
            <div
              key={t.id}
              className="p-3 rounded text-sm"
              style={{
                backgroundColor: settings.accentColor + "15",
                borderLeft: `3px solid ${settings.accentColor}`,
              }}
            >
              <p className="font-medium text-xs mb-1">{t.author_name}</p>
              <p className="text-xs line-clamp-2 opacity-80">{t.content}</p>
            </div>
          ))}
        </div>

        {settings.showBranding && (
          <div className="text-center py-2 text-xs opacity-50 border-t">
            Powered by TestimonialStack
          </div>
        )}
      </div>
    );
  }

  if (widget.layout === "badge") {
    return (
      <div
        className="inline-block p-4 rounded-lg border"
        style={{
          borderColor: settings.accentColor,
          backgroundColor: settings.backgroundColor,
        }}
      >
        {testimonials.length > 0 && (
          <div>
            {settings.showAvatar && (
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                  style={{ backgroundColor: settings.accentColor }}
                >
                  {testimonials[0].author_name[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm">{testimonials[0].author_name}</p>
                </div>
              </div>
            )}

            {settings.showRating && testimonials[0].rating && (
              <div className="flex gap-0.5 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-3 h-3"
                    style={{
                      fill:
                        star <= testimonials[0].rating!
                          ? settings.accentColor
                          : "#ccc",
                      color:
                        star <= testimonials[0].rating!
                          ? settings.accentColor
                          : "#ccc",
                    }}
                  />
                ))}
              </div>
            )}

            <p className="text-sm max-w-xs line-clamp-3">{testimonials[0].content}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}
