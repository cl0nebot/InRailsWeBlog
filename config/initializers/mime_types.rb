# frozen_string_literal: true

# Add new mime types for use in respond_to blocks:
# Mime::Type.register "text/richtext", :rtf

InRailsWeBlog::Application.configure do
  # Correct header detection
  config.middleware.use GoogleBotAware
end
